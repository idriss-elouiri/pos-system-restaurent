// Orders.js
"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";

const Orders = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchProducts = async () => {
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
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [apiUrl]);

  const handleShowMore = async () => {
    const startIndex = products.length;
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
    }
  };

  const handlePlaceOrder = (id) => {
    router.push(`/orders/${id}/orderForm`);
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner if desired
  }

  return (
    <div className="w-full p-3 max-w-4xl mx-auto overflow-x-auto">
      {currentUser?.isAdmin ||
      currentUser?.isStaff ||
      currentUser?.isCustomer ? (
        <>
          {products.length > 0 ? (
            <table className="w-full border-collapse shadow-lg text-center">
              <thead className="bg-gray-200">
                <tr className="text-gray-700">
                  <th scope="col" className="px-4 py-2 border">
                    IMAGE
                  </th>
                  <th scope="col" className="px-4 py-2 border">
                    PRODUCT CODE
                  </th>
                  <th scope="col" className="px-4 py-2 border">
                    NAME
                  </th>
                  <th scope="col" className="px-4 py-2 border">
                    PRICE
                  </th>
                  <th scope="col" className="px-4 py-2 border">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="bg-white hover:bg-gray-100 border-b"
                  >
                    <td className="px-4 py-2 border">
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="w-16 h-10 object-cover mx-auto"
                      />
                    </td>
                    <td className="px-4 py-2 border">{product.productCode}</td>
                    <td className="px-4 py-2 border">{product.productName}</td>
                    <td className="px-4 py-2 border">
                      ${product.productPrice}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handlePlaceOrder(product._id)}
                        className="flex justify-center items-center gap-2 bg-orange-600 text-white rounded py-1 px-3 hover:bg-orange-700"
                      >
                        <FaShoppingCart />
                        <span>Place Order</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No products available.</p>
          )}
          {showMore && (
            <button
              onClick={handleShowMore}
              disabled={!showMore}
              className="block mx-auto mt-5 text-teal-500"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className="text-center">You have no products yet!</p>
      )}
    </div>
  );
};

export default Orders;
