import express from 'express'

const reviewsRoute = express.Router()

reviewsRoute.get('/:product_id/reviews')
reviewsRoute.post('/reviews')
reviewsRoute.patch('/:reviewId')
reviewsRoute.delete('/:reviewId')