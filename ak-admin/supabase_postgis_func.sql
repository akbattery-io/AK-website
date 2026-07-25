-- 1. Enable PostGIS Extension
create extension if not exists postgis;

-- 2. Performance indexes on latitude and longitude
create index if not exists idx_customers_latitude on customers(latitude);
create index if not exists idx_customers_longitude on customers(longitude);

-- 3. RPC Function to query customers within a radius (in KM) using PostGIS ST_DWithin on latitude & longitude
create or replace function get_customers_within_radius(
  lat double precision,
  lng double precision,
  radius_km double precision
)
returns table (
  id uuid,
  customer_name text,
  phone_number text,
  place text,
  latitude double precision,
  longitude double precision,
  installation_date date,
  product_name text,
  status text,
  maintenance_period integer,
  remark text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  dist_km double precision
)
language sql
as $$
  select 
    id, customer_name, phone_number, place, latitude, longitude, installation_date, product_name, status, maintenance_period, remark, created_at, updated_at,
    (ST_Distance(
      ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) / 1000.0) as dist_km
  from customers
  where 
    latitude is not null
    and longitude is not null
    and ST_DWithin(
      ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_km * 1000.0
    )
  order by dist_km asc;
$$;
