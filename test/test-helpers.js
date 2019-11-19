function cleanTables(db) {
    return db.raw('TRUNCATE recipro_users RESTART IDENTITY CASCADE');
}

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test user1',
            password: 'password'
        }, {
            id: 2,
            user_name: 'test user2',
            password: 'password'
        }, {
            id: 3,
            user_name: 'test user3',
            password: 'password'
        }
    ];
}

function seedUsers(db, users) {
    return db
        .insert(users)
        .into('recipro_users');
}

module.exports = {
    cleanTables,
    makeUsersArray,
    seedUsers,
}