import cloudinary from "../../config/cloudinary.js";

export const uploadImage = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Image is required",
            });
        }

        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "ecommerce",
            }
        );

        return res.status(200).json({
            success: true,
            data: {
                image_url: result.secure_url,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};