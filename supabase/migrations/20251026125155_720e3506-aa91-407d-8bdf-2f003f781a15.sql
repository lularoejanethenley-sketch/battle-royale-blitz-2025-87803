-- Create table for card service requests
CREATE TABLE public.card_service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.battle_cards(id) ON DELETE CASCADE,
  mid TEXT,
  last_4_digits TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.card_service_requests ENABLE ROW LEVEL SECURITY;

-- Admins can view all requests
CREATE POLICY "Admins can view all service requests"
ON public.card_service_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all requests
CREATE POLICY "Admins can manage all service requests"
ON public.card_service_requests
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can insert service requests
CREATE POLICY "Anyone can create service requests"
ON public.card_service_requests
FOR INSERT
WITH CHECK (true);

-- Add trigger for updating updated_at
CREATE TRIGGER update_card_service_requests_updated_at
BEFORE UPDATE ON public.card_service_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();