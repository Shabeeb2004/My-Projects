-- OLAP Analytical Queries for Property Rental Business Intelligence
SET search_path TO dw;

-- QUERY 1: Monthly Revenue by Neighborhood (Core Business Question)
SELECT 
    d.year,
    d.month_name,
    p.neighbourhood,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue,
    ROUND(AVG(fb.total_revenue), 2) as avg_booking_value,
    SUM(fb.nights) as total_nights_booked
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
GROUP BY d.year, d.month_name, p.neighbourhood
ORDER BY d.year, d.month_name, total_revenue DESC;

-- QUERY 2: Seasonal Demand Analysis (Quarterly Trends)
SELECT 
    d.year,
    d.quarter,
    CASE 
        WHEN d.quarter = 1 THEN 'Q1-Winter'
        WHEN d.quarter = 2 THEN 'Q2-Spring' 
        WHEN d.quarter = 3 THEN 'Q3-Summer'
        WHEN d.quarter = 4 THEN 'Q4-Fall'
    END as season,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue,
    ROUND(AVG(fb.nights), 1) as avg_stay_length
FROM dw.fact_bookings fb
JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
GROUP BY d.year, d.quarter
ORDER BY d.year, d.quarter;

-- QUERY 3: Host Performance - Superhost vs Regular
SELECT 
    h.is_superhost,
    COUNT(DISTINCT h.host_key) as host_count,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue,
    ROUND(SUM(fb.total_revenue) / COUNT(DISTINCT h.host_key), 2) as revenue_per_host,
    ROUND(AVG(fb.price_per_night), 2) as avg_nightly_rate
FROM dw.fact_bookings fb
JOIN dw.dim_host h ON fb.host_key = h.host_key
GROUP BY h.is_superhost
ORDER BY total_revenue DESC;

-- QUERY 4: Room Type Performance Analysis
SELECT 
    p.room_type,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue,
    ROUND(AVG(fb.price_per_night), 2) as avg_nightly_rate,
    ROUND(AVG(fb.nights), 1) as avg_stay_length,
    ROUND(SUM(fb.total_revenue) / COUNT(*), 2) as avg_booking_value
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
GROUP BY p.room_type
ORDER BY total_revenue DESC;

-- QUERY 5: Revenue per Bedroom by Neighborhood (Key KPI)
SELECT 
    p.neighbourhood,
    p.bedrooms,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue,
    ROUND(SUM(fb.total_revenue) / NULLIF(p.bedrooms, 0), 2) as revenue_per_bedroom,
    ROUND(AVG(fb.price_per_night), 2) as avg_nightly_rate
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
WHERE p.bedrooms > 0
GROUP BY p.neighbourhood, p.bedrooms
ORDER BY revenue_per_bedroom DESC;

-- QUERY 6: Weekend vs Weekday Booking Patterns
SELECT 
    CASE 
        WHEN d.weekend_flag THEN 'Weekend'
        ELSE 'Weekday'
    END as day_type,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue,
    ROUND(AVG(fb.nights), 1) as avg_stay_length,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM dw.fact_bookings), 2) as percentage_of_total
FROM dw.fact_bookings fb
JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
GROUP BY d.weekend_flag
ORDER BY total_revenue DESC;

-- QUERY 7: Monthly Occupancy Rate Estimation
SELECT 
    d.year,
    d.month_name,
    COUNT(*) as booking_count,
    SUM(fb.nights) as total_nights,
    ROUND(SUM(fb.nights) * 100.0 / (COUNT(*) * 30), 2) as estimated_occupancy_rate,
    SUM(fb.total_revenue) as total_revenue,
    ROUND(SUM(fb.total_revenue) / SUM(fb.nights), 2) as revenue_per_night
FROM dw.fact_bookings fb
JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
GROUP BY d.year, d.month_name
ORDER BY d.year, d.month_name;

-- QUERY 8: Top Performing Neighborhoods by Revenue
SELECT 
    p.neighbourhood,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue,
    ROUND(AVG(fb.price_per_night), 2) as avg_nightly_rate,
    ROUND(AVG(fb.nights), 1) as avg_stay_length,
    RANK() OVER (ORDER BY SUM(fb.total_revenue) DESC) as revenue_rank
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
GROUP BY p.neighbourhood
ORDER BY total_revenue DESC
LIMIT 10;

-- QUERY 9: Price Tier Analysis
SELECT 
    CASE 
        WHEN p.default_price < 100 THEN 'Budget (<$100)'
        WHEN p.default_price < 200 THEN 'Economy ($100-$200)'
        WHEN p.default_price < 350 THEN 'Standard ($200-$350)'
        WHEN p.default_price < 500 THEN 'Premium ($350-$500)'
        ELSE 'Luxury (>$500)'
    END as price_tier,
    COUNT(*) as booking_count,
    SUM(fb.total_revenue) as total_revenue,
    ROUND(AVG(fb.nights), 1) as avg_stay_length,
    ROUND(SUM(fb.total_revenue) / COUNT(*), 2) as avg_booking_value
FROM dw.fact_bookings fb
JOIN dw.dim_property p ON fb.property_key = p.property_key
GROUP BY price_tier
ORDER BY total_revenue DESC;

-- QUERY 10: Year-over-Year Monthly Growth
WITH monthly_revenue AS (
    SELECT 
        d.year,
        d.month,
        d.month_name,
        SUM(fb.total_revenue) as monthly_revenue
    FROM dw.fact_bookings fb
    JOIN dw.dim_date d ON fb.checkin_date_key = d.date_key
    GROUP BY d.year, d.month, d.month_name
)
SELECT 
    year,
    month_name,
    monthly_revenue,
    LAG(monthly_revenue) OVER (ORDER BY year, month) as prev_month_revenue,
    CASE 
        WHEN LAG(monthly_revenue) OVER (ORDER BY year, month) IS NOT NULL THEN
            ROUND((monthly_revenue - LAG(monthly_revenue) OVER (ORDER BY year, month)) * 100.0 / 
                  LAG(monthly_revenue) OVER (ORDER BY year, month), 2)
        ELSE NULL
    END as growth_percentage
FROM monthly_revenue
ORDER BY year, month;