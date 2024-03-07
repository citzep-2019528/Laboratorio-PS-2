'use strict'

import Cart from './cart.model.js'
import Product from '../product/product.model.js'

export const newCart =  async (req, res)=>{
    try {
        let {product, quantity} = req.body
        let uid = req.user._id

        let rasho = await Cart.findOne({ client: uid})
        if(!rasho){
            rasho = new Cart({client: uid, products:[]})
        }

        let items = await Product.findById(product)
        if(!items){
            return res.status(404).send({message: 'Product not found'})
        }
        if(parseInt(items.stock) < parseInt(quantity)){
            return res.status(404).send({message: 'Insufficient products'})
        }
        items.stock = parseInt(items.stock) - parseInt(quantity)
        await items.save()

        let existence = rasho.products.findIndex(item => item.product.toString()===product.toString())
        if (existence !== -1){
            rasho.products[existence].quantity += parseInt(quantity)
        }else{
            rasho.products.push({product: product, quantity})
        }

        await rasho.save()
        return res.send({message: 'Has been successfully added to the shopping cart'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error in shooping cart' })
    }
}