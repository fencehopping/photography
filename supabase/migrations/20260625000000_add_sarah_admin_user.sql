insert into public.admin_users (email)
values ('sarahrcronin11@gmail.com')
on conflict (email) do nothing;
