-- Fix NULLs in pinned_in_sub_category (added by ddl-auto without default)
UPDATE products SET pinned_in_sub_category = false WHERE pinned_in_sub_category IS NULL;
ALTER TABLE products ALTER COLUMN pinned_in_sub_category SET DEFAULT false;
