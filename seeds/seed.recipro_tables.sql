BEGIN;

TRUNCATE
    recipro_users,
    recipro_fridge_categories,
    recipro_fridge_items,
    recipro_pantry_categories,
    recipro_pantry_items,
    recipro_groceries,
    recipro_recipes
RESTART IDENTITY CASCADE;

INSERT INTO recipro_users (user_name, password)
VALUES
    ('dunder', '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
    ('b.deboop', '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO'),
    ('c.bloggs', '$2a$12$2fv9OPgM07xGnhDbyL6xsuAeQjAYpZx/3V2dnu0XNIR27gTeiK2gK');


INSERT INTO recipro_fridge_categories (name, userid)
VALUES
    ('Dairy', 1),
    ('Poultry', 3),
    ('Deli', 2);

INSERT INTO recipro_fridge_items (name, expiration, note, categoryid, userid)
VALUES
    ('cheese', '2020-11-11', null, 1, 1),
    ('milk', '2020-11-11', 'will buy again', 1, 1),
    ('chicken breast', '2020-11-11', null, 2, 3),
    ('sliced turkey breast', '2020-11-11', 'honey flavor', 3, 2);

INSERT INTO recipro_pantry_categories (name, userid)
VALUES
    ('seasoning', 1),
    ('canned foods', 2),
    ('drinks', 3);

INSERT INTO recipro_pantry_items (name, expiration, note, categoryid, userid)
VALUES
    ('old bay', '2020-11-11', null, 1, 1),
    ('canned chicken', '2020-11-11', 'will buy again', 2, 2),
    ('canned tuna', '2020-11-11', null, 2, 2),
    ('diet pepsi', '2020-11-11', '6 pack', 3, 3);

INSERT INTO recipro_groceries (name, userid)
VALUES
    ('grocery 1', 1),
    ('grocery 2', 1),
    ('grocery 3', 2),
    ('grocery 4', 2),
    ('grocery 5', 2),
    ('grocery 6', 3);

INSERT INTO recipro_recipes (name, image, url, ingredients, userid)
VALUES
    ('Chicken Vesuvio', 'image 1', 'url 1', ARRAY ['ingredient 1', 'ingredient 2', 'ingredient 3'], 1),
    ('Turkey', 'image 2', 'url 2', ARRAY ['ingredient 1', 'ingredient 2', 'ingredient 3'], 1),
    ('Raviolo', 'image 3', 'url 3', ARRAY ['ingredient 1', 'ingredient 2', 'ingredient 3'], 2),
    ('Curry', 'image 4', 'url 4', ARRAY ['ingredient 1', 'ingredient 2', 'ingredient 3'], 3),
    ('Tonkatsu', 'image 5', 'url 5', ARRAY ['ingredient 1', 'ingredient 2', 'ingredient 3'], 3),
    ('Pad Thai', 'image 6', 'url 6', ARRAY ['ingredient 1', 'ingredient 2', 'ingredient 3'], 3);

COMMIT;