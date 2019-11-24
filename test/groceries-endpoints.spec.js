const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Groceries Endpoints', () => {
    let db;

    testUsers = helpers.makeUsersArray();
    testUser = testUsers[0];
    testGroceries = helpers.makeGroceriesArray();
    testGrocery = testGroceries[0];

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

    describe('GET /api/groceries', () => {
        context('Given no groceries', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/groceries')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, []);
            });
        });
        context('Given there are groceries in db', () => {
            beforeEach('inserting groceries', () =>
                helpers.seedGroceries(db, testGroceries)
            );
            it('responds with 200 and all groceries for user', () => {
                return supertest(app)
                    .get('/api/groceries')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, helpers.makeExpectedGroceries(testGroceries, testUser));
            });
        });

        context('Given an XSS attack grocery', () => {
            const { maliciousGrocery, expectedGrocery } = helpers.makeMaliciousGrocery();
            beforeEach('inserting malicious grocery', () =>
                helpers.seedGroceries(db, maliciousGrocery)
            );
            it('removes XSS content', () => {
                return supertest(app)
                    .get('/api/groceries')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].name).to.eql(expectedGrocery.name);
                    });
            });
        });
    });

    describe('POST /api/groceries', () => {
        it(`responds with 400 when 'name' is missing`, () => {
            const newAttemptedGrocery = {};
            return supertest(app)
                .post('/api/groceries')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newAttemptedGrocery)
                .expect(400, {
                    error: { message: `Missing 'name' in request body` }
                });
        });
        it('responds with 201 and new grocery when grocery created', () => {
            const newGrocery = {
                name: 'new grocery'
            };
            return supertest(app)
                .post('/api/groceries')
                .send(newGrocery)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newGrocery.name);
                    expect(res.body).to.have.property('id');
                    expect(res.header.location).to.eql(`/api/groceries/${res.body.id}`);
                })
                .then(res => 
                     supertest(app)
                        .get(`/api/groceries/${res.body.id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(res.body)
                
                );
        });
        it('removes xss content from response', () => {
            const { maliciousGrocery, expectedGrocery } = helpers.makeMaliciousGrocery();
            return supertest(app)
                .post('/api/groceries')
                .send(maliciousGrocery)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(expectedGrocery.name)
                });
        });
    });

    describe('DELETE /api/groceries/:grocery_id', () => {
        context('Given no groceries', () => {
            it('responds with 404', () => {
                const idToDelete = 1234;
                return supertest(app)
                    .delete(`/api/groceries/${idToDelete}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {
                        error: { message: `Grocery doesn't exist` }
                    });
            });
        });
        context('Given there are groceries in db', () => {
            beforeEach('inserting groceries', () =>
                helpers.seedGroceries(db, testGroceries)
            );
            it('responds with 204 and delete the grocery', () => {
                const idToDelete = 2;
                return supertest(app)
                    .delete(`/api/groceries/${idToDelete}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get('/api/groceries')
                            .set('Authorization', helpers.makeAuthHeader(testUser))
                            .expect(helpers.makeExpectedGroceriesAfterDelete(testUser,
                                testGroceries, idToDelete))
                    )
            });
        });
    });
});