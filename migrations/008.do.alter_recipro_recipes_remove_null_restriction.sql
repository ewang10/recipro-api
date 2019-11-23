BEGIN;

ALTER TABLE recipro_recipes
    DROP COLUMN image;

ALTER TABLE recipro_recipes
    DROP COLUMN url;

ALTER TABLE recipro_recipes
    DROP COLUMN ingredients;

ALTER TABLE recipro_recipes
    ADD COLUMN image TEXT;

ALTER TABLE recipro_recipes
    ADD COLUMN url TEXT;

ALTER TABLE recipro_recipes
    ADD COLUMN ingredients TEXT [];

COMMIT;