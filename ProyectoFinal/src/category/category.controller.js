'use strict'

import Category from './category.model.js'
import { checkUpdateC } from '../utils/validator.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message:'Test is running'})
}

//Agregar nueva categoria
export const newCategory =async(req, res)=>{
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({message: `Registered succesfully ${category.name}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error registering category', err: err})
    }
}

//Editar categoria
export const update = async (req, res)=>{
    try {
        let data = req.body
        let{id} = req.params
        let update = checkUpdateC(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updateCategory = await Category.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updateCategory) return res.status(404).send({menssage: 'Category not found and not upadate'})
        return res.send({menssage:'Update new', updateCategory})
    } catch (err) {
        return res.status(500).send({message:'Error updatting account'})
    }
}

//Eliminar categoria
export const deleteC = async (req, res)=>{
    try {
        let{ id } = req.params
        let deleteCategory = await Category.findOneAndDelete({_id: id})
        if(!deleteCategory) return res.status(404).send({message: 'Category not found and not delete'})
        return res.send({message: 'Delete successfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error deleting account'})
    }
}

//Buscar
export const search = async (req, res)=>{
    try {
        let {search} = req.body
        let category = await Category.find(
            {name: search}
        )
        if(!category) return res.status(404).send({menssage: 'Category not found'})
        return res.send({menssage: 'Category found', category})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error searching category'})
    }
}

//Obtener categorias
export const seeCategory = async (req, res) => {
    try {
        let category = await Category.find()
        return res.send(category)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error '})
    }
}