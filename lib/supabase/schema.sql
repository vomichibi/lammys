-- Create tables for Lammy's Dry Cleaning

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null check (email ~* '^.+@.+\..+$'),
  full_name text,
  role text not null default 'user',
  created_at timestamptz default now() not null,
  last_login_at timestamptz default now(),
  is_admin boolean default false
);

-- Create services table
create table if not exists services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  category text,
  active boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now()
);

-- Create bookings table
create table if not exists bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  service_id uuid references services(id) not null,
  booking_date timestamptz not null,
  status text not null default 'pending',
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now()
);

-- Create orders table
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  status text not null default 'pending',
  total_amount decimal(10,2) not null,
  payment_intent text unique,
  session_id text unique,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now()
);

-- Create order_items table
create table if not exists order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) not null,
  service_id uuid references services(id) not null,
  quantity integer not null,
  price decimal(10,2) not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now()
);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at columns
drop trigger if exists handle_updated_at on services;
create trigger handle_updated_at
  before update on services
  for each row
  execute function update_updated_at_column();

drop trigger if exists handle_updated_at on bookings;
create trigger handle_updated_at
  before update on bookings
  for each row
  execute function update_updated_at_column();

drop trigger if exists handle_updated_at on orders;
create trigger handle_updated_at
  before update on orders
  for each row
  execute function update_updated_at_column();

drop trigger if exists handle_updated_at on order_items;
create trigger handle_updated_at
  before update on order_items
  for each row
  execute function update_updated_at_column();

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table services enable row level security;
alter table bookings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Service policies
create policy "Services are viewable by everyone"
  on services for select
  using (true);

create policy "Only admins can modify services"
  on services for all
  using (exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.is_admin = true
  ));

-- Booking policies
create policy "Users can view own bookings"
  on bookings for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookings"
  on bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookings"
  on bookings for update
  using (auth.uid() = user_id);

-- Order policies
create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "Users can update own orders"
  on orders for update
  using (auth.uid() = user_id);

-- Order items policies
create policy "Users can view own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Users can insert own order items"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );
