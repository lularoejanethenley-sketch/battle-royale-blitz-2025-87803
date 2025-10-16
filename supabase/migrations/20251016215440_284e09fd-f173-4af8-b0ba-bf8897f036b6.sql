-- Create cards table for admin management
CREATE TABLE public.battle_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'blocked')),
  activated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.battle_cards ENABLE ROW LEVEL SECURITY;

-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for battle_cards
-- Admins can do everything
CREATE POLICY "Admins can manage all cards"
ON public.battle_cards
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can view inactive cards (to check if valid)
CREATE POLICY "Users can view inactive cards"
ON public.battle_cards
FOR SELECT
USING (status = 'inactive');

-- Users can update cards they're activating
CREATE POLICY "Users can activate their own cards"
ON public.battle_cards
FOR UPDATE
USING (status = 'inactive' AND auth.uid() IS NOT NULL)
WITH CHECK (status = 'active' AND activated_by = auth.uid());

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create card activation photos table
CREATE TABLE public.card_activation_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.battle_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.card_activation_photos ENABLE ROW LEVEL SECURITY;

-- Users can only see their own photos
CREATE POLICY "Users can view own photos"
ON public.card_activation_photos
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own photos
CREATE POLICY "Users can insert own photos"
ON public.card_activation_photos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all photos
CREATE POLICY "Admins can view all photos"
ON public.card_activation_photos
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger to battle_cards
CREATE TRIGGER update_battle_cards_updated_at
BEFORE UPDATE ON public.battle_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for card photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('card-photos', 'card-photos', false);

-- Storage policies for card photos
CREATE POLICY "Users can upload their card photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'card-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own card photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'card-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all card photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'card-photos' AND 
  public.has_role(auth.uid(), 'admin')
);