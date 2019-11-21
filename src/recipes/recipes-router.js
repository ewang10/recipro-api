const express = require('express');
const path = require('path')
const RecipesService = require('./recipes-service');
const { requireAuth } = require('../middleware/jwt-auth');

const recipesRouter = express.Router();
const jsonParser = express.json();

