const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Pantry Categories Endpoints', () => {
    let db;

    testCategories = helpers.makePantryCategoriesArray();
    testCategory = testCategories[0];
    testUsers = helpers.makeUsersArray();
    testUser = testUsers[0];

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

    describe('GET /api/pantry-categories', () => {
        context('Given there are no categories', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/pantry-categories')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, []);
            });
        });
        context('Given there are categories in db', () => {
            beforeEach('inserting categories', () =>
                helpers.seedPantryCategories(db, testCategories)
            );
            it('responds with 200 and all categories for specific user', () => {
                it('responds with 200 and an empty list', () => {
                    return supertest(app)
                        .get('/api/pantry-categories')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(200, helpers.makeExpectedCategories(testUser, testCategories));
                });
            });
        });
        context('Given an XSS attack category', () => {
            const { maliciousCategory, expectedCategory } = helpers.makeMaliciousCategory();
            beforeEach('insert malicious category', () =>
                helpers.seedPantryCategories(db, maliciousCategory)
            );
            it('removes XSS content', () => {
                return supertest(app)
                    .get('/api/pantry-categories')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].name).to.eql(expectedCategory.name);
                    })
            });
        });
    });

    describe('GET /api/pantry-categories/:category_id', () => {
        context('Given no categories', () => {
            it('responds with 404', () => {
                const categoryId = 1234;
                return supertest(app)
                    .get(`/api/pantry-categories/${categoryId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {
                        error: { message: `Category doesn't exist` }
                    });
            });
        });

        context('Given there are categories in db', () => {
            beforeEach('insert categories', () =>
                helpers.seedPantryCategories(db, testCategories)
            );
            it('responds with 200 and specified catetory', () => {
                const categoryId = 2;
                return supertest(app)
                    .get(`/api/pantry-categories/${categoryId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200,
                        helpers.makeExpectedCategory(testUser, testCategories, categoryId));
            });
        });
        context('Given a XSS attack category', () => {
            const { maliciousCategory, expectedCategory } = helpers.makeMaliciousCategory();
            beforeEach('insert malicious category', () =>
                helpers.seedPantryCategories(db, maliciousCategory)
            );
            it('removes XSS content', () => {
                return supertest(app)
                    .get(`/api/pantry-categories/${maliciousCategory.id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body.name).to.eql(expectedCategory.name);
                    });
            });
        });
    });

    describe('POST /api/pantry-categories', () => {
        it('creates a new category, responds with 201 and new category', () => {
            const newCategory = {
                name: 'new category',
                userid: 1
            };
            return supertest(app)
                .post('/api/pantry-categories')
                .send(newCategory)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newCategory.name);
                    expect(res.body).to.have.property('id');
                    expect(res.body.userid).to.eql(newCategory.userid);
                    expect(res.header.location).to.eql(`/api/pantry-categories/${res.body.id}`);
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/pantry-categories/${res.body.id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(res.body)
                );
        });

        const requiredFields = ['name'];
        requiredFields.forEach(field => {
            const newAttemptedCategory = {
                name: 'test new name',
                userid: 1
            }

            it(`responds with 400 when '${field}' is missing`, () => {
                delete newAttemptedCategory[field];

                return supertest(app)
                    .post('/api/pantry-categories')
                    .send(newAttemptedCategory)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    });
            });
        });
        it('removes XSS attack content', () => {
            const { maliciousCategory, expectedCategory } = helpers.makeMaliciousCategory();
            it('removes XSS content', () => {
                return supertest(app)
                    .post('/api/pantry-categories')
                    .send(maliciousCategory)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(201)
                    .expect(res => {
                        expect(res.body.name).to.eql(expectedCategory.name);
                    });
            });
        });
    });

    
});