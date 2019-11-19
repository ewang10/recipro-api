const express = require('express');
const UsersService = require('./users-service');
const path = require('path');

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .post('/', jsonParser, (req, res, next) => {
        const {user_name, password} = req.body;

        const newUserRequiredFields = {user_name, password};

        for(const [key, value] of Object.entries(newUserRequiredFields)) {
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

        UsersService.hasUserWithUserName(
            req.app.get('db'),
            user_name
        )
            .then(hasUserWithUserName => {
                console.log('hasUserWithUserName ', hasUserWithUserName)
                if (hasUserWithUserName) {
                    
                    return res.status(400).json({
                        error: 'Username already taken'
                    });
                }

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            user_name,
                            password: hashedPassword
                        };
                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                            })
                    })
            })
            .catch(next)
    });

module.exports = usersRouter;