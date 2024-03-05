import express from 'express'
import {
        login, 
        registerA, 
        registerC, 
        test, 
        updateC} from './user.controller.js'
import { isAdmin, validateJwt } from '../midleware/validate-jwt.js'

const api = express.Router()
//publicas
api.post('/login', login)

//CLIETN
api.put('/updateCliente', updateC)
api.post('/register', registerC)

//ADMON
api.get('/test', [validateJwt, isAdmin], test)
api.post('/registerA',[validateJwt, isAdmin], registerA)
export default api