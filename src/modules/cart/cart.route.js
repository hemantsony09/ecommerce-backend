import express from 'express'
import {authMiddleware} from '../../middlewares/auth.middleware.js'
import {getCart,deleteCartItem,addToCart,updateCartItem} from './cart.controller.js'
const  cartRoute = express.Router()

cartRoute.get('/',authMiddleware,getCart)

cartRoute.post('/',authMiddleware,addToCart)
cartRoute.patch('/',authMiddleware,updateCartItem)

cartRoute.delete('/',authMiddleware,deleteCartItem)

export default cartRoute;