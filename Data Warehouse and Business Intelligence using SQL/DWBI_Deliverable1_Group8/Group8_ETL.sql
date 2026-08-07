-- Cleaned listings view with exact column names
DROP VIEW IF EXISTS stg.vw_cleaned_listings;
CREATE VIEW stg.vw_cleaned_listings AS
SELECT 
    -- Property information
    id AS property_id,
    TRIM(neighbourhood_cleansed) AS neighbourhood,
    TRIM(room_type) AS room_type,
    CAST(NULLIF(bedrooms, '') AS SMALLINT) AS bedrooms,
    CAST(NULLIF(bathrooms, '') AS NUMERIC(3,1)) AS bathrooms,
    
    -- TRANSFORMATION EXAMPLE 1: Currency Normalization
    CAST(
        COALESCE(
            NULLIF(
                REGEXP_REPLACE(price, '[^0-9.]', '', 'g'), 
                ''
            ), 
            '0'
        ) AS NUMERIC(10,2)
    ) AS default_price,
    
    -- Host information
    host_id,
    TRIM(host_name) AS host_name,
    CASE WHEN host_is_superhost = 't' THEN TRUE ELSE FALSE END AS is_superhost
    
FROM stg.listings
WHERE id IS NOT NULL AND TRIM(id) != ''
  AND host_id IS NOT NULL AND TRIM(host_id) != '';

-- Cleaned calendar view with exact column names
DROP VIEW IF EXISTS stg.vw_cleaned_calendar;
CREATE VIEW stg.vw_cleaned_calendar AS
SELECT 
    CAST(NULLIF(TRIM(listing_id), '') AS INTEGER) AS listing_id,
    date,
    -- TRANSFORMATION EXAMPLE 2: Boolean Conversion
    CASE 
        WHEN available = 't' THEN TRUE
        WHEN available = 'f' THEN FALSE
        WHEN available = 'true' THEN TRUE
        WHEN available = 'false' THEN FALSE
        ELSE NULL
    END AS available
FROM stg.calendar
WHERE listing_id IS NOT NULL AND TRIM(listing_id) != ''
  AND date IS NOT NULL;

-- Cleaned reviews view (for guest dimension only)
DROP VIEW IF EXISTS stg.vw_cleaned_reviews;
CREATE VIEW stg.vw_cleaned_reviews AS
SELECT 
    reviewer_id AS guest_id,
    TRIM(reviewer_name) AS guest_name
FROM stg.reviews
WHERE reviewer_id IS NOT NULL AND TRIM(reviewer_id) != '';
--------------------------------------------------
--------------------------------------------------
-- ETL PIPELINE WITH DUPLICATE HANDLING
SET search_path TO stg, dw;

-- Step 1: Populate DimDate (safe approach)
INSERT INTO dw.dim_date (
    date_key, full_date, year, quarter, month, 
    month_name, day_of_month, day_of_week, day_name, weekend_flag
)
SELECT 
    TO_CHAR(date_seq, 'YYYYMMDD')::INTEGER AS date_key,
    date_seq::DATE AS full_date,
    EXTRACT(YEAR FROM date_seq) AS year,
    EXTRACT(QUARTER FROM date_seq) AS quarter,
    EXTRACT(MONTH FROM date_seq) AS month,
    TO_CHAR(date_seq, 'Month') AS month_name,
    EXTRACT(DAY FROM date_seq) AS day_of_month,
    EXTRACT(ISODOW FROM date_seq) AS day_of_week,
    TO_CHAR(date_seq, 'Day') AS day_name,
    EXTRACT(ISODOW FROM date_seq) IN (6,7) AS weekend_flag
