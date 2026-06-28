-- Nurse Scheduling v4 — Initial Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Nurses table
create table if not exists nurses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  nickname text default '',
  position text not null default 'RN1',
  "group" text not null default 'RN',
  department text not null,
  emp_code text default '',
  phone text default '',
  start_date date,
  active boolean default true,
  day_only boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Schedule table
create table if not exists schedules (
  id uuid primary key default uuid_generate_v4(),
  nurse_id uuid references nurses(id) on delete cascade,
  department text not null,
  year int not null,
  month int not null,
  day int not null,
  shift text,
  leave_type text,
  is_pinned boolean default false,
  role text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(nurse_id, year, month, day)
);

-- Prelocks table
create table if not exists prelocks (
  id uuid primary key default uuid_generate_v4(),
  nurse_id uuid references nurses(id) on delete cascade,
  department text not null,
  year int not null,
  month int not null,
  requested_days int[] default '{}',
  assigned_days int[] default '{}',
  shift_type text not null,
  tier int default 1,
  queue int default 0,
  status text default 'pending',
  reason text default '',
  created_at timestamptz default now()
);

-- OH Cases table (CCU only)
create table if not exists oh_cases (
  id uuid primary key default uuid_generate_v4(),
  department text not null default 'CCU',
  year int not null,
  month int not null,
  op_day int not null,
  created_at timestamptz default now()
);

-- Special duties table (non-CCU)
create table if not exists special_duties (
  id uuid primary key default uuid_generate_v4(),
  nurse_id uuid references nurses(id) on delete cascade,
  department text not null,
  year int not null,
  month int not null,
  day int not null,
  duty_name text not null,
  created_at timestamptz default now()
);

-- Warnings table
create table if not exists warnings (
  id uuid primary key default uuid_generate_v4(),
  department text not null,
  year int not null,
  month int not null,
  day int,
  nurse_id uuid references nurses(id) on delete set null,
  type text not null,
  message text not null,
  severity text default 'warn',
  approved boolean default false,
  approved_by text,
  reason text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table nurses enable row level security;
alter table schedules enable row level security;
alter table prelocks enable row level security;
alter table oh_cases enable row level security;
alter table special_duties enable row level security;
alter table warnings enable row level security;

-- Policy: authenticated users read all (adjust per department later)
create policy "auth read nurses"    on nurses        for select using (auth.role() = 'authenticated');
create policy "auth all schedules"  on schedules     for all    using (auth.role() = 'authenticated');
create policy "auth all prelocks"   on prelocks      for all    using (auth.role() = 'authenticated');
create policy "auth all oh_cases"   on oh_cases      for all    using (auth.role() = 'authenticated');
create policy "auth all spec_duty"  on special_duties for all   using (auth.role() = 'authenticated');
create policy "auth all warnings"   on warnings      for all    using (auth.role() = 'authenticated');
create policy "auth write nurses"   on nurses        for all    using (auth.role() = 'authenticated');

-- Updated_at trigger for schedules
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger schedules_updated_at
  before update on schedules
  for each row execute function update_updated_at();
