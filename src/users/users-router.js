const express = require('express');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .post('/', jsonParser, (req, res, next) => {
        const {user_name, password} = req.body;

        const newUser = {user_name, password};

        for(const [key, value] of Object.entries(newUser)) {
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                });
            }
        }

        const passwordError = UsersService.validatePassword(password);
        if (passwordError) {
            return res.status(400).json({
                error: passwordError
            });
        }
    });

module.exports = usersRouter;