BEGIN;

ALTER TABLE recipro_fridge_items DROP COLUMN categoryid;

DROP TABLE IF EXISTS recipro_fridge_categories;

COMMIT;