-- Изпълни в Supabase SQL Editor, ако базата вече съществува без колона parent_id
-- (пълният schema е в final_supabase.sql за нови инсталации)

ALTER TABLE collections
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES collections(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_collections_parent_id ON collections(parent_id);

COMMENT ON COLUMN collections.parent_id IS 'NULL = главна категория; иначе подкатегория';
