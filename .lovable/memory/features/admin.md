---
name: Admin system
description: Admin role system with shevowinda@gmail.com as primary admin, user_roles table, /admin route
type: feature
---
- Primary admin email: shevowinda@gmail.com (auto-assigned on signup via trigger)
- Roles: admin, editor, viewer (stored in user_roles table, NOT on profiles)
- has_role() security definer function for RLS
- get_all_profiles_admin() function for admin user listing
- Admin button visible in sidebar, header, and landing footer (only for admins)
- /admin route is protected and checks admin role
