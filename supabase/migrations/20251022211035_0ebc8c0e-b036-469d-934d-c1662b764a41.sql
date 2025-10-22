-- Drop the insecure 'Users can view inactive cards' policy that exposes all card numbers
DROP POLICY IF EXISTS "Users can view inactive cards" ON public.battle_cards;

-- Add policy for users to view their own activated cards
CREATE POLICY "Users can view their own activated cards"
ON public.battle_cards
FOR SELECT
USING (status = 'active' AND activated_by = auth.uid());