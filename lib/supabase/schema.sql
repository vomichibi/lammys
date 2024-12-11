-- Create tables for Lammy's Dry Cleaning

-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  role text not null default 'user',
  created_at timestamptz default now() not null,
  last_login_at timestamptz default now(),
  is_admin boolean default false,
  constraint email_check check (email ~* '^.+@.+\..+$')
);

-- Create services table
create table services (
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
create table bookings (
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
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  status text not null default 'pending',
  total_amount decimal(10,2) not null,
  payment_intent text unique,
  session_id text unique,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now()
);

-- Create order items table
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) not null,
  service_id uuid references services(id) not null,
  quantity integer not null,
  price decimal(10,2) not null,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table services enable row level security;
alter table bookings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Create policies

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Services policies
create policy "Services are viewable by everyone"
  on services for select
  using ( true );

create policy "Only admins can insert services"
  on services for insert
  using ( exists (select 1 from profiles where id = auth.uid() and is_admin = true) );

create policy "Only admins can update services"
  on services for update
  using ( exists (select 1 from profiles where id = auth.uid() and is_admin = true) );

-- Bookings policies
create policy "Users can view own bookings"
  on bookings for select
  using ( auth.uid() = user_id );

create policy "Users can insert own bookings"
  on bookings for insert
  using ( auth.uid() = user_id );

create policy "Users can update own bookings"
  on bookings for update
  using ( auth.uid() = user_id );

create policy "Admins can view all bookings"
  on bookings for select
  using ( exists (select 1 from profiles where id = auth.uid() and is_admin = true) );

-- Orders policies
create policy "Users can view own orders"
  on orders for select
  using ( auth.uid() = user_id );

create policy "Users can insert own orders"
  on orders for insert
  using ( auth.uid() = user_id );

create policy "Admins can view all orders"
  on orders for select
  using ( exists (select 1 from profiles where id = auth.uid() and is_admin = true) );

-- Order items policies
create policy "Users can view own order items"
  on order_items for select
  using ( exists (select 1 from orders where id = order_id and user_id = auth.uid()) );

create policy "Users can insert own order items"
  on order_items for insert
  using ( exists (select 1 from orders where id = order_id and user_id = auth.uid()) );

-- Create functions and triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, is_admin)
  values (new.id, new.email, 'user', new.email = 'team@lammys.au');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at before update on services
  for each row execute procedure update_updated_at_column();

create trigger handle_updated_at before update on bookings
  for each row execute procedure update_updated_at_column();

create trigger handle_updated_at before update on orders
  for each row execute procedure update_updated_at_column();
