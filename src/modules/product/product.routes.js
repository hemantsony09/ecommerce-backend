import express from 'express'
import {authMiddleware} from '../../middlewares/auth.middleware.js'
import {adminMiddleware} from '../../middlewares/admin.middleware.js'
import {getAllProducts,getProductById,deleteProductById,updateProduct,createProduct} from './product.controller.js'
const productRoute = express.Router();

productRoute.get('/',getAllProducts)
productRoute.get('/:id',getProductById)

productRoute.post('/',authMiddleware,adminMiddleware,createProduct)
productRoute.patch('/:id',authMiddleware,adminMiddleware,updateProduct)

productRoute.delete('/:id',authMiddleware,adminMiddleware,deleteProductById)

export default productRoute;