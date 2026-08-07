-- Schema Justification and Performance Recommendations
-- Group #: [Your Group Number]

-- ================ PRIMARY KEY JUSTIFICATIONS ================

-- 1. DimDate Primary Key: date_key (INTEGER - YYYYMMDD format)
/*
JUSTIFICATION:
- Integer-based date key (YYYYMMDD) provides efficient sorting and range queries
- Faster than DATE type for joins in large fact tables
- Compatible with all SQL databases and BI tools
- Natural chronological ordering for time-series analysis
*/
SELECT 'DimDate: date_key (INTEGER YYYYMMDD) - Efficient for time-series analytics and joins' as justification;

-- 2. DimProperty Primary Key: property_key (SERIAL)
/*
JUSTIFICATION:
- Surrogate key (SERIAL) ensures stability regardless of source system changes
- Property_id from source may change, but property_key remains constant
- Smaller integer keys improve fact table performance and storage
- Enables Type 1 SCD (Slowly Changing Dimension) implementation
*/
SELECT 'DimProperty: property_key (SERIAL) - Surrogate key for SCD and performance' as justification;

-- 3. DimHost Primary Key: host_key (SERIAL)  
/*
JUSTIFICATION:
- Surrogate key provides independence from source system identifiers
- Integer keys reduce storage and improve join performance in fact tables
- Supports host dimension updates without affecting historical facts
*/
SELECT 'DimHost: host_key (SERIAL) - Surrogate key for dimension management' as justification;

-- ================ FOREIGN KEY JUSTIFICATIONS ================

-- 1. FactBookings Foreign Keys
/*
JUSTIFICATION:
- property_key: Links to property attributes (neighborhood, room_type, price)
- host_key: Connects to host information for host performance analysis  
- checkin_date_key/checkout_date_key: Enables time intelligence and seasonal analysis
- All foreign keys use integer surrogate keys for optimal join performance
*/
SELECT 'FactBookings FK: property_key, host_key, date_keys - Star schema relationships for business questions' as justification;

-- ================ RECOMMENDED INDEXES FOR PERFORMANCE ================

-- 1. FactBookings: checkin_date_key
/*
WHY INDEX:
- Most queries will filter by date ranges (seasonal analysis, time periods)
- Enables efficient date-based aggregations and rolling calculations
- Critical for time-series analysis and trend reporting
*/
CREATE INDEX IF NOT EXISTS idx_fact_bookings_checkin_date 
ON dw.fact_bookings(checkin_date_key);

SELECT 'Index 1: idx_fact_bookings_checkin_date - Optimizes date-range queries and seasonal analysis' as index_reason;

-- 2. FactBookings: property_key  
/*
WHY INDEX:
- Frequent filtering by property attributes (neighborhood, room_type)
- Supports property-level performance analysis
- Essential for drill-down reports from aggregates to property details
*/
CREATE INDEX IF NOT EXISTS idx_fact_bookings_property 
ON dw.fact_bookings(property_key);

SELECT 'Index 2: idx_fact_bookings_property - Accelerates property-level analysis and joins' as index_reason;

-- 3. DimProperty: neighbourhood
/*
WHY INDEX:
- Core dimension for "revenue by neighborhood" business question
- Enables fast grouping and filtering by geographic areas
- Supports choropleth maps and geographic analysis in Power BI
*/
CREATE INDEX IF NOT EXISTS idx_dim_property_neighbourhood 
ON dw.dim_property(neighbourhood);

SELECT 'Index 3: idx_dim_property_neighbourhood - Optimizes neighborhood-based queries and maps' as index_reason;

-- 4. FactBookings: host_key
/*
WHY INDEX:
- Supports host performance dashboards and superhost analysis
- Enables efficient host-level aggregations
- Critical for "Host Performance" business questions
*/
CREATE INDEX IF NOT EXISTS idx_fact_bookings_host 
ON dw.fact_bookings(host_key);

SELECT 'Index 4: idx_fact_bookings_host - Improves host performance analysis queries' as index_reason;

-- 5. DimProperty: room_type
/*
WHY INDEX:
- Frequently filtered dimension for room type analysis
- Supports "what drives guest satisfaction" by room type
- Enables fast room-type based segmentation
*/
CREATE INDEX IF NOT EXISTS idx_dim_property_room_type 
ON dw.dim_property(room_type);

SELECT 'Index 5: idx_dim_property_room_type - Speeds up room-type segmentation and analysis' as index_reason;

-- ================ ADDITIONAL PERFORMANCE OPTIMIZATIONS ================

-- 1. Composite Index for Common Query Patterns
/*
For queries that frequently filter by both date and neighborhood
*/
CREATE INDEX IF NOT EXISTS idx_fact_bookings_date_property 
ON dw.fact_bookings(checkin_date_key, property_key);

SELECT 'Composite Index: idx_fact_bookings_date_property - Optimizes time-based property analysis' as optimization;

-- 2. Covering Index for Revenue Analysis
/*
Covers common revenue analysis queries without table access
*/
CREATE INDEX IF NOT EXISTS idx_fact_bookings_revenue_cover 
ON dw.fact_bookings(checkin_date_key, property_key, total_revenue, nights);

SELECT 'Covering Index: idx_fact_bookings_revenue_cover - Eliminates table access for revenue queries' as optimization;

-- ================ SCHEMA DESIGN RATIONALE ================

-- Business Question Alignment
SELECT 'SCHEMA RATIONALE:' as section;
SELECT '1. Star Schema: Optimized for BI tools and analytical queries' as rationale;
SELECT '2. Surrogate Keys: Ensure stability and enable SCD Type 1' as rationale;
SELECT '3. Integer Date Keys: Efficient for time intelligence functions' as rationale;
SELECT '4. Lean Dimensions: Focus on core business attributes only' as rationale;
SELECT '5. Fact Granularity: One row per booking enables flexible aggregation' as rationale;

-- Index Strategy Summary
SELECT 'INDEX STRATEGY SUMMARY:' as section;
SELECT '• Date-based indexes for temporal analysis' as strategy;
SELECT '• Dimension attributes for filtering and grouping' as strategy;  
SELECT '• Foreign keys for join performance' as strategy;
SELECT '• Composite indexes for common query patterns' as strategy;
SELECT '• Covering indexes to eliminate table access' as strategy;

-- Verify Index Creation
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'dw'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;