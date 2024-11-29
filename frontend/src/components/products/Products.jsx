"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle, HiPencilAlt } from "react-icons/hi";
import { FaTrash, FaRegUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Products = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchProducts = async () => {
        setLoading(true); // Start loading
        try {
          const res = await fetch(`${apiUrl}/api/product/getProducts`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            setProducts(data.products);
            setShowMore(data.products.length >= 9);
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false); // Stop loading
        }
      };
      fetchProducts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = products.length;
    setLoading(true); // Start loading
    try {
      const res = await fetch(
        `${apiUrl}/api/product/getProducts?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => [...prev, ...data.products]);
        setShowMore(data.products.length >= 9);
      }
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/product/deleteproduct/${productIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
        setShowModal(false);
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = (id) => {
    router.push(`/products/${id}/editProduct`);
  };

  if (loading) {
    return <div className="text-center">تحميل البضاعة...</div>; // Loading state UI
  }

  return (
    <div className="p-4 sm:p-8 w-full max-w-4xl mx-auto">
      <Link
        href="/products/newProduct"
        className="mb-4 inline-flex items-center px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white"
      >
        <FaRegUser className="mr-2" />
       اضافة بضاعة جديدة
      </Link>

      {isAdmin || isStaff ? (
        <>
          <div className="overflow-auto">
            <table className="min-w-full text-sm bg-white border border-gray-200 shadow rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">صورة البضاعة</th>
                  <th className="px-4 py-2 text-left">كود</th>
                  <th className="px-4 py-2 text-left">اسم البضاعة</th>
                  <th className="px-4 py-2 text-left">سعر البضاعة</th>
                  <th className="px-4 py-2 text-center">الحركات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="w-20 h-12 object-cover bg-gray-200 rounded-md"
                      />
                    </td>
                    <td className="px-4 py-3">{product.productCode}</td>
                    <td className="px-4 py-3">{product.productName}</td>
                    <td className="px-4 py-3">{product.productPrice}</td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(product._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                      >
                        <HiPencilAlt className="mr-1" />
                        تعديل
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setProductIdToDelete(product._id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center"
                      >
                        <FaTrash className="mr-1" />
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="mt-4 w-full py-2 text-teal-500"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No products available!</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 max-w-md w-full">
            <HiOutlineExclamationCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg text-center text-gray-700">
              Are you sure you want to delete this product?
            </h3>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, I'm sure
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
