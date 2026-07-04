import db from '../../db/index.js'
import { categoriesTable } from '../../db/schema/schema.js'
import { eq } from 'drizzle-orm';

export const allCategories = async (req, res) => {
    try {
        const categories = await db
            .select({
                id: categoriesTable.id,
                name: categoriesTable.name,
                slug: categoriesTable.slug,
                description: categoriesTable.description,
                image: categoriesTable.image,
                createdAt: categoriesTable.createdAt,
            })
            .from(categoriesTable);

        return res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};


export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const [category] = await db
            .select({
                id: categoriesTable.id,
                name: categoriesTable.name,
                slug: categoriesTable.slug,
                description: categoriesTable.description,
                image: categoriesTable.image,
                createdAt: categoriesTable.createdAt,
            })
            .from(categoriesTable)
            .where(eq(categoriesTable.id, id));

        if (!category) {
            return res.status(404).json({
                success: false,
                error: "Category not found",
            })
        }
        return res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};




export const createCategory = async (req, res) => {
    const { name, slug, description, image } = req.body
    try {

        const [existingCategory] = await db.select({ slug: categoriesTable.slug }).from(categoriesTable).where(eq(categoriesTable.slug, slug))

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                error: "Category already exists",
            });
        }

        const [newCategory] = await db.insert(categoriesTable).values({
            name,
            slug,
            description,
            image,
        }).returning({ id: categoriesTable.id })

        return res.status(201).json({
            success: true,
            id: newCategory.id,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};
export const updateCategoryById = async (req, res) => {
    const { id } = req.params
    const { name, slug, description, image } = req.body

    try {

        const [existingCategory] = await db.select({ slug: categoriesTable.slug, id: categoriesTable.id }).from(categoriesTable).where(eq(categoriesTable.slug, slug))

        if (existingCategory && existingCategory.id != id) {
            return res.status(409).json({
                success: false,
                error: "Category already exists",
            });
        }



        const [updateCategory] = await db.update(categoriesTable).set({
            name,
            slug,
            description,
            image,
        }).where(eq(categoriesTable.id, id)).returning({
            id: categoriesTable.id,
            name: categoriesTable.name,
            slug: categoriesTable.slug,
        })

        if (!updateCategory) {
            return res.status(404).json({
                success: false,
                error: "Category not found",
            });
        }

        return res.status(200).json({
            success: true,
            updated_data: updateCategory

        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

export const deleteCategoryById = async (req, res) => {
    const { id } = req.params
    try {
        const [deletedCategory] = await db
            .delete(categoriesTable)
            .where(eq(categoriesTable.id, id))
            .returning({
                id: categoriesTable.id,
            });
        if (!deletedCategory) {
            return res.status(404).json({ error: 'catogery not found' })
        }
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }

}