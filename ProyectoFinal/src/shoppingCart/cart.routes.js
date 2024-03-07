'use strict'

import { Router } from "express"
import { newCart } from "./cart.controller.js"
import { validateJwt } from "../middleware/validate-jwt.js"

const api = Router()

api.post('/new', [validateJwt], newCart )

export default api