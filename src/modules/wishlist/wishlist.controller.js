import db from '../../db/index.js'
import { wishlistTable, productsTable } from '../../db/schema/schema.js'
import { eq, and } from 'drizzle-orm'

export const getWishlists = async (req, res) => {
    const user = req.user
    try {
        const wishlists = await db.select({
            product_id: productsTable.id,
            name: productsTable.name,
            thumbnail: productsTable.thumbnail,
            price: productsTable.price,
            stock: productsTable.stock,
            is_active: productsTable.is_active
        }).from(productsTable).innerJoin(
            wishlistTable,
            eq(productsTable.id, wishlistTable.product_id)
        )
            .where(eq(wishlistTable.user_id, user.id))

        return res.status(200).json({ success: true, data: wishlists })

    }
    catch (error) {
        return res.status(500).json({ success: false, error: "internal server error" })
    }
}

export const createWishlist = async (req, res) => {
    const user = req.user
    const { product_id } = req.body

    try {
        const [product] = await db.select().from(productsTable).where(eq(productsTable.id, product_id))
        if (!product) {
            return res.status(400).json({ success: false, error: "product not found " })
        }

        const [existingWishlist] = await db.select().from(wishlistTable).where(and(eq(wishlistTable.user_id, user.id), eq(wishlistTable.product_id, product_id)))
        if (existingWishlist) {
            return res.status(400).json({ success: false, error: "product alrady exist in wishlist" })
        }

        const [wishlist] = await db.insert(wishlistTable).values({
            user_id: user.id,
            product_id: product_id
        }).returning()

        return res.status(200).json({ success: true, message: "product added to wishlist", data: wishlist })
    }
    catch (error) {
        return res.status(500).json({ success: false, error: "internal server error" })
    }
}

export const deleteWishlist = async (req, res) => {
    const user = req.user
    const { product_id } = req.params
    if (!product_id) {
        return res.status(400).json({ success: false, error: "missing field " })

    }
    try {
        const [product] = await db.select().from(productsTable).where(eq(productsTable.id, product_id))
        if (!product) {
            return res.status(400).json({ success: false, error: "product not found " })
        }
        const [existingWishlist] = await db.select().from(wishlistTable).where(and(eq(wishlistTable.user_id, user.id), eq(wishlistTable.product_id, product_id)))
        if (!existingWishlist) {
            return res.status(400).json({ success: false, error: "product not  exist in wishlist" })
        }

        const [wishlist] = await db.delete(wishlistTable).where(and(eq(wishlistTable.product_id, product_id), eq(wishlistTable.user_id, user.id))).returning()
        return res.status(200).json({ success: true, message: "product removed from wishlist", data: wishlist })
    }
    catch (error) {
        return res.status(500).json({ success: false, error: "internal server error" })
    }

}