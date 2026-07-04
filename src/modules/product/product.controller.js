import db from '../../db/index.js'
import { productsTable, categoriesTable } from '../../db/schema/schema.js'
import { eq } from 'drizzle-orm';
export const getAllProducts = async (req, res) => {

    try {
        const products = await db.select({
            id: productsTable.id,
            category_id: productsTable.category_id,
            name: productsTable.name,
            slug: productsTable.slug,
            description: productsTable.description,
            brand: productsTable.brand,
            sku: productsTable.sku,
            price: productsTable.price,
            discount_price: productsTable.discount_price,
            stock: productsTable.stock,
            thumbnail: productsTable.thumbnail,
            is_active: productsTable.is_active,
            createdAt: productsTable.createdAt,
            updatedAt: productsTable.updatedAt,
        }).from(productsTable);

        return res.status(200).json({
            success: true,
            data: products
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        })
    }
}


export const getProductById = async (req, res) => {
    const { id } = req.params
    try {
        const [product] = await db.select({
            id: productsTable.id,
            category_id: productsTable.category_id,
            name: productsTable.name,
            slug: productsTable.slug,
            description: productsTable.description,
            brand: productsTable.brand,
            sku: productsTable.sku,
            price: productsTable.price,
            discount_price: productsTable.discount_price,
            stock: productsTable.stock,
            thumbnail: productsTable.thumbnail,
            is_active: productsTable.is_active,
            createdAt: productsTable.createdAt,
            updatedAt: productsTable.updatedAt,
        }).from(productsTable).where(eq(productsTable.id, id))

        if (!product) {
            return res.status(404).json({ error: "product not found" })
        }
        return res.status(200).json({ success: true, data: product })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        })
    }
}



export const createProduct = async (req, res) => {
    const { category_id, name, slug, description, brand, sku, price, discount_price, stock, thumbnail, is_active } = req.body
    try {

        const [existingSku] = await db
            .select({ id: productsTable.id })
            .from(productsTable)
            .where(eq(productsTable.sku, sku));

        if (existingSku) {
            return res.status(409).json({
                success: false,
                error: "SKU already exists",
            });
        }
        const [existingCategory] = await db.select({ id: categoriesTable.id }).from(categoriesTable).where(eq(categoriesTable.id, category_id))
        if (!existingCategory) {
            return res.status(404).json({ success:false ,error: 'category not found' })
        }

        const [existingSlug] = await db.select({ id: productsTable.id }).from(productsTable).where(eq(productsTable.slug, slug))
        if (existingSlug) {
            return res.status(409).json({success:false, error: 'slug already exist' })
        }




        const [product] = await db.insert(productsTable).values({
            category_id,
            name,
            slug,
            description,
            brand,
            sku,
            price,
            discount_price,
            stock,
            thumbnail,
            is_active
        }).returning()

        return res.status(201).json({
            success: true,
            data: product
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        })
    }
}





export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
        category_id,
        name,
        slug,
        description,
        brand,
        sku,
        price,
        discount_price,
        stock,
        thumbnail,
        is_active,
    } = req.body;

    const updateData = {};

    if (category_id !== undefined) updateData.category_id = category_id;
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (brand !== undefined) updateData.brand = brand;
    if (sku !== undefined) updateData.sku = sku;
    if (price !== undefined) updateData.price = price;
    if (discount_price !== undefined) updateData.discount_price = discount_price;
    if (stock !== undefined) updateData.stock = stock;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (is_active !== undefined) updateData.is_active = is_active;

    try {
        if (category_id !== undefined) {
            const [existingCategory] = await db
                .select({ id: categoriesTable.id })
                .from(categoriesTable)
                .where(eq(categoriesTable.id, category_id));

            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    error: "Category not found",
                });
            }
        }

        if (slug !== undefined) {
            const [existingSlug] = await db
                .select({ id: productsTable.id })
                .from(productsTable)
                .where(eq(productsTable.slug, slug));

            if (existingSlug && existingSlug.id !== id) {
                return res.status(409).json({
                    success: false,
                    error: "Slug already exists",
                });
            }
        }

        if (sku !== undefined) {
            const [existingSku] = await db
                .select({ id: productsTable.id })
                .from(productsTable)
                .where(eq(productsTable.sku, sku));

            if (existingSku && existingSku.id !== id) {
                return res.status(409).json({
                    success: false,
                    error: "SKU already exists",
                });
            }
        }

        const [updatedProduct] = await db
            .update(productsTable)
            .set(updateData)
            .where(eq(productsTable.id, id))
            .returning();

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                error: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedProduct,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};


export const deleteProductById = async (req,res)=>{
    const {id} = req.params
    try{
        const [product] = await db.delete(productsTable).where(eq(productsTable.id,id)).returning()
        if(!product){
            return res.status(404).json({success:false, error: 'product not found' })
        }
        return res.status(200).json({success:true})
    }
    catch(error){
         return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}