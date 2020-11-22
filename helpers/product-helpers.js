var db = require('../config/connection')
var collection = require('../config/collections');
const { response } = require('express');
var objectId = require('mongodb').ObjectID

module.exports = {

    addProduct: (product, callback) => {
        console.log(product);
        product.Price = parseInt(product.Price);
        db.get().collection('product').insertOne(product).then((data) => {
            callback(data.ops[0]._id)
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectId(proId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },
    updateProduct: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            product.Price = parseInt(product.Price);
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(proId) }, {
                $set: {
                    Name: proDetails.Name,
                    Category: proDetails.Category,
                    Price: proDetails.Price,
                    Description: proDetails.Description
                }
            }).then((response) => {
                resolve()
            })
        })
    },
    cartDeleteProduct: (proId, userId) => {
        return new Promise(async (resolve, reject) => {
            let proObj = {
                item: objectId(proId)
            }

            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            
            if (userCart) {
                db.get().collection(collection.CART_COLLECTION).
                    updateOne({ user: objectId(userId) },
                        {
                            $pull: { products: proObj }
                        }
                    ).then((response) => {
                        resolve(response)
                    })
            }

        })

    }
}