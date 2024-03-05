'use strict'

import { Router } from "express";
import { deleteC, newCategory, search, seeCategory, test, update } from "./category.controller.js";
import { isAdmin, validateJwt } from "../midleware/validate-jwt.js";


const api = Router()

api.get('/test',[validateJwt, isAdmin], test)
api.post('/new', [validateJwt, isAdmin], newCategory)
api.put('/update/:id', [validateJwt, isAdmin], update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteC)
api.post('/search', search)
api.get('/see', seeCategory)

export default api