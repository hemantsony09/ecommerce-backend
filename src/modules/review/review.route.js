import express from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { postReview, updateReview, getReview, deleteReview } from './review.controller.js'
const reviewsRoute = express.Router()

reviewsRoute.get('/:product_id/reviews', getReview)
reviewsRoute.post('/reviews', authMiddleware, postReview)
reviewsRoute.patch('/:reviewId', authMiddleware, updateReview)
reviewsRoute.delete('/:reviewId', authMiddleware, deleteReview)

export default reviewsRoute;