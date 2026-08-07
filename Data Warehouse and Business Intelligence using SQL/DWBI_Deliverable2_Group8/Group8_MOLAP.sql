-- MOLAP Precomputed Summary Tables for Fast Analytics
SET search_path TO dw;

-- MOLAP TABLE 1: Monthly Neighborhood Summary
DROP TABLE IF EXISTS dw.molap_monthly_neighborhood;
CREATE TABLE dw.molap_monthly_neighborhood AS
SELECT 
    d.year,
    d.month,
    d.month_name,
    p.neighbourhood,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue,
    SUM(fb.nights) as total_nights,
    ROUND(AVG(fb.price_per_night), 2) as avg_nightly_rate,
    ROUND(AVG(fb.nights), 1) as avg_stay_length,
    ROUND(SUM(fb.total_revenue) / COUNT(*), 2) as avg_booking_value,
    CURRENT_TIMESTAMP as refresh_timestamp
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
GROUP BY d.year, d.month, d.month_name, p.neighbourhood;

-- Create indexes for fast querying
CREATE INDEX idx_molap_neighborhood_year_month ON dw.molap_monthly_neighborhood(year, month);
CREATE INDEX idx_molap_neighborhood_neighbourhood ON dw.molap_monthly_neighborhood(neighbourhood);

-- MOLAP TABLE 2: Quarterly Room Type Performance
DROP TABLE IF EXISTS dw.molap_quarterly_roomtype;
CREATE TABLE dw.molap_quarterly_roomtype AS
SELECT 
    d.year,
    d.quarter,
    p.room_type,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue,
    SUM(fb.nights) as total_nights,
    ROUND(AVG(fb.price_per_night), 2) as avg_nightly_rate,
    ROUND(SUM(fb.total_revenue) / SUM(fb.nights), 2) as revpar,
    CURRENT_TIMESTAMP as refresh_timestamp
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
GROUP BY d.year, d.quarter, p.room_type;

CREATE INDEX idx_molap_roomtype_quarter ON dw.molap_quarterly_roomtype(year, quarter);

-- MOLAP TABLE 3: Host Performance Summary
DROP TABLE IF EXISTS dw.molap_host_performance;
CREATE TABLE dw.molap_host_performance AS
SELECT 
    h.host_key,
    h.host_name,
    h.is_superhost,
    COUNT(*) as total_bookings,
    SUM(fb.total_revenue) as total_revenue,
    ROUND(AVG(fb.price_per_night), 2) as avg_nightly_rate,
    ROUND(AVG(fb.nights), 1) as avg_stay_length,
    COUNT(DISTINCT p.property_key) as properties_managed,
    CURRENT_TIMESTAMP as refresh_timestamp
FROM dw.fact_bookings fb
JOIN dw.dim_host h ON fb.host_key = h.host_key
JOIN dw.dim_property p ON fb.property_key = p.property_key
GROUP BY h.host_key, h.host_name, h.is_superhost;

CREATE INDEX idx_molap_host_performance ON dw.molap_host_performance(total_revenue DESC);

-- MOLAP TABLE 4: Daily Booking Summary (for trend analysis)
DROP TABLE IF EXISTS dw.molap_daily_summary;
CREATE TABLE dw.molap_daily_summary AS
SELECT 
    d.date_key,
    d.full_date,
    d.year,
    d.month,
    d.day_of_week,
    d.weekend_flag,
    COUNT(*) as daily_bookings,
    SUM(fb.total_revenue) as daily_revenue,
    SUM(fb.nights) as daily_nights,
    CURRENT_TIMESTAMP as refresh_timestamp
FROM dw.fact_bookings fb
JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
GROUP BY d.date_key, d.full_date, d.year, d.month, d.day_of_week, d.weekend_flag;

CREATE INDEX idx_molap_daily_date ON dw.molap_daily_summary(full_date);

-- VERIFICATION: Compare MOLAP vs OLAP results (SIDE-BY-SIDE VERSION)
SELECT 'MOLAP vs OLAP Verification - Side by Side Comparison' as verification_test;

-- Test 1: Monthly Revenue by Neighborhood (Side-by-Side)
SELECT 'Test 1: Monthly Neighborhood Revenue Comparison' as test_name;

