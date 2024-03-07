'use strict'

import { Router } from "express"
import { deleteP, newProduct, search, seeProduct, test, update } from "./product.controller.js"
import { isAdmin, validateJwt } from "../middleware/validate-jwt.js"

const api = Router()

api.get('/test',[validateJwt, isAdmin], test)
api.post('/new', [validateJwt, isAdmin], newProduct)
api.put('/update/:id',[validateJwt, isAdmin], update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteP)
api.post('/search', search)
api.get('/see', seeProduct)

export default api