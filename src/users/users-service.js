const bcrypt = require('bcryptjs');
const xss = require('xss');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
    hasUserWithUserName(db, user_name) {
        return db('recipro_users')
            .where({user_name})
            .first()
            .then(user => !!user);
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('recipro_users')
            .returning('*')
            .then(([user]) => user);
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters';
        }

        if (password.length > 72) {
            return 'Password must be less than 72 characters';
        }

        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start with or end with spaces';
        }

        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain one upper case, lower case, number and special character';
        }
        return null;
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12);
    },
    serializeUser(user) {
        return {
            user_name: xss(user.user_name),
            password: password
        }
    }
};

module.exports = UsersService;