BEGIN;

ALTER TABLE recipro_recipes DROP COLUMN userid;

ALTER TABLE recipro_groceries DROP COLUMN userid;

ALTER TABLE recipro_fridge_categories DROP COLUMN userid;

ALTER TABLE recipro_fridge_items DROP COLUMN userid;

ALTER TABLE recipro_pantry_categories DROP COLUMN userid;

ALTER TABLE recipro_pantry_items DROP COLUMN userid;

COMMIT;