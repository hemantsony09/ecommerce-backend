import express from 'express'
import {authMiddleware} from '../../middlewares/auth.middleware'

const addressRoute = express.Router()

addressRoute.get('/',authMiddleware,)
addressRoute.get('/:id',authMiddleware,)

addressRoute.post('/',authMiddleware,)
addressRoute.patch('/:id',authMiddleware,)

addressRoute.delete('/:id',authMiddleware,)