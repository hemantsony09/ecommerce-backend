import db from '../../db/index.js'
import { eq, and } from 'drizzle-orm'
import { productsTable, reviewsTable, usersTable } from '../../db/schema/schema.js'

export const postReview = async (req, res) => {
    const user = req.user
    const { product_id, rating, comment } = req.body
    try {

        if (!product_id || !rating) {
            return res.status(400).json({ success: false, error: 'missing field' })
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: "Rating must be between 1 and 5",
            });
        }

        const [exitingProduct] = await db.select().from(productsTable).where(eq(productsTable.id, product_id))
        if (!exitingProduct) {
            return res.status(404).json({ success: false, error: 'product not found' })
        }

        const [existingReview] = await db.select().from(reviewsTable).where(and(eq(reviewsTable.user_id, user.id), eq(reviewsTable.product_id, product_id)))

        if (existingReview) {
            return res.status(409).json({
                success: false,
                error: "You have already reviewed this product",
            });
        }
        const [review] = await db.insert(reviewsTable).values({
            user_id: user.id,
            product_id,
            rating,
            comment
        }).returning()

        return res.status(201).json({ success: true, message: 'review created', data: review })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'internal server error' })

    }
}
export const getReview = async (req, res) => {

    const { product_id } = req.params
    try {

        const [exitingProduct] = await db.select().from(productsTable).where(eq(productsTable.id, product_id))
        if (!exitingProduct) {
            return res.status(404).json({ success: false, error: 'product not found' })
        }

        const productReview = await db.select({ user: usersTable.name, rating: reviewsTable.rating, comment: reviewsTable.comment, createdAt: reviewsTable.createdAt }).from(reviewsTable).innerJoin(usersTable, eq(usersTable.id, reviewsTable.user_id)).where(eq(reviewsTable.product_id, product_id))

        return res.status(200).json({ success: true, data: productReview })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'internal server error' })

    }

}

export const updateReview = async (req, res) => {
    const user = req.user
    const { reviewId } = req.params
    const { rating, comment } = req.body


    try {
        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                error: "Rating must be between 1 and 5",
            });
        }
        const updateData = {};

        if (rating !== undefined) updateData.rating = rating;
        if (comment !== undefined) updateData.comment = comment;


        const [existingReview] = await db.select().from(reviewsTable).where(and(eq(reviewsTable.user_id, user.id), eq(reviewsTable.id, reviewId)))
        if (!existingReview) {
            return res.status(404).json({ success: false, error: 'Review not found' })
        }

        const [updateReview] = await db.update(reviewsTable).set(updateData).where(
            and(
                eq(reviewsTable.id, reviewId),
                eq(reviewsTable.user_id, user.id)
            )
        ).returning()

        return res.status(200).json({ success: true, message: 'review updated', data: updateReview })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'internal server error' })

    }
}

export const deleteReview = async (req, res) => {
    const user = req.user
    const { reviewId } = req.params
    try {
        const [review] = await db.delete(reviewsTable).where(and(eq(reviewsTable.id, reviewId), eq(reviewsTable.user_id, user.id))).returning()
        if(!review){
            return res.status(404).json({ success: false, error: 'Review not found' })
        }
        return res.status(200).json({ success: true, message: 'review deleted' })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'internal server error' })

    }
}