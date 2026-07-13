import e from 'express'
import db from '../../db/index.js'
import {
    ordersTable,
    orderItemsTable,
    addressesTable,
    productsTable,
    cartsTable,
    cartItemsTable,
    usersTable
} from '../../db/schema/schema.js'
import { eq, and, desc } from 'drizzle-orm'

export const getOrders = async (req, res) => {
    const user = req.user
    try {

        const orders = await db.select({
            id: ordersTable.id,
            total_amount: ordersTable.total_amount,
            payment_status: ordersTable.payment_status,
            order_status: ordersTable.order_status,
            createdAt: ordersTable.createdAt
        }).from(ordersTable).where(eq(ordersTable.user_id, user.id)).orderBy(desc(ordersTable.createdAt));


        return res.status(200).json({ success: true, data: orders })
    }
    catch (error) {
        return res.status(500).json({ success: false, error: 'internal server error' })
    }
}


export const getOrderById = async (req, res) => {
    const user = req.user
    const { orderId } = req.params
    try {

        const [orders] = await db.select({
            id: ordersTable.id,
            total_amount: ordersTable.total_amount,
            address_id: ordersTable.address_id,
            payment_status: ordersTable.payment_status,
            order_status: ordersTable.order_status,
            createdAt: ordersTable.createdAt
        }).from(ordersTable).where(and(
            eq(ordersTable.id, orderId),
            eq(ordersTable.user_id, user.id)
        ))
        if (!orders) {
            return res.status(404).json({
                success: false,
                error: "Order not found",
            });
        }

        const [address] = await db.select().from(addressesTable).where(and(eq(addressesTable.id, orders.address_id), eq(addressesTable.user_id, user.id)))

        const items = await db
            .select({
                product_id: orderItemsTable.product_id,
                name: productsTable.name,
                thumbnail: productsTable.thumbnail,
                quantity: orderItemsTable.quantity,
                price: orderItemsTable.price,
            })
            .from(orderItemsTable)
            .innerJoin(
                productsTable,
                eq(orderItemsTable.product_id, productsTable.id)
            )
            .where(eq(orderItemsTable.order_id, orders.id));




        return res.status(200).json({
            success: true,
            data: {
                ...orders,
                address,
                items,
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: 'internal server error' })
    }
}

export const placeOrder = async (req, res) => {
    const user = req.user;
    const { address_id } = req.body;

    try {

        // Check Address
        const [address] = await db
            .select({ id: addressesTable.id })
            .from(addressesTable)
            .where(
                and(
                    eq(addressesTable.id, address_id),
                    eq(addressesTable.user_id, user.id)
                )
            );

        if (!address) {
            return res.status(404).json({
                success: false,
                error: "Address not found",
            });
        }

        // Get Cart
        const [cart] = await db
            .select({ id: cartsTable.id })
            .from(cartsTable)
            .where(eq(cartsTable.user_id, user.id));

        if (!cart) {
            return res.status(404).json({
                success: false,
                error: "Cart not found",
            });
        }

        // Get Cart Items
        const cartItems = await db
            .select()
            .from(cartItemsTable)
            .where(eq(cartItemsTable.cart_id, cart.id));

        if (cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Cart is empty",
            });
        }

        // Calculate Total & Check Stock
        let total = 0;

        for (const item of cartItems) {

            const [product] = await db
                .select({
                    id: productsTable.id,
                    name: productsTable.name,
                    price: productsTable.price,
                    stock: productsTable.stock,
                })
                .from(productsTable)
                .where(eq(productsTable.id, item.product_id));

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: "Product not found",
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: `${product.name} has insufficient stock`,
                });
            }

            total += Number(product.price) * item.quantity;
        }


        const [order] = await db
            .insert(ordersTable)
            .values({
                user_id: user.id,
                address_id,
                total_amount: total,
                payment_status: "pending",
                order_status: "pending",
            })
            .returning({
                id: ordersTable.id,
            });

    
        await db.transaction(async(tx)=>{

            for (const item of cartItems) {
                
                const [product] = await tx
                .select({
                    price: productsTable.price,
                })
                .from(productsTable)
                .where(eq(productsTable.id, item.product_id));
                
                await tx.insert(orderItemsTable).values({
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: product.price,
                });
            }
            
        })
        
        await db.transaction(async(tx)=>{
        for (const item of cartItems) {
 
            const [product] = await tx
            .select({
                stock: productsTable.stock,
            })
            .from(productsTable)
            .where(eq(productsTable.id, item.product_id));
            
            await tx
            .update(productsTable)
            .set({
                stock: product.stock - item.quantity,
            })
            .where(eq(productsTable.id, item.product_id));
        }
    })

        await db
            .delete(cartItemsTable)
            .where(eq(cartItemsTable.cart_id, cart.id));

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: {
                order_id: order.id,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}

export const getAllOrderForAdmin = async (req, res) => {

    try {
        const orders = await db.select({ id: ordersTable.id, customer: usersTable.name, total_amount: ordersTable.total_amount, payment_status: ordersTable.payment_status, order_status: ordersTable.order_status, createdAt: ordersTable.createdAt }).from(ordersTable).innerJoin(usersTable, eq(ordersTable.user_id, usersTable.id))

        return res.status(200).json({ success: true, data: orders })
    }
    catch (error) {
        return res.status(500).json({ error: "internal server error" })
    }
}

export const updateOrderByAdmin = async (req, res) => {
    const { orderId } = req.params;
    const { order_status } = req.body;
    try {
        const validStatus = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
        ];

        if (!validStatus.includes(order_status)) {
            return res.status(400).json({
                success: false,
                error: "Invalid order status",
            });
        }

        const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId))

        if (!order) {
            return res.status(404).json({success:false, error: "order not found" })
        }
        const updateData = {}
        updateData.order_status = order_status;


        if (order_status === 'delivered') {
            updateData.payment_status = "paid"
        }

        const [updatedOrder] = await db.update(ordersTable).set(updateData).where(eq(ordersTable.id, orderId)).returning()

        return res.status(200).json({success:true, message: "order status updated ", data: updatedOrder })
    }
    catch (error) {
        return res.status(500).json({success:false, error: "internal server error" })
    }

}