FROM generate_series(
    COALESCE((SELECT MIN(date) FROM stg.calendar WHERE date IS NOT NULL), CURRENT_DATE - 365)::DATE,
    COALESCE((SELECT MAX(date) FROM stg.calendar WHERE date IS NOT NULL), CURRENT_DATE + 365)::DATE,
    '1 day'::INTERVAL
) AS date_seq
WHERE NOT EXISTS (
    SELECT 1 FROM dw.dim_date WHERE date_key = TO_CHAR(date_seq, 'YYYYMMDD')::INTEGER
);
select*
from dw.dim
-- Step 2: Load DimHost - FIXED (no ON CONFLICT)
INSERT INTO dw.dim_host (host_id, host_name, is_superhost)
SELECT 
    host_id,
    COALESCE(host_name, 'Unknown') AS host_name,
    COALESCE(is_superhost, FALSE) AS is_superhost
FROM (
    SELECT DISTINCT ON (host_id)
        host_id,
        host_name,
        is_superhost
    FROM stg.vw_cleaned_listings
    WHERE host_id IS NOT NULL AND TRIM(host_id) != ''
      AND NOT EXISTS (SELECT 1 FROM dw.dim_host WHERE dim_host.host_id = stg.vw_cleaned_listings.host_id)
    ORDER BY host_id
) AS new_hosts;

-- Step 3: Load DimGuest - FIXED (no ON CONFLICT)
INSERT INTO dw.dim_guest (guest_id, guest_name)
SELECT 
    guest_id,
    COALESCE(guest_name, 'Anonymous') AS guest_name
FROM (
    SELECT DISTINCT ON (guest_id)
        guest_id,
        guest_name
    FROM stg.vw_cleaned_reviews
    WHERE guest_id IS NOT NULL AND TRIM(guest_id) != ''
      AND NOT EXISTS (SELECT 1 FROM dw.dim_guest WHERE dim_guest.guest_id = stg.vw_cleaned_reviews.guest_id)
    ORDER BY guest_id
) AS new_guests;

-- Step 4: Load DimProperty - FIXED (no ON CONFLICT)
INSERT INTO dw.dim_property (
    property_id, neighbourhood, room_type, bedrooms, bathrooms, default_price
)
SELECT 
    property_id,
    COALESCE(neighbourhood, 'Unknown') AS neighbourhood,
    COALESCE(room_type, 'Unknown') AS room_type,
    COALESCE(bedrooms, 1) AS bedrooms,
    COALESCE(bathrooms, 1.0) AS bathrooms,
    COALESCE(default_price, 0) AS default_price
FROM (
    SELECT DISTINCT ON (property_id)
        property_id,
        neighbourhood,
        room_type,
        bedrooms,
        bathrooms,
        default_price
    FROM stg.vw_cleaned_listings
    WHERE property_id IS NOT NULL AND TRIM(property_id) != ''
      AND NOT EXISTS (SELECT 1 FROM dw.dim_property WHERE dim_property.property_id = stg.vw_cleaned_listings.property_id)
    ORDER BY property_id
) AS new_properties;

-- Step 5: Create Default Guest if needed - FIXED (no ON CONFLICT)
INSERT INTO dw.dim_guest (guest_id, guest_name)
SELECT 'default_guest', 'Default Guest'
WHERE NOT EXISTS (SELECT 1 FROM dw.dim_guest WHERE guest_id = 'default_guest');


-- SIMPLEST FIX - Just cast in the join condition
-- FIXED: Ensure dates exist in dim_date
TRUNCATE TABLE dw.fact_bookings;

WITH valid_bookings AS (
    SELECT DISTINCT
        listing_id::TEXT AS listing_id,
        date AS checkin_date,
        (date + INTERVAL '2 days')::DATE AS checkout_date,
        2 AS nights
    FROM stg.calendar
    WHERE available = 'f'
      AND date BETWEEN (SELECT MIN(full_date) FROM dw.dim_date) 
                   AND (SELECT MAX(full_date) FROM dw.dim_date)
    LIMIT 1000
)
INSERT INTO dw.fact_bookings (
    property_key, host_key, guest_key, checkin_date_key, checkout_date_key,
    nights, price_per_night, total_revenue
)
SELECT 
    p.property_key,
    h.host_key,
    (SELECT guest_key FROM dw.dim_guest LIMIT 1) AS guest_key,
    TO_CHAR(vb.checkin_date, 'YYYYMMDD')::INTEGER AS checkin_date_key,
    TO_CHAR(vb.checkout_date, 'YYYYMMDD')::INTEGER AS checkout_date_key,
    vb.nights,
    p.default_price AS price_per_night,
    vb.nights * p.default_price AS total_revenue
