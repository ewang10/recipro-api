BEGIN;

ALTER TABLE recipro_pantry_items DROP COLUMN categoryid;

DROP TABLE IF EXISTS recipro_pantry_categories;

COMMIT;