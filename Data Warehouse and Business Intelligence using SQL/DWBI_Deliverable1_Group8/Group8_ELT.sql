-- ELT Workflow: Load raw data first, then transform in PostgreSQL
SET search_path TO dw;

-- Create ELT fact table to compare with ETL
DROP TABLE IF EXISTS dw.fact_bookings_elt;
CREATE TABLE dw.fact_bookings_elt (
    booking_key         BIGSERIAL PRIMARY KEY,
    property_key        INTEGER NOT NULL,
    host_key            INTEGER NOT NULL,
    guest_key           INTEGER,
    checkin_date_key    INTEGER NOT NULL,
    checkout_date_key   INTEGER NOT NULL,
    nights              SMALLINT NOT NULL,
    price_per_night     NUMERIC(10,2) NOT NULL,
    total_revenue       NUMERIC(12,2) NOT NULL,
    load_method         VARCHAR(10) DEFAULT 'ELT',
    -- Foreign keys
    CONSTRAINT fk_fbelt_property  FOREIGN KEY (property_key)
        REFERENCES dw.dim_property(property_key),
    CONSTRAINT fk_fbelt_host      FOREIGN KEY (host_key)
        REFERENCES dw.dim_host(host_key),
    CONSTRAINT fk_fbelt_guest     FOREIGN KEY (guest_key)
        REFERENCES dw.dim_guest(guest_key),
    CONSTRAINT fk_fbelt_chk_in    FOREIGN KEY (checkin_date_key)
        REFERENCES dw.dim_date(date_key),
    CONSTRAINT fk_fbelt_chk_out   FOREIGN KEY (checkout_date_key)
        REFERENCES dw.dim_date(date_key)
);

-- Create staging tables in DW schema for ELT
DROP TABLE IF EXISTS dw.stg_listings_elt;
CREATE TABLE dw.stg_listings_elt AS SELECT * FROM stg.listings;

DROP TABLE IF EXISTS dw.stg_calendar_elt;
CREATE TABLE dw.stg_calendar_elt AS SELECT * FROM stg.calendar;

DROP TABLE IF EXISTS dw.stg_reviews_elt;
CREATE TABLE dw.stg_reviews_elt AS SELECT * FROM stg.reviews;

-- ELT STEP 1: Transform raw data inside PostgreSQL
WITH cleaned_listings AS (
    -- Clean listings data
    SELECT 
        CAST(NULLIF(TRIM(id), '') AS TEXT) AS property_id,
        CAST(NULLIF(TRIM(host_id), '') AS TEXT) AS host_id,
        COALESCE(NULLIF(TRIM(host_name), ''), 'Unknown') AS host_name,
        CASE WHEN host_is_superhost = 't' THEN TRUE ELSE FALSE END AS is_superhost,
        COALESCE(NULLIF(TRIM(neighbourhood_cleansed), ''), 'Unknown') AS neighbourhood,
        COALESCE(NULLIF(TRIM(room_type), ''), 'Unknown') AS room_type,
        CAST(COALESCE(NULLIF(bedrooms, ''), '1') AS SMALLINT) AS bedrooms,
        CAST(NULLIF(bathrooms, '') AS NUMERIC(3,1)) AS bathrooms,
        CAST(
            COALESCE(
                NULLIF(REGEXP_REPLACE(price, '[^0-9.]', '', 'g'), ''), 
                '0'
            ) AS NUMERIC(10,2)
        ) AS default_price
    FROM dw.stg_listings_elt
    WHERE id IS NOT NULL AND TRIM(id) != ''
      AND host_id IS NOT NULL AND TRIM(host_id) != ''
),
cleaned_calendar AS (
    -- Clean calendar data
    SELECT 
        listing_id::TEXT,
        date,
        CASE 
            WHEN available = 't' THEN TRUE
            WHEN available = 'f' THEN FALSE
            ELSE NULL
        END AS available
    FROM dw.stg_calendar_elt
    WHERE listing_id IS NOT NULL AND date IS NOT NULL
),
booking_detection AS (
    -- Detect bookings using window functions
    SELECT 
        listing_id,
        date AS checkin_date,
        LEAD(date) OVER (PARTITION BY listing_id ORDER BY date) AS checkout_date,
        available,
        LAG(available) OVER (PARTITION BY listing_id ORDER BY date) AS prev_available
    FROM cleaned_calendar
),
valid_bookings AS (
    -- Identify valid booking periods
    SELECT 
        listing_id,
        checkin_date,
        checkout_date,
        (checkout_date - checkin_date) AS nights
    FROM booking_detection
    WHERE available = false 
      AND (prev_available = true OR prev_available IS NULL)
      AND checkout_date IS NOT NULL
      AND (checkout_date - checkin_date) > 0
      AND (checkout_date - checkin_date) <= 30
),
final_bookings AS (
    -- Final booking records with all joins
    SELECT 
        p.property_key,
        h.host_key,
        COALESCE(g.guest_key, (SELECT guest_key FROM dw.dim_guest WHERE guest_id = 'default_guest')) AS guest_key,
        TO_CHAR(vb.checkin_date, 'YYYYMMDD')::INTEGER AS checkin_date_key,
        TO_CHAR(vb.checkout_date, 'YYYYMMDD')::INTEGER AS checkout_date_key,
        vb.nights,
        p.default_price AS price_per_night,
        vb.nights * p.default_price AS total_revenue
    FROM valid_bookings vb
    JOIN dw.dim_property p ON vb.listing_id = p.property_id
    JOIN dw.dim_host h ON p.property_id IN (
        SELECT property_id FROM cleaned_listings cl WHERE cl.host_id = h.host_id
    )
    LEFT JOIN dw.dim_guest g ON g.guest_key IS NOT NULL
    WHERE EXISTS (SELECT 1 FROM dw.dim_date WHERE date_key = TO_CHAR(vb.checkin_date, 'YYYYMMDD')::INTEGER)
      AND EXISTS (SELECT 1 FROM dw.dim_date WHERE date_key = TO_CHAR(vb.checkout_date, 'YYYYMMDD')::INTEGER)
)
-- ELT STEP 2: Load transformed data into ELT fact table
INSERT INTO dw.fact_bookings_elt (
    property_key, host_key, guest_key, checkin_date_key, checkout_date_key,
    nights, price_per_night, total_revenue, load_method
)
SELECT 
    property_key, host_key, guest_key, checkin_date_key, checkout_date_key,
    nights, price_per_night, total_revenue, 'ELT'
FROM final_bookings;

-- FINAL COMPARISON FOR SCREENSHOT
SELECT 
    'ETL' as method,
    COUNT(*) as booking_count,
    COALESCE(SUM(total_revenue), 0) as total_revenue,
    ROUND(AVG(nights), 2) as avg_nights,
    ROUND(AVG(price_per_night), 2) as avg_price
FROM dw.fact_bookings

UNION ALL

SELECT 
    'ELT' as method,
    COUNT(*) as booking_count,
    COALESCE(SUM(total_revenue), 0) as total_revenue,
    ROUND(AVG(nights), 2) as avg_nights,
    ROUND(AVG(price_per_night), 2) as avg_price
FROM dw.fact_bookings_elt

ORDER BY method;