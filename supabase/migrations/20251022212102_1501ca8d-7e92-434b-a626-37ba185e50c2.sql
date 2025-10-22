-- Add mid column to battle_cards table
ALTER TABLE public.battle_cards 
ADD COLUMN mid text;

-- Add index for last 4 digits lookup performance
CREATE INDEX idx_battle_cards_last_4 ON public.battle_cards ((RIGHT(card_number, 4)));