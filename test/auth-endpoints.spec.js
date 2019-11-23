const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Auth Endpoints', () => {
    let db;

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

    testUsers = helpers.makeUsersArray();
    testUser = testUsers[0];

    describe('POST /api/auth/login', () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(db, testUsers)
        );

        const requiredFields = ['user_name', 'password'];

        requiredFields.forEach(field => {
            const userAttemptLogin = {
                user_name: testUser.user_name,
                password: testUser.password
            };

            it(`responds with 400 when '${field}' is missing`, () => {
                delete userAttemptLogin[field];

                return supertest(app)
                    .post('/api/auth/login')
                    .send(userAttemptLogin)
                    .expect(400, {
                        error: `Missing '${field}' in request body`
                    });
            });
        });

        it('responds with 400 when invalid username', () => {
            const userInvalidUserName = {
                user_name: 'user-not',
                password: 'existy'
            }
            return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidUserName)
                .expect(400, {
                    error: `Incorrect user_name or password`
                });
        });
        it('responds with 400 when invalid password', () => {
            const userInvalidPassword = {
                user_name: testUser.user_name,
                password: 'incorrect'
            }
            return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidPassword)
                .expect(400, {
                    error: `Incorrect user_name or password`
                });
        });

        it('responds with 200 and JWT auth token using secret when valid credentials', () => {
            const userValidCreds = {
                user_name: testUser.user_name,
                password: testUser.password
            };

            const expectedToken = jwt.sign(
                { user_id: testUser.id },
                process.env.JWT_SECRET,
                {
                    subject: testUser.user_name,
                    expiresIn: process.env.JWT_EXPIRY,
                    algorithm: 'HS256'
                }
            );

            return supertest(app)
                .post('/api/auth/login')
                .send(userValidCreds)
                .expect(200, {
                    authToken: expectedToken
                });
        });
    });

    describe('POST /api/auth/refresh', () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(db, testUsers)
        );

        it('responds with 200 and JWT token using secret', () => {
            const expectedToken = jwt.sign(
                { user_id: testUser.id },
                process.env.JWT_SECRET,
                {
                    subject: testUser.user_name,
                    expiresIn: process.env.JWT_EXPIRY,
                    algorithm: 'HS256'
                }
            );
            return supertest(app)
                .post('/api/auth/refresh')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(200, {
                    authToken: expectedToken
                });
        });
    });

});