"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, FileInput, Textarea, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
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
}) => {
  const generateProductCode = () => {
    const now = new Date();
    return `FC-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${now
      .getTime()
      .toString()
      .slice(-4)}`;
  };

  const productCode = generateProductCode();
  const [formData, setFormData] = useState({
    productName: existingName || "",
    productCode: existingCode || productCode,
    productImage: existingImage || "",
    productPrice: existingPrice || 0,
    productDescription: existingDescription || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(existingImage || null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
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
    setImageFileUploading(true);
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
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, productImage: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  console.log(formData);
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
      setErrorMessage(data.message || "An error occurred");
      setLoading(false);
      return;
    }
    router.push("/products");
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create a product
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Name Product"
            required
            id="productName"
            className="flex-1"
            onChange={handleInputChange}
            value={formData.productName}
          />
        </div>
        <TextInput
          placeholder="product Code"
          id="productCode"
          defaultValue={formData.productCode}
        />

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            id="productImage"
            onChange={handleImageChange}
          />
          <Button
            type="button"
            size="sm"
            outline
            onClick={uploadImage}
            disabled={imageFileUploadProgress}
            className="p-2 bg-green-600 rounded"
          >
            {imageFileUploadProgress ? "uploading Image ..." : "Upload Image"}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
    
          <img src={imageFileUrl} />
        <Textarea
          placeholder="product Description"
          id="productDescription"
          onChange={handleInputChange}
          value={formData.productDescription}
        />

        <TextInput
          type="number"
          placeholder="Price"
          required
          id="productPrice"
          className="flex-1"
          onChange={handleInputChange}
          value={formData.productPrice}
        />
        <Button type="submit" className="p-2 bg-green-600 rounded">
          Publish
        </Button>
        {errorMessage && (
          <Alert className="mt-5" color="failure">
            {errorMessage}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default FormProduct;
