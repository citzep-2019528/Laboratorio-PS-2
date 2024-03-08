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
        await Cart.updateOne({ client: uid},{$set:{products:[]} }, {total : null})
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
        let date = new Date().toLocaleDateString('en-US',{timeZone: 'UTC'})
        let product = await Product.findOne()
        if (!bill) {
            return res.status(404).send({ message: 'bill not found' })
        }
        let doc = new pdf()
        const filePath = path.resolve(`bill_${uid}.pdf`)
        doc.pipe(fs.createWriteStream(filePath))
        doc.fontSize(16).font('Helvetica-Bold').text(`Factura No. ${bill._id}`)
        doc.moveDown()

        doc.fontSize(10).font('Helvetica').text(`Date: ${date}`, { align: 'right' })
        doc.fontSize(12).font('Helvetica').text(`Client: ${bill.user.name}`, { align: 'left' })
        doc.moveDown()

        doc.fontSize(14).font('Helvetica-Bold').text('Products           |            Cantidad           |            Precio');
        doc.moveDown()
        bill.products.forEach((products, index) => {
            doc.fontSize(12).font('Helvetica').text(`${index + 1}. ${products.product.name}                                        ${products.quantity}                                       Q.${product.price}`)
        });

        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text('____________________________________________________________');
        doc.fontSize(14).font('Helvetica').text(`Total: ---------------------------------------------------------- Q${bill.total}`);
        doc.end();
        res.sendFile(filePath);
        return res.send({message: 'Generating bill'})
    }catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'error in bill generation' });

    }
}