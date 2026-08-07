CREATE SCHEMA IF NOT EXISTS stg;

DROP TABLE IF EXISTS stg.listings;
CREATE TABLE stg.listings (
    id TEXT,
    listing_url TEXT,
    scrape_id TEXT,
    last_scraped TEXT,
    source TEXT,
    name TEXT,
    description TEXT,
    neighborhood_overview TEXT,
    picture_url TEXT,
    host_id TEXT,
    host_url TEXT,
    host_name TEXT,
    host_since TEXT,
    host_location TEXT,
    host_about TEXT,
    host_response_time TEXT,
    host_response_rate TEXT,
    host_acceptance_rate TEXT,
    host_is_superhost TEXT,
    host_thumbnail_url TEXT,
    host_picture_url TEXT,
    host_neighbourhood TEXT,
    host_listings_count TEXT,
    host_total_listings_count TEXT,
    host_verifications TEXT,
    host_has_profile_pic TEXT,
    host_identity_verified TEXT,
    neighbourhood TEXT,
    neighbourhood_cleansed TEXT,
    neighbourhood_group_cleansed TEXT,
    latitude TEXT,
    longitude TEXT,
    property_type TEXT,
    room_type TEXT,
    accommodates TEXT,
    bathrooms TEXT,
    bathrooms_text TEXT,
    bedrooms TEXT,
    beds TEXT,
    amenities TEXT,
    price TEXT,
    minimum_nights TEXT,
    maximum_nights TEXT,
    minimum_minimum_nights TEXT,
    maximum_minimum_nights TEXT,
    minimum_maximum_nights TEXT,
    maximum_maximum_nights TEXT,
    minimum_nights_avg_ntm TEXT,
    maximum_nights_avg_ntm TEXT,
    calendar_updated TEXT,
    has_availability TEXT,
    availability_30 TEXT,
    availability_60 TEXT,
    availability_90 TEXT,
    availability_365 TEXT,
    calendar_last_scraped TEXT,
    number_of_reviews TEXT,
    number_of_reviews_ltm TEXT,
    number_of_reviews_l30d TEXT,
    availability_eoy TEXT,
    number_of_reviews_ly TEXT,
    estimated_occupancy_l365d TEXT,
    estimated_revenue_l365d TEXT,
    first_review TEXT,
    last_review TEXT,
    review_scores_rating TEXT,
    review_scores_accuracy TEXT,
    review_scores_cleanliness TEXT,
    review_scores_checkin TEXT,
    review_scores_communication TEXT,
    review_scores_location TEXT,
    review_scores_value TEXT,
    license TEXT,
    instant_bookable TEXT,
    calculated_host_listings_count TEXT,
    calculated_host_listings_count_entire_homes TEXT,
    calculated_host_listings_count_private_rooms TEXT,
    calculated_host_listings_count_shared_rooms TEXT,
    reviews_per_month TEXT
);

DROP TABLE IF EXISTS stg.calendar;
CREATE TABLE stg.calendar (
    listing_id TEXT,
    date DATE,
    available TEXT,
    price TEXT,
);
	ALTER TABLE stg.calendar
    ADD COLUMN adjusted_price TEXT,
    ADD COLUMN minimum_nights TEXT,
    ADD COLUMN maximum_nights TEXT;

	ALTER TABLE stg.calendar
    DROP COLUMN adjusted_price,
    DROP COLUMN minimum_nights,
    DROP COLUMN maximum_nights;

-- ================ 1.  DIMENSION TABLES ================
CREATE SCHEMA IF NOT EXISTS dw;

-- 1-a  DimDate
CREATE TABLE dw.dim_date (
    date_key      INTEGER PRIMARY KEY,   -- YYYYMMDD
    full_date     DATE        NOT NULL,
    year          SMALLINT    NOT NULL,
    quarter       SMALLINT    NOT NULL,
    month         SMALLINT    NOT NULL,
    month_name    VARCHAR(10) NOT NULL,
    day_of_month  SMALLINT    NOT NULL,
    day_of_week   SMALLINT    NOT NULL,  -- 1=Monday
    day_name      VARCHAR(9)  NOT NULL,
    weekend_flag  BOOLEAN     NOT NULL,
    holiday_flag  BOOLEAN     NOT NULL DEFAULT FALSE
);

-- 1-b  DimProperty
CREATE TABLE dw.dim_property (
    property_key  SERIAL PRIMARY KEY,
    property_id   TEXT        NOT NULL,
    neighbourhood TEXT,
    room_type     TEXT,
    bedrooms      SMALLINT,
    bathrooms     NUMERIC(3,1),
    default_price NUMERIC(10,2)
);

-- 1-c  DimHost
CREATE TABLE dw.dim_host (
    host_key      SERIAL PRIMARY KEY,
    host_id       TEXT        NOT NULL,
    host_name     TEXT,
    is_superhost  BOOLEAN
);

-- 1-d  DimGuest
CREATE TABLE dw.dim_guest (
    guest_key  SERIAL PRIMARY KEY,
    guest_id   TEXT NOT NULL,
    guest_name TEXT
);
-- DW schema must exist (done in Step-1 deliverable)
CREATE TABLE IF NOT EXISTS dw.fact_bookings (
    booking_key         BIGSERIAL PRIMARY KEY,
    property_key        INTEGER NOT NULL,
    host_key            INTEGER NOT NULL,
    guest_key           INTEGER,
    checkin_date_key    INTEGER NOT NULL,
    checkout_date_key   INTEGER NOT NULL,
    nights              SMALLINT NOT NULL,
    price_per_night     NUMERIC(10,2) NOT NULL,
    total_revenue       NUMERIC(12,2) NOT NULL,
    -- Foreign keys
    CONSTRAINT fk_fb_property  FOREIGN KEY (property_key)
        REFERENCES dw.dim_property(property_key),
    CONSTRAINT fk_fb_host      FOREIGN KEY (host_key)
        REFERENCES dw.dim_host(host_key),
    CONSTRAINT fk_fb_guest     FOREIGN KEY (guest_key)
        REFERENCES dw.dim_guest(guest_key),
    CONSTRAINT fk_fb_chk_in    FOREIGN KEY (checkin_date_key)
        REFERENCES dw.dim_date(date_key),
    CONSTRAINT fk_fb_chk_out   FOREIGN KEY (checkout_date_key)
        REFERENCES dw.dim_date(date_key)
);