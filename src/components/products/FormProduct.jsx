"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase.js";

const FormProduct = ({
  _id,
  productName: existingName,
  productCode: existingCode,
  productImage: existingImage,
  productPrice: existingPrice,
  productDescription: existingDescription,
}) => {
  const [formData, setFormData] = useState({
    productName: existingName || "",
    productCode: existingCode || `PRD-${Date.now().toString().slice(-6)}`,
    productImage: existingImage || "",
    productPrice: existingPrice || 0,
    productDescription: existingDescription || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(existingImage || null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image (File must be less than 2MB)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, productImage: downloadURL });
          setImageFileUploadProgress(null);
        });
      }
    );
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = _id
      ? `${apiUrl}/api/product/updateProduct/${_id}`
      : `${apiUrl}/api/product/create`;

    const res = await fetch(url, {
      method: _id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      return;
    }
    router.push("/products");
  };

  return (
    <div className="max-w-3xl mx-auto min-h-screen px-4 py-6">
      <h1 className="text-center text-2xl md:text-3xl my-5 font-semibold">Create a Product</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          required
          id="productName"
          className="border border-gray-300 p-2 rounded w-full"
          onChange={handleInputChange}
          value={formData.productName}
        />
        <input
          type="text"
          placeholder="Product Code"
          id="productCode"
          readOnly
          className="border border-gray-300 p-2 rounded w-full"
          value={formData.productCode}
        />
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="file"
            accept="image/*"
            id="productImage"
            onChange={handleImageChange}
            className="w-full md:w-auto"
          />
          <button
            type="button"
            onClick={uploadImage}
            disabled={imageFileUploadProgress}
            className="p-2 bg-green-600 text-white rounded"
          >
            {imageFileUploadProgress ? "Uploading..." : "Upload Image"}
          </button>
        </div>
        {imageFileUrl && <img src={imageFileUrl} alt="Product Preview" className="w-40 h-40 mt-2" />}
        {imageFileUploadError && <p className="text-red-500">{imageFileUploadError}</p>}
        <textarea
          placeholder="Product Description"
          id="productDescription"
          onChange={handleInputChange}
          value={formData.productDescription}
          className="border border-gray-300 p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Price"
          required
          id="productPrice"
          className="border border-gray-300 p-2 rounded w-full"
          onChange={handleInputChange}
          value={formData.productPrice}
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-green-600 text-white rounded"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
};

export default FormProduct;
