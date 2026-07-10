import express from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { getWishlists, createWishlist, deleteWishlist } from './wishlist.controller.js'
const wishlistRoute = express.Router();

wishlistRoute.get('/', authMiddleware, getWishlists)
wishlistRoute.post('/', authMiddleware, createWishlist)
wishlistRoute.delete('/:product_id', authMiddleware, deleteWishlist)

export default wishlistRoute;