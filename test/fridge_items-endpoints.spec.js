const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Fridge Items Endpoints', () => {
    let db;

    testItems = helpers.makeFridgeItemsArray();
    testItem = testItems[0];
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



    describe('GET /api/fridge-items', () => {
        context('Given no items', () => {
            it('responds with 200 and empty list', () => {
                return supertest(app)
                    .get('/api/fridge-items')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, []);
            });
        });
        context('Given there are items in db', () => {
            beforeEach('insert categories', () =>
                helpers.seedFridgeCategories(db, testCategories)
            );
            beforeEach('insert items', () =>
                helpers.seedFridgeItems(db, testItems)
            );
            it('responds with 200 and all items for the user', () => {
                return supertest(app)
                    .get('/api/fridge-items')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, helpers.makeExpectedItems(testUser, testItems));
            });
        });
        context('Given a XSS attack item', () => {
            const { maliciousItem, expectedItem } = helpers.makeMaliciousItem();
            beforeEach('insert categories', () =>
                helpers.seedFridgeCategories(db, testCategories)
            );
            beforeEach('inserting malicious item', () =>
                helpers.seedFridgeItems(db, maliciousItem)
            );
            it('removes xss content', () => {
                return supertest(app)
                    .get('/api/fridge-items')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].name).to.eql(expectedItem.name);
                        expect(res.body[0].note).to.eql(expectedItem.note);
                    });
            });
        });
    });

    describe('GET /api/fridge-items/:item_id', () => {
        context('Given no items', () => {
            it('responds with 404', () => {
                const itemId = 1234;
                return supertest(app)
                    .get(`/api/fridge-items/${itemId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {
                        error: { message: `Item doesn't exist` }
                    });
            });
        });

        context('Given there are items in db', () => {
            beforeEach('insert categories', () =>
                helpers.seedFridgeCategories(db, testCategories)
            );
            beforeEach('insert items', () =>
                helpers.seedFridgeItems(db, testItems)
            );
            it('responds with 200 and specified item', () => {
                const itemId = 2;
                return supertest(app)
                    .get(`/api/fridge-items/${itemId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, helpers.makeExpectedItem(testUser, testItems, itemId));
            });
        });

        context('Given a XSS attack item', () => {
            const { maliciousItem, expectedItem } = helpers.makeMaliciousItem();
            beforeEach('insert categories', () =>
                helpers.seedFridgeCategories(db, testCategories)
            );
            beforeEach('inserting malicious item', () =>
                helpers.seedFridgeItems(db, maliciousItem)
            );
            it('removes xss content', () => {
                return supertest(app)
                    .get(`/api/fridge-items/${maliciousItem.id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body.name).to.eql(expectedItem.name);
                        expect(res.body.note).to.eql(expectedItem.note);
                    });
            });
        });
    });

    describe('POST /api/fridge-items', () => {
        beforeEach('insert categories', () =>
            helpers.seedFridgeCategories(db, testCategories)
        );
        const requiredFields = ['name', 'expiration', 'categoryid'];
        requiredFields.forEach(field => {
            const newItem = {
                name: 'test new name',
                modified: new Date(),
                expiration: '2020-11-11',
                note: 'test new note',
                categoryid: 1
            };

            it(`responds with 400 when '${field}' is missing`, () => {
                delete newItem[field];
                return supertest(app)
                    .post('/api/fridge-items')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newItem)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    });
            });
        });

        it('responds with 201 and newly created item', () => {

            const newItem = {
                name: 'test new name',
                modified: new Date(),
                expiration: '2020-11-11',
                note: 'test new note',
                categoryid: 1
            };
            return supertest(app)
                .post('/api/fridge-items')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newItem)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id');
                    expect(res.body.name).to.eql(newItem.name);
                    expect(res.body.expiration).to.eql(newItem.expiration);
                    expect(res.body.note).to.eql(newItem.note);
                    expect(res.body.categoryid).to.eql(newItem.categoryid);
                    expect(res.headers.location).to.eql(`/api/fridge-items/${res.body.id}`);
                    const expectedDate = new Intl.DateTimeFormat('en-US').format(new Date());
                    const actualDate = new Intl.DateTimeFormat('en-US').format(new Date(res.body.modified));
                    expect(expectedDate).to.eql(actualDate);
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/fridge-items/${res.body.id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(res.body)
                );
        });

        it('removes XSS attack content from response', () => {
            const { maliciousItem, expectedItem } = helpers.makeMaliciousItem();
            return supertest(app)
                .post('/api/fridge-items')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(maliciousItem)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(expectedItem.name);
                    expect(res.body.note).to.eql(expectedItem.note);
                });
        });
    });

    describe('DELETE /api/fridge-items/:item_id', () => {
        context('Given no items', () => {
            beforeEach('insert categories', () =>
                helpers.seedFridgeCategories(db, testCategories)
            );
            it('responds with 404', () => {
                const idToDelete = 1234;
                return supertest(app)
                    .delete(`/api/fridge-items/${idToDelete}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {
                        error: { message: `Item doesn't exist` }
                    });
            });
        });

        context('Given there are items in db', () => {
            beforeEach('insert categories', () =>
                helpers.seedFridgeCategories(db, testCategories)
            );
            beforeEach('insert items', () =>
                helpers.seedFridgeItems(db, testItems)
            );
            it('responds with 204 and removes the item', () => {
                const idToDelete = 2;
                const expectedItems = helpers.makeExpectedItemsAfterDelete(
                    testUser,
                    testItems,
                    idToDelete
                );
                return supertest(app)
                    .delete(`/api/fridge-items/${idToDelete}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get(`/api/fridge-items`)
                            .set('Authorization', helpers.makeAuthHeader(testUser))
                            .expect(expectedItems)
                    );
            });
        });
    });

    describe('PATCH /api/fridge-items/:item_id', () => {
        context('Given no items', () => {
            beforeEach('insert categories', () =>
                helpers.seedFridgeCategories(db, testCategories)
            );
            it('responds with 404', () => {
                const idToUpdate = 1234;
                return supertest(app)
                    .patch(`/api/fridge-items/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {
                        error: { message: `Item doesn't exist` }
                    });
            });
        });
        context('Given there are items in db', () => {
            beforeEach('insert categories', () =>
                helpers.seedFridgeCategories(db, testCategories)
            );
            beforeEach('insert items', () =>
                helpers.seedFridgeItems(db, testItems)
            );

            it('responds 400 when no required field supplied', () => {
                const idToUpdate = 2;
                return supertest(app)
                    .patch(`/api/fridge-items/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send({
                        irrelevantField: "irrelevant"
                    })
                    .expect(400, {
                        error: { message: `Request body must contain either 'name', 'expiration', 'note', or 'categoryid'` }
                    });
            });
            it('responds with 204 and updates the item', () => {
                const idToUpdate = 2;
                const updatedItem = {
                    name: 'update name',
                    expiration: '1111-11-11',
                    note: 'update note',
                    categoryid: 2
                };
                const itemToUpdate = helpers.makeExpectedItem(testUser, testItems, idToUpdate);
                const expectedItem = {
                    ...itemToUpdate,
                    ...updatedItem
                };

                return supertest(app)
                    .patch(`/api/fridge-items/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(updatedItem)
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get(`/api/fridge-items/${idToUpdate}`)
                            .set('Authorization', helpers.makeAuthHeader(testUser))
                            .expect(expectedItem)
                    );
            });
            it('responds with 204 and updates the item with partial update', () => {
                const idToUpdate = 2;
                const updatedItem = {
                    expiration: '1111-11-11',
                    note: 'update note'
                };
                const itemToUpdate = helpers.makeExpectedItem(testUser, testItems, idToUpdate);
                const expectedItem = {
                    ...itemToUpdate,
                    ...updatedItem
                };

                return supertest(app)
                    .patch(`/api/fridge-items/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send({
                        ...updatedItem,
                        fieldToIgnore: "random field"
                    })
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get(`/api/fridge-items/${idToUpdate}`)
                            .set('Authorization', helpers.makeAuthHeader(testUser))
                            .expect(expectedItem)
                    );
            });
        });
    });
});