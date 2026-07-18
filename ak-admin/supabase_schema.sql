-- 1. Create status calculation function (must exist before the trigger is created)
create or replace function calculate_customer_status()
returns trigger as $$
begin
  if (new.installation_date + (new.maintenance_period || ' month')::interval) < current_date then
    new.status = 'Inactive';
  else
    new.status = 'Active';
  end if;
  return new;
end;
$$ language plpgsql;

-- 2. Create the customers table with check constraints and defaults
create table if not exists public.customers (
  id uuid not null default gen_random_uuid (),
  customer_name text not null,
  phone_number text not null,
  place text not null,
  latitude double precision null,
  longitude double precision null,
  installation_date date not null,
  product_name text not null,
  status text not null default 'Active'::text,
  maintenance_period integer not null default 3,
  remark text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint customers_pkey primary key (id),
  constraint customers_maintenance_period_check check ((maintenance_period = any (array[3, 6, 9, 12]))),
  constraint customers_status_check check (
    (
      status = any (array['Active'::text, 'Inactive'::text])
    )
  )
) TABLESPACE pg_default;

-- 3. Create the status calculation trigger
drop trigger if exists trg_calculate_customer_status on customers;
create trigger trg_calculate_customer_status
before insert or update on customers
for each row
execute function calculate_customer_status();

-- 4. Create trigger to automatically keep updated_at synchronized
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on customers;
create trigger set_updated_at
before update on customers
for each row
execute function update_updated_at_column();

-- 5. Create performance indexes
create index if not exists idx_customers_customer_name on customers(customer_name);
create index if not exists idx_customers_phone_number on customers(phone_number);
create index if not exists idx_customers_place on customers(place);
create index if not exists idx_customers_status on customers(status);

-- 6. Enable Row Level Security (RLS)
alter table customers enable row level security;

-- 7. Access Policy: Only authorized admin is allowed to query/modify customers
drop policy if exists "Allow admin full access" on customers;
create policy "Allow admin full access"
on customers
for all
to authenticated
using (auth.email() = 'akbattery.ro@gmail.com')
with check (auth.email() = 'akbattery.ro@gmail.com');

-- 8. View to display inactive customers who expired within the last 3 days
create or replace view due_services_view as
select 
  *
from customers
where 
  status = 'Inactive'
  and (installation_date + (maintenance_period || ' month')::interval)::date >= (current_date - 3)
  and (installation_date + (maintenance_period || ' month')::interval)::date < current_date;
