const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Fridge Categories Endpoints', () => {
    let db;

    testCategories = helpers.makeFridgeCategoriesArray();
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

    describe('GET /api/fridge-categories', () => {
        context('Given there are no categories', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/fridge-categories')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, []);
            });
        });
        context('Given there are categories in db', () => {
            beforeEach('inserting categories', () =>
                helpers.seedFridgeCategories(db, testCategories)
            );
            it('responds with 200 and all categories for specific user', () => {
                it('responds with 200 and an empty list', () => {
                    return supertest(app)
                        .get('/api/fridge-categories')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(200, helpers.makeExpectedFridgeCategories(testUser, testCategories));
                });
            });
        });
        context('Given an XSS attack category', () => {
            const { maliciousCategory, expectedCategory } = helpers.makeMaliciousCategory();
            beforeEach('insert malicious category', () =>
                helpers.seedFridgeCategories(db, maliciousCategory)
            );
            it('removes XSS content', () => {
                return supertest(app)
                    .get('/api/fridge-categories')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].name).to.eql(expectedCategory.name);
                    })
            });
        });
    });

    describe('GET /api/fridge-categories/:category_id', () => {
        context('Given no categories', () => {
            it('responds with 404', () => {
                const categoryId = 1234;
                return supertest(app)
                    .get(`/api/fridge-categories/${categoryId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {
                        error: {message: `Category doesn't exist`}
                    });
            });
        });

        context('Given there are categories in db', () => {
            beforeEach('insert categories', () =>
                helpers.seedFridgeCategories(db, testCategories)
            );
            it('responds with 200 and specified catetory', () => {
                const categoryId = 2;
                return supertest(app)
                    .get(`/api/fridge-categories/${categoryId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, 
                        helpers.makeExpectedFridgeCategory(testUser, testCategories, categoryId));
            });
        });
    });
});