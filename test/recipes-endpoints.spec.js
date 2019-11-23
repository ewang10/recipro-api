const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Recipes Endpoints', () => {
    let db;

    const testRecipes = helpers.makeRecipesArray();
    const testRecipe = testRecipes[0];
    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];

    before('create knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });

    after('disconnecting from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    beforeEach('insert users', () =>
        helpers.seedUsers(db, testUsers)
    );

    describe('GET /api/recipes', () => {
        context('Given no recipes', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/recipes')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, []);
            });
        });
        context('Given there are recipes in db', () => {
            beforeEach('inserting recipes', () =>
                helpers.seedRecipes(db, testRecipes)
            );
            it('responds with 200 and all recipes for user', () => {
                return supertest(app)
                    .get('/api/recipes')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, helpers.makeExpectedRecipes(testUser, testRecipes));
            });
        });
        context('Given XSS attack recipe', () => {
            const { maliciousRecipe, expectedRecipe } = helpers.makeMaliciousRecipe();
            beforeEach('inserting malicious recipe', () =>
                helpers.seedRecipes(db, maliciousRecipe)
            );
            it('removes xss content', () => {
                return supertest(app)
                    .get('/api/recipes')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].name).to.eql(expectedRecipe.name);
                        expect(res.body[0].image).to.eql(expectedRecipe.image);
                        expect(res.body[0].url).to.eql(expectedRecipe.url);
                    });
            });
        });
    });

    describe('GET /api/recipes/:recipe_id', () => {
        context('Given no recipes', () => {
            it('responds with 404', () => {
                const id = 1234;
                return supertest(app)
                    .get(`/api/recipes/${id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {
                        error: { message: `Recipe doesn't exist` }
                    });
            });
        });
        context('Given there are recipes in db', () => {
            beforeEach('inserting recipes', () =>
                helpers.seedRecipes(db, testRecipes)
            );
            it('responds with 200 and all recipes for the user', () => {
                const id = 2;
                return supertest(app)
                    .get(`/api/recipes/${id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, helpers.makeExpectedRecipe(testUser, testRecipes, id));
            });
        });
        context('Given XSS attack recipe', () => {
            const { maliciousRecipe, expectedRecipe } = helpers.makeMaliciousRecipe();
            beforeEach('inserting malicious recipe', () =>
                helpers.seedRecipes(db, maliciousRecipe)
            );
            it('removes xss content', () => {
                return supertest(app)
                    .get(`/api/recipes/${maliciousRecipe.id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body.name).to.eql(expectedRecipe.name);
                        expect(res.body.image).to.eql(expectedRecipe.image);
                        expect(res.body.url).to.eql(expectedRecipe.url);
                    });
            });
        });
    });
    describe('POST /api/recipes', () => {
        const requiredFields = ['name', 'image', 'url', 'ingredients'];
        requiredFields.forEach(field => {
            const newRecipe = {
                name: 'test new recipe',
                image: 'test new image',
                url: 'test new url',
                ingredients: ['test ingredient 1', 'test ingredient 2', 'test ingredient 3']
            };

            it(`responds with 400 and '${field}' is missing`, () => {
                delete newRecipe[field];

                return supertest(app)
                    .post('/api/recipes')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newRecipe)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    });
            });
        });

        it('responds with 201 and new recipe when recipe created', () => {
            const newRecipe = {
                name: 'test new recipe',
                image: 'test new image',
                url: 'test new url',
                ingredients: ['test ingredient 1', 'test ingredient 2', 'test ingredient 3']
            };

            return supertest(app)
                .post('/api/recipes')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newRecipe)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id');
                    expect(res.body.name).to.eql(newRecipe.name);
                    expect(res.body.image).to.eql(newRecipe.image);
                    expect(res.body.url).to.eql(newRecipe.url);
                    expect(res.body.ingredients).to.eql(newRecipe.ingredients);
                    expect(res.header.location).to.eql(`/api/recipes/${res.body.id}`);
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/recipes/${res.body.id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(res.body)
                );
        });
        it('removes xss content from response', () => {
            const { maliciousRecipe, expectedRecipe } = helpers.makeMaliciousRecipe();
            return supertest(app)
                .post('/api/recipes')
                .send(maliciousRecipe)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(expectedRecipe.name);
                    expect(res.body.image).to.eql(expectedRecipe.image);
                    expect(res.body.url).to.eql(expectedRecipe.url);
                });
        });
    });

    describe('DELETE /api/recipes/:recipe_id', () => {
        context('Given no recipes', () => {
            it('responds with 404', () => {
                const idToDelete = 1234;
                return supertest(app)
                    .delete(`/api/recipes/${idToDelete}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {
                        error: {message: `Recipe doesn't exist`}
                    });
            });
        });
        context('Given there are recipes in db', () => {
            beforeEach('inserting recipes', () =>
                helpers.seedRecipes(db, testRecipes)
            );
            it('responds with 204 and deletes the recipe', () => {
                const idToDelete = 2;
                return supertest(app)
                    .delete(`/api/recipes/${idToDelete}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get('/api/recipes')
                            .set('Authorization', helpers.makeAuthHeader(testUser))
                            .expect(helpers.makeExpectedRecipesAfterDelete(
                                testUser, testRecipes, idToDelete
                            ))
                    );
            });
        });
    });
});