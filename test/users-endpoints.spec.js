const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', () => {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });


    after('disconnecting from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));
    afterEach('cleanup', () => helpers.cleanTables(db));


    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];

    describe('POST /api/users', () => {
        context('user validation', () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(db, testUsers)
            );
            const requiredFields = ['user_name', 'password'];
            requiredFields.forEach(field => {
                const newUser = {
                    user_name: 'new user_name',
                    password: 'new password'
                };

                it(`responds with 400 when ${field} is missing`, () => {
                    delete newUser[field];

                    return supertest(app)
                        .post('/api/users')
                        .send(newUser)
                        .expect(400, {
                            error: `Missing '${field}' in request body`
                        });
                });
            });

            it(`responds 400 'Password must be longer than 8 characters' when short password`, () => {
                const userShortPassword = {
                    user_name: 'test user_name',
                    password: '1234567'
                };
                return supertest(app)
                    .post('/api/users')
                    .send(userShortPassword)
                    .expect(400, {
                        error: 'Password must be longer than 8 characters'
                    });
            });

            it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
                const userLongPassword = {
                    user_name: 'test user_name',
                    password: '*'.repeat(73)
                };
                return supertest(app)
                    .post('/api/users')
                    .send(userLongPassword)
                    .expect(400, {
                        error: 'Password must be less than 72 characters'
                    });
            });

            it(`responds 400 when password starts with spaces`, () => {
                const userPasswordStartWithSpaces = {
                    user_name: 'test user_name',
                    password: ' 1!AaaA!1'
                };
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordStartWithSpaces)
                    .expect(400, {
                        error: 'Password must not start with or end with spaces'
                    });
            });

            it(`responds 400 when password ends with spaces`, () => {
                const userPasswordEndWithSpaces = {
                    user_name: 'test user_name',
                    password: '1!AaaA!1 '
                };
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordEndWithSpaces)
                    .expect(400, {
                        error: 'Password must not start with or end with spaces'
                    });
            });

            it(`responds 400 when password is not complex enough`, () => {
                const userPasswordNotComplex = {
                    user_name: 'test user_name',
                    password: 'test password 1111'
                };
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordNotComplex)
                    .expect(400, {
                        error: 'Password must contain one upper case, lower case, number and special character'
                    });
            });
            it(`responds 400 when user_name is taken`, () => {

                const userUserNameTaken = {
                    user_name: testUser.user_name,
                    password: '11AAaa!!'
                };
                return supertest(app)
                    .post('/api/users')
                    .send(userUserNameTaken)
                    .expect(400, {
                        error: 'Username already taken'
                    });
            });
        });
        context('happy path', () => {
            it('responds with 201, serialize user, storing bcrypt password', () => {
                const newUser = {
                    user_name: 'test new_user',
                    password: '11AAaa!!'
                };
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.user_name).to.eql(newUser.user_name);
                        expect(res.body).to.not.have.property('password');
                        expect(res.body).to.have.property('id');
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
                    })
                    .expect(res => {
                        db
                            .from('recipro_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.user_name).to.eql(newUser.user_name);
                                return bcrypt.compare(newUser.password, row.password);
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true;
                            });
                    });
            });
        });
    });

});