WITH available_dates AS (
    SELECT 
        d.year,
        d.month,
        d.month_name
    FROM dw.fact_bookings fb
    JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
    GROUP BY d.year, d.month, d.month_name
    ORDER BY COUNT(*) DESC
    LIMIT 1
),
olap_results AS (
    SELECT 
        d.year,
        d.month_name,
        p.neighbourhood,
        SUM(fb.total_revenue) as revenue,
        COUNT(*) as bookings
    FROM dw.fact_bookings fb
    JOIN dw.dim_property p ON fb.property_key = p.property_key
    JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
    WHERE (d.year, d.month) IN (SELECT year, month FROM available_dates)
    GROUP BY d.year, d.month_name, p.neighbourhood
),
molap_results AS (
    SELECT 
        year,
        month_name,
        neighbourhood,
        SUM(total_revenue) as revenue,
        SUM(booking_count) as bookings
    FROM dw.molap_monthly_neighborhood
    WHERE (year, month) IN (SELECT year, month FROM available_dates)
    GROUP BY year, month_name, neighbourhood
),
combined_results AS (
    SELECT 
        COALESCE(o.neighbourhood, m.neighbourhood) as neighbourhood,
        COALESCE(o.year, m.year) as year,
        COALESCE(o.month_name, m.month_name) as month_name,
        o.revenue as olap_revenue,
        o.bookings as olap_bookings,
        m.revenue as molap_revenue,
        m.bookings as molap_bookings,
        CASE 
            WHEN o.revenue = m.revenue AND o.bookings = m.bookings THEN 'MATCH'
            WHEN o.revenue IS NULL THEN 'MISSING IN OLAP'
            WHEN m.revenue IS NULL THEN 'MISSING IN MOLAP'
            ELSE 'MISMATCH'
        END as status
    FROM olap_results o
    FULL OUTER JOIN molap_results m ON o.neighbourhood = m.neighbourhood 
        AND o.year = m.year AND o.month_name = m.month_name
)
SELECT 
    neighbourhood,
    year,
    month_name,
    olap_revenue,
    molap_revenue,
    olap_bookings,
    molap_bookings,
    status
FROM combined_results
ORDER BY COALESCE(olap_revenue, molap_revenue) DESC
LIMIT 10;

-- Side-by-side comparison test 2
WITH olap_results AS (
    SELECT 
        p.room_type,
        COUNT(*) as olap_bookings,
        SUM(fb.total_revenue) as olap_revenue
    FROM dw.fact_bookings fb
    JOIN dw.dim_property p ON fb.property_key = p.property_key
    GROUP BY p.room_type
),
molap_results AS (
    SELECT 
        room_type,
        SUM(booking_count) as molap_bookings,
        SUM(total_revenue) as molap_revenue
    FROM dw.molap_quarterly_roomtype
    GROUP BY room_type
)
SELECT 
    COALESCE(o.room_type, m.room_type) as room_type,
    o.olap_bookings,
    m.molap_bookings,
    o.olap_revenue,
    m.molap_revenue,
    CASE 
        WHEN o.olap_bookings = m.molap_bookings AND o.olap_revenue = m.molap_revenue 
        THEN 'MATCH' 
        ELSE 'MISMATCH' 
    END as verification
FROM olap_results o
FULL OUTER JOIN molap_results m ON o.room_type = m.room_type
ORDER BY COALESCE(o.olap_revenue, m.molap_revenue) DESC;

-- Test 3: Total Revenue Comparison
SELECT 'Test 3: Total Revenue Verification' as test_name;
SELECT 
    'OLAP Total Revenue' as source,
    SUM(total_revenue) as total_revenue
FROM dw.fact_bookings

UNION ALL

SELECT 
    'MOLAP Neighborhood Total' as source,
    SUM(total_revenue) as total_revenue
FROM dw.molap_monthly_neighborhood;

-- Performance Comparison Query
SELECT 'Performance Benchmark: MOLAP vs OLAP' as benchmark;

-- OLAP Query Execution
EXPLAIN ANALYZE
SELECT 
    d.year,
    d.month_name,
    p.neighbourhood,
    SUM(fb.total_revenue) as revenue
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
GROUP BY d.year, d.month_name, p.neighbourhood;

-- MOLAP Query Execution  
EXPLAIN ANALYZE
SELECT 
    year,
    month_name,
    neighbourhood,
    SUM(total_revenue) as revenue
FROM dw.molap_monthly_neighborhood
GROUP BY year, month_name, neighbourhood;

-- MOLAP Table Statistics
SELECT 
    'MOLAP Summary Tables Created' as status,
    (SELECT COUNT(*) FROM dw.molap_monthly_neighborhood) as monthly_neighborhood_records,
    (SELECT COUNT(*) FROM dw.molap_quarterly_roomtype) as quarterly_roomtype_records,
    (SELECT COUNT(*) FROM dw.molap_host_performance) as host_performance_records,
    (SELECT COUNT(*) FROM dw.molap_daily_summary) as daily_summary_records;








