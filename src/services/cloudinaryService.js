const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer, folder = "chat-app") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

const deleteFromCloudinary = (
  publicId,
  resourceType = "image"
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
        invalidate: true,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (result?.result !== "ok" && result?.result !== "not found") {
          return reject(
            new Error("Cloudinary asset deletion failed")
          );
        }

        resolve(result);
      }
    );
  });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};