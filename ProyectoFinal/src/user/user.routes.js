import express from 'express'
import {
        deleteAdmin,
        deleteClient,
        login, 
        registerA, 
        registerC, 
        test, 
        update} from './user.controller.js'
import { isAdmin, validateJwt } from '../middleware/validate-jwt.js'

const api = express.Router()
//publicas
api.post('/login', login)

//CLIETN
api.put('/updateCliente', update)
api.post('/register', registerC)
api.delete('/delete/:id', [validateJwt], deleteClient)

api.put('/update/:id', [validateJwt], update)

//ADMON
api.get('/test', [validateJwt, isAdmin], test)
api.post('/registerA',[validateJwt, isAdmin], registerA)
api.delete('/deleteAdmin/:id', [validateJwt, isAdmin], deleteAdmin)

export default api