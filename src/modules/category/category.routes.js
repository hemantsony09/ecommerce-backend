import express from 'express'
import {authMiddleware} from '../../middlewares/auth.middleware.js'
import {adminMiddleware} from '../../middlewares/admin.middleware.js'
import {allCategories,getCategoryById ,deleteCategoryById,createCategory,updateCategoryById} from './category.controller.js'
const categoryRoute = express.Router();

categoryRoute.get('/categories',allCategories)
categoryRoute.get('/categories/:id',getCategoryById)

categoryRoute.post('/categories',authMiddleware,adminMiddleware,createCategory)
categoryRoute.patch('/categories/:id',authMiddleware,adminMiddleware,updateCategoryById)

categoryRoute.delete('/categories/:id',authMiddleware,adminMiddleware,deleteCategoryById)

export default categoryRoute;