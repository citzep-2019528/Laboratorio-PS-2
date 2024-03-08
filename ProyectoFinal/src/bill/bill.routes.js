'use strict'

import { Router } from "express"
import { validateJwt } from "../middleware/validate-jwt.js"
import { generatingBill, newBill } from "./bill.controller.js"

const api = Router()

api.get('/newBill',[validateJwt], newBill )
api.get('/generating', [validateJwt], generatingBill)

export default api