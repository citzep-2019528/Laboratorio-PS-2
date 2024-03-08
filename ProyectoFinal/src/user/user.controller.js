'use strict'


import User from './user.model.js'
import Bill from '../bill/bill.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'


export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

//registro de client
export const registerC = async (req, res) => {
    try {
        let data = req.body
        let exists = await User.findOne({
            $or: [
                {
                    user: data.username
                },
                {
                    email: data.email
                }
            ]
        })
        if (exists) {
            return res.status(500).send({ message: 'Email or username alredy exists' })
        }
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

//registro de usuarios
export const registerA = async (req, res) => {
    try {
        let data = req.body
        let exists = await User.findOne({
            $or: [
                {
                    user: data.username
                },
                {
                    email: data.email
                }
            ]
        })
        if (exists) {
            return res.status(500).send({ message: 'Email or username alredy exists' })
        }
        data.password = await encrypt(data.password)
        data.role = 'ADMIN'
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}
//login
export const login = async (req, res) => {
    try {
        let { username, password, email } = req.body
        let user = await User.findOne({
            $or: [
                {
                    username
                },
                {
                    email
                }
            ]
        })
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                surname: user.surname,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${loggedUser.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }

}

//update
export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let rol = req.user.role
        let uid = req.user._id
        //let {passwordOld} =  req.body
        //let {passwordNew} = req.body
        if (rol === 'CLIENT') {
            let update = checkUpdate(data, id)
            /*if(!passwordOld){
                return res.status(404).send({ message: 'Incorrect password'})
            }*/
            if (id != uid) return res.status(401).send({ message: 'This account does not belong to you' })
            if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
            let updatedUser = await User.findOneAndUpdate(
                { _id: uid },
                data,
                { new: true }
            )
            if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
            return res.send({ message: 'Updated user', updatedUser })
        } else if (rol === 'ADMIN') {
            let update = checkUpdate(data, id)
            if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
            let updatedUser = await User.findOneAndUpdate(
                { _id: id },
                data,
                { new: true }
            )
            if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
            return res.send({ message: 'Updated user', updatedUser })

        }

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating account' })
    }
}

//delete
export const deleteClient = async (req, res) => {
    try {
        let { id } = req.params
        let { validate } = req.body
        let uid = req.user._id
        if (!validate) return res.status(400).send({ message: 'Write authorization word' });
        if (validate !== 'DELETE') return res.status(400).send({ message: 'Authorization word = DELETE' });
        if(id != uid) return  res.status(401).send({ message: 'This is not your account' })
        let deletedUser = await User.findOneAndDelete({ _id: uid })
        if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })
        return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}

export const deleteAdmin = async (req, res)=>{
    try {
        let { id } = req.params
        let { validate} = req.body
        if (!validate) return res.status(400).send({ message: 'Write authorization word' });
        if (validate !== 'DELETE') return res.status(400).send({ message: 'Authorization word = DELETE' });
        let deletedUser = await User.findOneAndDelete({_id: id}) 
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
        return res.send({message: `Account with username ${deletedUser.username} deleted successfully`})
    } catch (err) {
        console.error(err)
    return res.status(500).send({ message: 'Error deleting account' })
    }
}

//ver compras
export const viewShopping= async (req, res)=>{
    try {
        let bill = await Bill.find()
        return res.send(bill)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error'})
    }
}