FROM valid_bookings vb
JOIN dw.dim_property p ON vb.listing_id = p.property_id
JOIN dw.dim_host h ON p.property_id IN (
    SELECT property_id FROM stg.vw_cleaned_listings cl WHERE cl.host_id = h.host_id
)
WHERE EXISTS (SELECT 1 FROM dw.dim_date WHERE date_key = TO_CHAR(vb.checkin_date, 'YYYYMMDD')::INTEGER)
  AND EXISTS (SELECT 1 FROM dw.dim_date WHERE date_key = TO_CHAR(vb.checkout_date, 'YYYYMMDD')::INTEGER);

-- FINAL VALIDATION
DO $$
BEGIN
    RAISE NOTICE 'ETL COMPLETED SUCCESSFULLY!';
    RAISE NOTICE 'DimHost records: %', (SELECT COUNT(*) FROM dw.dim_host);
    RAISE NOTICE 'DimProperty records: %', (SELECT COUNT(*) FROM dw.dim_property);
    RAISE NOTICE 'FactBookings records: %', (SELECT COUNT(*) FROM dw.fact_bookings);
END $$;

WITH calendar_sequences AS (
    SELECT 
        listing_id,
        date,
        available,
        LAG(available) OVER (PARTITION BY listing_id ORDER BY date) AS prev_available,
        LEAD(available) OVER (PARTITION BY listing_id ORDER BY date) AS next_available
    FROM stg.vw_cleaned_calendar
    WHERE available IS NOT NULL
),
booking_starts AS (
    SELECT 
        listing_id,
        date AS checkin_date,
        (SELECT MIN(date) 
         FROM stg.vw_cleaned_calendar c2 
         WHERE c2.listing_id = cs.listing_id 
           AND c2.date > cs.date 
           AND c2.available = true) AS checkout_date
    FROM calendar_sequences cs
    WHERE available = false 
      AND (prev_available = true OR prev_available IS NULL)
),
valid_bookings AS (
    SELECT 
        bs.listing_id,
        bs.checkin_date,
        bs.checkout_date,
        (bs.checkout_date - bs.checkin_date) AS nights
    FROM booking_starts bs
    WHERE bs.checkout_date IS NOT NULL
      AND (bs.checkout_date - bs.checkin_date) > 0
      AND (bs.checkout_date - bs.checkin_date) <= 90 -- reasonable limit
)
INSERT INTO dw.fact_bookings (
    property_key, host_key, guest_key, checkin_date_key, checkout_date_key,
    nights, price_per_night, total_revenue
)
SELECT DISTINCT
    p.property_key,
    h.host_key,
    COALESCE(g.guest_key, (SELECT guest_key FROM dw.dim_guest WHERE guest_id = 'default_guest')) AS guest_key,
    TO_CHAR(vb.checkin_date, 'YYYYMMDD')::INTEGER AS checkin_date_key,
    TO_CHAR(vb.checkout_date, 'YYYYMMDD')::INTEGER AS checkout_date_key,
    vb.nights,
    p.default_price AS price_per_night,
    vb.nights * p.default_price AS total_revenue
FROM valid_bookings vb
JOIN dw.dim_property p ON vb.listing_id::TEXT = p.property_id
JOIN dw.dim_host h ON EXISTS (
    SELECT 1 FROM stg.vw_cleaned_listings cl 
    WHERE cl.property_id = p.property_id AND cl.host_id = h.host_id
)
CROSS JOIN (SELECT guest_key FROM dw.dim_guest WHERE guest_id = 'default_guest' LIMIT 1) g
WHERE vb.nights > 0;