import db from "../../db/index.js";
import {
    cartsTable,
    cartItemsTable,
    productsTable,
} from "../../db/schema/schema.js";
import { eq, and } from "drizzle-orm";

export const addToCart = async (req, res) => {
    const user = req.user;
    const { product_id, quantity } = req.body;

    try {
        if (!product_id || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                error: "Invalid product_id or quantity",
            });
        }

        // Check product
        const [product] = await db
            .select({
                id: productsTable.id,
                stock: productsTable.stock,
            })
            .from(productsTable)
            .where(eq(productsTable.id, product_id));

        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Product not found",
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                error: "Insufficient stock",
            });
        }

        // Find/Create cart
        let [cart] = await db
            .select({
                id: cartsTable.id,
            })
            .from(cartsTable)
            .where(eq(cartsTable.user_id, user.id));

        if (!cart) {
            [cart] = await db
                .insert(cartsTable)
                .values({
                    user_id: user.id,
                })
                .returning({
                    id: cartsTable.id,
                });
        }

        // Check if already in cart
        const [existingItem] = await db
            .select({
                id: cartItemsTable.id,
                quantity: cartItemsTable.quantity,
            })
            .from(cartItemsTable)
            .where(
                and(
                    eq(cartItemsTable.cart_id, cart.id),
                    eq(cartItemsTable.product_id, product_id)
                )
            );

        if (existingItem) {
            const updatedQuantity = existingItem.quantity + quantity;

            if (updatedQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    error: "Insufficient stock",
                });
            }

            const [updatedItem] = await db
                .update(cartItemsTable)
                .set({
                    quantity: updatedQuantity,
                })
                .where(eq(cartItemsTable.id, existingItem.id))
                .returning();

            return res.status(200).json({
                success: true,
                message: "Cart updated",
                data: updatedItem,
            });
        }

        // Insert new item
        const [cartItem] = await db
            .insert(cartItemsTable)
            .values({
                cart_id: cart.id,
                product_id,
                quantity,
            })
            .returning();

        return res.status(201).json({
            success: true,
            message: "Product added to cart",
            data: cartItem,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

export const getCart = async (req, res) => {
    const user = req.user;

    try {
        const [cart] = await db
            .select({
                id: cartsTable.id,
            })
            .from(cartsTable)
            .where(eq(cartsTable.user_id, user.id));

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: [],
            });
        }

        const cartItems = await db
            .select({
                item_id: cartItemsTable.id,
                product_id: productsTable.id,
                name: productsTable.name,
                thumbnail: productsTable.thumbnail,
                price: productsTable.price,
                quantity: cartItemsTable.quantity,
            })
            .from(cartItemsTable)
            .innerJoin(
                productsTable,
                eq(cartItemsTable.product_id, productsTable.id)
            )
            .where(eq(cartItemsTable.cart_id, cart.id));

        return res.status(200).json({
            success: true,
            data: cartItems,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

export const updateCartItem = async (req, res) => {
    const user = req.user;
    const { product_id, quantity } = req.body
    try {


        if (!quantity || !product_id || quantity < 1) {
            return res.status(400).json({ error: 'missing field or invalid quantity' })
        }


        const [productStock] = await db.select({ id: productsTable.id, stock: productsTable.stock }).from(productsTable).where(eq(productsTable.id, product_id))
        if (!productStock) {
            return res.status(404).json({
                success: false,
                error: "Product not found",
            });
        }
        if (quantity > productStock.stock) {
            return res.status(400).json({ success: false, error: 'insufficient stock' })
        }

        const [cartId] = await db.select({ id: cartsTable.id }).from(cartsTable).where(eq(cartsTable.user_id, user.id))
        if (!cartId) {
            return res.status(404).json({
                success: false,
                error: "Cart not found",
            });
        }
        const [product] = await db.update(cartItemsTable).set({
            quantity
        }).where(
            and(
                eq(cartItemsTable.product_id, product_id),
                eq(cartItemsTable.cart_id, cartId.id),


            )
        ).returning()

        if (!product) {
            return res.status(400).json({ error: 'Product not found in cart' })
        }
        return res.status(200).json({ success: true, data: product })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }


}

export const deleteCartItem = async (req, res) => {
    const user = req.user
    const { product_id } = req.body;

    try{

        if(!product_id){
            return res.status(400).json({
                success: false,
                error: "missing field",
            });
            
        }
        const [cartId] = await db.select({ id: cartsTable.id }).from(cartsTable).where(eq(cartsTable.user_id, user.id))
        if (!cartId) {
            return res.status(404).json({
                success: false,
                error: "Cart not found",
            });
        }
        const [deleteCart] = await db.delete(cartItemsTable).where(and(eq(cartItemsTable.cart_id, cartId.id), eq(cartItemsTable.product_id, product_id))).returning()
        
        if(!deleteCart){
            return res.status(404).json({
                success: false,
                error: "Cart item not found",
            });
            
        }   
        return res.status(200).json({ success: true,
            data: deleteCart}) 
        }
        catch(error){
            return res.status(500).json({
            success: false,
              message: "Product removed from cart",
            error: "Internal server error",
        });
            
        }
            
        }