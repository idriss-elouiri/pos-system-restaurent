"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const FormRegisterCustomer = ({
  _id,
  profilePictureCustomer: existingProfilePictureCustomer,
  nameCustomer: existingName,
  address: existingAddress,
  contact: existingContact,
}) => {
  const { currentUser } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // New success message state
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    profilePictureCustomer:
      existingProfilePictureCustomer ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    nameCustomer: existingName || "",
    address: existingAddress || "",
    contact: existingContact || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const filePickerRef = useRef();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    if (typeof window === "undefined") return; // Prevent SSR issues

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
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePictureCustomer: downloadURL });
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

    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage(null); // Reset success message
    const url = _id
      ? currentUser.isAdmin
        ? `${apiUrl}/api/user/adminUpdateCustomer/${_id}`
        : currentUser.isStaff
        ? `${apiUrl}/api/hrm/staffUpdateCustomer/${_id}`
        : null
      : `${apiUrl}/api/customer/registerCustomer`;

    try {
      const res = await fetch(url, {
        method: _id ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "An error occurred");

      setSuccessMessage(
        _id
          ? "Customer updated successfully!"
          : "Customer registered successfully!"
      );
      setTimeout(() => {
        router.push("/customers");
      }, 2000); // Redirect after a short delay
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {_id ? "تعديل العميل" : "اضافة عميل جديد"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="flex justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={filePickerRef}
              hidden
            />
            <div
              className="relative w-24 h-24 cursor-pointer shadow-md overflow-hidden rounded-full"
              onClick={() => filePickerRef.current.click()}
            >
              {imageFileUploadProgress && (
                <CircularProgressbar
                  value={imageFileUploadProgress || 0}
                  text={`${imageFileUploadProgress}%`}
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                    },
                    path: {
                      stroke: `rgba(62, 152, 199, ${
                        imageFileUploadProgress / 100
                      })`,
                    },
                  }}
                />
              )}
              <img
                src={imageFileUrl || formData.profilePictureCustomer}
                alt="Employé"
                className={`w-32 h-32 rounded-full w-full h-full object-cover border-4 border-gray-300 ${
                  imageFileUploadProgress &&
                  imageFileUploadProgress < 100 &&
                  "opacity-60"
                }`}
              />
            </div>
          </div>
          {imageFileUploadError && (
            <p className="text-red-500 text-sm text-center mt-2">
              {imageFileUploadError}
            </p>
          )}

          {/* Name Field */}
          <div className="flex flex-col">
            <label
              htmlFor="nameCustomer"
              className="text-sm font-medium text-gray-700"
            >
              اسم العميل
            </label>
            <input
              type="text"
              id="nameCustomer"
              value={formData.nameCustomer}
              onChange={handleInputChange}
              className="p-3 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., John Doe"
              required // Make the field required
            />
          </div>

          {/* address Field */}
          <div className="flex flex-col">
            <label
              htmlFor="emailCustomer"
              className="text-sm font-medium text-gray-700"
            >
              عنوان موقع العميل
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              className="p-3 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="عنوان الموقع"
              required // Make the field required
            />
          </div>

          {/* Phone Number Field */}
          <div className="flex flex-col">
            <label
              htmlFor="phoneNumberCustomer"
              className="text-sm font-medium text-gray-700"
            >
              رقم هاتف العميل
            </label>
            <input
              type="text"
              id="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="p-3 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 123-456-7890"
              required // Make the field required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Processing..." : _id ? "عدل معلمومات العميل" : "اضف العميل"}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <p className="mt-2 text-sm text-center text-red-600">
              {errorMessage}
            </p>
          )}

          {/* Success Message */}
          {successMessage && (
            <p className="mt-2 text-sm text-center text-green-600">
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormRegisterCustomer;
