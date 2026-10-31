-- A trusted administrator must add approved auth.users IDs; authenticated clients cannot grant themselves access.
create table public.landlord_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.landlord_profiles enable row level security;

create policy "Landlords can read their own profile"
  on public.landlord_profiles
  for select
  to authenticated
  using (user_id = (select auth.uid()));

grant select on public.landlord_profiles to authenticated;

create table public.landlord_properties (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references public.landlord_profiles (user_id) on delete cascade,
  title text not null,
  address text not null,
  price integer not null check (price > 0),
  bedrooms integer not null default 1 check (bedrooms >= 0),
  bathrooms integer not null default 1 check (bathrooms >= 0),
  available boolean not null default true,
  image text not null default '/placeholder.svg?height=100&width=150',
  tenant_name text,
  tenant_phone text,
  tenant_email text,
  water_bill integer not null default 0 check (water_bill >= 0),
  billing_month text,
  lease_start date,
  lease_end date,
  last_updated date not null default current_date,
  floor text not null default 'Newly Added',
  unit text not null,
  floor_number integer not null default 9 check (floor_number > 0),
  created_at timestamptz not null default now(),
  unique (landlord_id, unit)
);

alter table public.landlord_properties enable row level security;

create policy "Landlords can read their own properties"
  on public.landlord_properties
  for select
  to authenticated
  using (
    landlord_id = (select auth.uid())
    and exists (
      select 1
      from public.landlord_profiles
      where user_id = (select auth.uid())
    )
  );

create policy "Landlords can create their own properties"
  on public.landlord_properties
  for insert
  to authenticated
  with check (
    landlord_id = (select auth.uid())
    and exists (
      select 1
      from public.landlord_profiles
      where user_id = (select auth.uid())
    )
  );

create policy "Landlords can update their own properties"
  on public.landlord_properties
  for update
  to authenticated
  using (
    landlord_id = (select auth.uid())
    and exists (
      select 1
      from public.landlord_profiles
      where user_id = (select auth.uid())
    )
  )
  with check (
    landlord_id = (select auth.uid())
    and exists (
      select 1
      from public.landlord_profiles
      where user_id = (select auth.uid())
    )
  );

create policy "Landlords can delete their own properties"
  on public.landlord_properties
  for delete
  to authenticated
  using (
    landlord_id = (select auth.uid())
    and exists (
      select 1
      from public.landlord_profiles
      where user_id = (select auth.uid())
    )
  );

grant select, insert, update, delete on public.landlord_properties to authenticated;
