
DROP POLICY "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist" ON public.waitlist FOR INSERT WITH CHECK (email IS NOT NULL AND email <> '');
