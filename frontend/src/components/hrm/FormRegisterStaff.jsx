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
import { HiOutlineUserAdd } from "react-icons/hi";

const FormRegisterStaff = ({
  _id,
  profilePictureStaff: existingProfilePictureStaff,
  nameStaff: existingName,
  numberStaff: existingNumber,
  passwordStaff: existingPassword,
  isStaff: existingIsStaff,
}) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    profilePictureStaff:
      existingProfilePictureStaff ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    nameStaff: existingName || "",
    passwordStaff: existingPassword || "",
    numberStaff: existingNumber || `STF-${Date.now().toString().slice(-6)}`,
    isStaff: existingIsStaff || false,
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
          setFormData({ ...formData, profilePictureStaff: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  const handleInputChange = (e) => {
    const { id, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "isStaff" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.passwordStaff.length < 6) {
      setErrorMessage("كلمة المرور يجب أن تكون أكثر من 6 أحرف");
      setLoading(false); // Reset loading state
      return; // Exit early
    }
    const url = _id
      ? `${apiUrl}/api/user/adminUpdateStaff/${_id}`
      : `${apiUrl}/api/hrm/registerStaff`;

    try {
      const res = await fetch(url, {
        method: _id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "An error occurred");
      } else {
        // Optionally display success message here
        router.push("/hrm");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <h2 className="flex items-center gap-2 justify-center text-2xl font-semibold text-indigo-700 mb-6">
          <HiOutlineUserAdd />
          {_id ? "Edit Staff" : "Register Staff"}
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
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
                src={imageFileUrl || formData.profilePictureStaff}
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
          {/* Number Field */}
          <div>
            <label
              htmlFor="numberStaff"
              className="block text-sm font-medium text-gray-700"
            >
              رقم الموظف
            </label>
            <input
              type="text"
              id="numberStaff"
              value={formData.numberStaff}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>
          {/* Name Field */}
          <div>
            <label
              htmlFor="nameStaff"
              className="block text-sm font-medium text-gray-700"
            >
              اسم الموظف <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nameStaff"
              value={formData.nameStaff}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter staff name"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="passwordStaff"
              className="block text-sm font-medium text-gray-700"
            >
              كلمة السر <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="passwordStaff"
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter password"
            />
          </div>

          {/* Checkbox Field */}
          <div className="flex items-center gap-2">
            <input
              id="isStaff"
              type="checkbox"
              checked={formData.isStaff}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <label
              htmlFor="isStaff"
              className="text-sm font-medium text-gray-700"
            >
              Is Staff
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Submitting..." : _id ? "Edit Staff" : "Add Staff"}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="mt-4 text-sm text-red-600 text-center">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormRegisterStaff;
