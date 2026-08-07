-- Join Techniques and Query Optimization Analysis
SET search_path TO dw;

-- ================ DEMONSTRATE DIFFERENT JOIN ALGORITHMS ================

-- QUERY 1: Business Query for Join Analysis
-- "Revenue by Neighborhood and Room Type with Host Superhost Status"
SELECT 
    p.neighbourhood,
    p.room_type,
    h.is_superhost,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
JOIN dw.dim_host h ON fb.host_key = h.host_key
-- REMOVED restrictive filters to ensure data exists
GROUP BY p.neighbourhood, p.room_type, h.is_superhost
ORDER BY total_revenue DESC
LIMIT 10;

-- ================ FORCE NESTED LOOP JOIN ================

SET enable_hashjoin = off;
SET enable_mergejoin = off;
SET enable_material = off;

EXPLAIN (ANALYZE, BUFFERS, FORMAT json) 
SELECT 
    p.neighbourhood,
    p.room_type,
    h.is_superhost,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
JOIN dw.dim_host h ON fb.host_key = h.host_key
-- REMOVED restrictive filters to ensure data exists
GROUP BY p.neighbourhood, p.room_type, h.is_superhost
ORDER BY total_revenue DESC
LIMIT 10;

-- ================ FORCE SORT-MERGE JOIN ================

SET enable_hashjoin = off;
SET enable_nestloop = off;
SET enable_mergejoin = on;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
SELECT 
    p.neighbourhood,
    p.room_type,
    h.is_superhost,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
JOIN dw.dim_host h ON fb.host_key = h.host_key
-- REMOVED restrictive filters to ensure data exists
GROUP BY p.neighbourhood, p.room_type, h.is_superhost
ORDER BY total_revenue DESC
LIMIT 10;

-- ================ FORCE HASH JOIN (DEFAULT) ================

SET enable_hashjoin = on;
SET enable_nestloop = off;
SET enable_mergejoin = off;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
SELECT 
    p.neighbourhood,
    p.room_type,
    h.is_superhost,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
JOIN dw.dim_host h ON fb.host_key = h.host_key
-- REMOVED restrictive filters to ensure data exists
GROUP BY p.neighbourhood, p.room_type, h.is_superhost
ORDER BY total_revenue DESC
LIMIT 10;

-- Reset to default planner settings
RESET enable_hashjoin;
RESET enable_nestloop;
RESET enable_mergejoin;
RESET enable_material;

--===========================================
-- DSS vs OLTP Query Comparison Analysis
SET search_path TO dw;

-- ================ DSS (Decision Support System) QUERY ================

SELECT 'DSS QUERY: Monthly Revenue by Neighborhood (Analytical)' as query_type;

-- This is a typical DSS query - complex aggregations across large datasets
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT 
    d.year,
    d.month_name,
    p.neighbourhood,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue,
    AVG(fb.price_per_night) as avg_nightly_rate,
    SUM(fb.nights) as total_nights,
    ROUND(SUM(fb.total_revenue) / COUNT(*), 2) as avg_booking_value
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
WHERE d.year BETWEEN 2023 AND 2024
GROUP BY d.year, d.month_name, p.neighbourhood
HAVING COUNT(*) > 10  -- Only show neighborhoods with significant activity
ORDER BY total_revenue DESC

-- ================ OLTP (Online Transaction Processing) QUERY ================

SELECT 'OLTP QUERY: Find Specific Booking Details (Transactional)' as query_type;

-- This is a typical OLTP query - simple lookup of specific record
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT 
    fb.booking_key,
    fb.nights,
    fb.price_per_night,
    fb.total_revenue,
    p.neighbourhood,
    p.room_type,
    h.host_name,
    d.full_date as checkin_date
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
JOIN dw.dim_host h ON fb.host_key = h.host_key
JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
WHERE fb.booking_key = 1;  -- Specific primary key lookup

-- ================ COMPARISON ANALYSIS ================
WITH join_comparison AS (
    SELECT 
        'Nested Loop' as join_type,
        'fact_bookings + dim_property + dim_host' as tables_joined,
         52.59 as execution_time_ms,
        'Works well on small tables' as observations
    UNION ALL
    SELECT 
        'Sort-Merge' as join_type,
        'fact_bookings + dim_property + dim_host' as tables_joined,
        44 as execution_time_ms,
        'Efficient for sorted input' as observations
    UNION ALL
    SELECT 
        'Hash Join' as join_type,
        'fact_bookings + dim_property + dim_host' as tables_joined,
        27.8 as execution_time_ms,
        'Best performance overall' as observations
)
SELECT * FROM join_comparison;



