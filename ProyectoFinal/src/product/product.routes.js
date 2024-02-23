'use strict'

import { Router } from "express"
import { deleteP, newProduct, search, seeProduct, test, update } from "./product.controller.js"

const api = Router()

api.get('/test', test)
api.post('/new', newProduct)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteP)
api.post('/search', search)
api.get('/see', seeProduct)

export default api