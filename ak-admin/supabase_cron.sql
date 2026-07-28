-- ============================================================
-- SUPABASE CRON JOB SCRIPT FOR AUTOMATIC CUSTOMER STATUS UPDATE
-- ============================================================

-- Step 1: Enable the pg_cron extension
create extension if not exists pg_cron;

-- Step 2: Create a function that batch-updates all customer statuses
create or replace function update_all_customer_statuses()
returns void as $$
begin
  -- Update Active customers to Inactive if their maintenance period has expired
  update customers
  set 
    status = 'Inactive',
    updated_at = now()
  where 
    status = 'Active'
    and (installation_date + (maintenance_period || ' month')::interval) < current_date;
end;
$$ language plpgsql;

-- Step 3: Unschedule any existing cron job with the same name (prevents duplicate jobs)
select cron.unschedule('update-customer-statuses-daily') 
where exists (
  select 1 from cron.job where jobname = 'update-customer-statuses-daily'
);

-- Step 4: Schedule the job to run every day at midnight (00:00 UTC / 05:30 AM IST)
select cron.schedule(
  'update-customer-statuses-daily',  -- Unique Job Name
  '0 0 * * *',                        -- Cron Expression: Every day at 00:00 UTC
  $$ select update_all_customer_statuses(); $$
);

-- Step 5: (Optional) Run once manually right now to update all overdue customers immediately
select update_all_customer_statuses();

-- Useful Helper Queries:
-- View all scheduled cron jobs:
-- select * from cron.job;
--
-- View cron execution logs:
-- select * from cron.job_run_details order by start_time desc limit 10;
