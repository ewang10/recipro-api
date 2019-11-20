const bcrypte = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypte.hashSync(user.password, 1)
    }))
    return db
        .into('recipro_users')
        .insert(preppedUsers);
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign(
        {user_id: user.id},
        secret,
        {
            subject: user.user_name,
            algorithm: 'HS256'
        }
    );
    return `Bearer ${token}`;
}

module.exports = {
    cleanTables,
    makeUsersArray,
    seedUsers,
    makeAuthHeader,
}