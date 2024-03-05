import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
});

const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath); //remove the locally saved temporary
    return res;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved temporary files as the file upload failed
  }
};

const deleteMediafromCloudinary = async (pub_url) => {
  try {
    if (!pub_url) {
      throw new Error("media url is required");
    }
    const media = await cloudinary.search
      .execute()
      .then((result) => result.resources.filter((res) => res.url === pub_url))
      .catch((err) => console.log(err));
    const { public_id } = media[0];
    const response = await cloudinary.api
      .delete_resources(public_id, { invalidate: true })
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
    return { pub_url, response };
  } catch (error) {
    throw new ApiError(500, "Failed to delete media on cloudinary");
  }
};

export { uploadToCloudinary, deleteMediafromCloudinary };
