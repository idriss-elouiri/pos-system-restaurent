"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.js";

const FormProduct = ({
  _id,
  productName: existingName,
  productCode: existingCode,
  productImage: existingImage,
  productPrice: existingPrice,
  productDescription: existingDescription,
  productQty: existingProductQty,
}) => {
  const [formData, setFormData] = useState({
    productName: existingName || "",
    productCode: existingCode || `PRD-${Date.now().toString().slice(-6)}`,
    productImage: existingImage || "",
    productPrice: existingPrice || "",
    productDescription: existingDescription || "",
    productQty: existingProductQty || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(existingImage || null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(typeof formData.productPrice);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeMB = 2; // Set max size to 2MB
      if (file.size > maxSizeMB * 1024 * 1024) {
        setImageFileUploadError(`File must be less than ${maxSizeMB}MB`);
        return;
      }
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
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, productImage: downloadURL }));
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

    // Optionally reset the form state here
    setFormData({
      productName: "",
      productCode: "",
      productImage: "",
      productPrice: "",
      productDescription: "",
      productQty: "",
    });
    router.push("/products");
  };

  return (
    <div className="max-w-3xl mx-auto min-h-screen px-4 py-6">
      <h1 className="text-center text-2xl md:text-3xl my-5 font-semibold">
        انشاء بضاعة جديدة
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label htmlFor="productName" className="sr-only">
          اسم البضاعة
        </label>
        <input
          type="text"
          placeholder="اسم البضاعة"
          required
          id="productName"
          className="border border-gray-300 p-2 rounded w-full"
          onChange={handleInputChange}
          value={formData.productName}
        />
        <label htmlFor="productCode" className="sr-only">
          كود البضاعة
        </label>
        <input
          type="text"
          placeholder="كود البضاعة"
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
            disabled={imageFileUploadProgress !== null}
            className="p-2 bg-green-600 text-white rounded"
          >
            {imageFileUploadProgress ? "تحميل..." : "حمل الصورة"}
          </button>
        </div>
        {formData.productImage && (
          <img
            src={formData.productImage}
            alt="Product Preview"
            className="w-40 h-40 mt-2"
          />
        )}
        {imageFileUploadError && (
          <p className="text-red-500">{imageFileUploadError}</p>
        )}
        <label htmlFor="productDescription" className="sr-only">
          وصف البضاعة
        </label>
        <textarea
          placeholder="وصف البضاعة"
          id="productDescription"
          onChange={handleInputChange}
          value={formData.productDescription}
          className="border border-gray-300 p-2 rounded w-full"
        />
        <label htmlFor="productPrice" className="sr-only">
          السعر 
        </label>
        <input
          type="text"
          placeholder="السعر"
          required
          id="productPrice"
          className="border border-gray-300 p-2 rounded w-full"
          onChange={handleInputChange}
          value={formData.productPrice}
          min="0"
        />
        <label htmlFor="productPrice" className="sr-only">
          اجمالي البضاعة
        </label>
        <input
          type="text"
          placeholder="اجمالي البضاعة"
          required
          id="productQty"
          className="border border-gray-300 p-2 rounded w-full"
          onChange={handleInputChange}
          value={formData.productQty}
          min="1"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-green-600 text-white rounded"
        >
          {loading ? "يتم النشر..." : "نشر"}
        </button>
      </form>
    </div>
  );
};

export default FormProduct;
