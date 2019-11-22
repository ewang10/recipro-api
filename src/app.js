require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV} = require('./config');
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const fridgeCategoriesRouter = require('./fridge_categories/fridge_categories-router');
const fridgeItemsRouter = require('./fridge_items/fridge_items-router');
const pantryCategoriesRouter = require('./pantry_categories/pantry_categories-router');
const pantryItemsRouter = require('./pantry_items/pantry_items-router');
const groceriesRouter = require('./groceries/groceries-router');
const recipesRouter = require('./recipes/recipes-router');
const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/fridge-categories', fridgeCategoriesRouter);
app.use('/api/fridge-items', fridgeItemsRouter);
app.use('/api/pantry-categories', pantryCategoriesRouter);
app.use('/api/pantry-items', pantryItemsRouter);
app.use('/api/groceries', groceriesRouter);
app.use('/api/recipes', recipesRouter);

app.use(function errorHandler(error, req, res, next) {
    let response;
    if(NODE_ENV === 'production') {
        response = {error: {message: 'server error'}};
    } else {
        console.log(error);
        response = {message: error.message, error};
    }
    res.status(500).json(response);
});

module.exports = app;