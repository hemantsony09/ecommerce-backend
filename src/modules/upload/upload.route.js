import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import { uploadImage } from "./upload.controller.js";

const uploadRoute = express.Router();

uploadRoute.post(
    "/",
    upload.single("image"),
    uploadImage
);

export default uploadRoute;