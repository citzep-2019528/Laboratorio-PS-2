'use strict'

import Bill from '../bill/bill.model.js'
import Cart from '../shoppingCart/cart.model.js'
import Product  from '../product/product.model.js'
import pdf from 'pdfkit'
import fs from 'fs'
import path from 'path'


export const newBill = async (req, res)=>{
    try {
        let uid = req.user._id
        let rasho = await Cart.findOne({ client : uid })
        console.log(uid)
        if(!rasho || rasho.products.length === 0){
            return res.status(401).send({message:'empty shopping cart'})
        }
        let total = 0
        for (const item of rasho.products) {
            let product = await Product.findById(item.product);
            if(product){
                total += parseInt(product.price) * parseInt(item.quantity)
            }
        }
        let  newBill = new Bill({
            user : uid,
            cart: rasho._id,
            products : rasho.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                //price: item.price
            })),
            total : total
        })
        

        await newBill.save()
        await Cart.findOneAndDelete({ user: uid })
        return res.status(200).send({ message: 'generating bill' })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'error in bill generation' });
    }
}

export const generatingBill = async (req, res)=>{
    try{
        let uid = req.user._id
        let bill = await Bill.findOne({ user: uid }).populate('user').populate('products.product')
        if (!bill) {
            return res.status(404).send({ message: 'bill not found' })
        }
        let doc = new pdf()
        const filePath = path.resolve('bill.pdf')
        doc.pipe(fs.createWriteStream(filePath))
        doc.fontSize(14)
        doc.text('BILL', { aling: 'center' });
        doc.moveDown();

        doc.text(`Date: ${bill.date}`, { align: 'right' })
        doc.text(`Client: ${bill.user.name}`, { align: 'left' })
        doc.moveDown();

        doc.text('Products');
        doc.moveDown()
        bill.products.forEach((products, index) => {
            doc.text(`${index + 1}, ${products.product.name} - Cantidad: ${products.quantity}` )
        });

        doc.moveDown();
        doc.text(`Total: Q${bill.total}`);
        doc.end();
        res.sendFile(filePath);
        return res.send({message: 'Generating bill'})
    }catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'error in bill generation' });

    }
}