"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaRegUser, FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

const Orders = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/product/getProducts`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
          if (data.products.length < 9) {
            setShowMore(false);
          }
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleShowMore = async () => {
    const startIndex = products.length;
    try {
      const res = await fetch(
        `${apiUrl}/api/product/getProducts?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => [...prev, ...data.products]);
        if (data.products.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePlaceOrder = (id) => {
    router.push(`/orders/${id}/orderForm`);
  };

  return (
    <div className="w-full p-3 max-w-4xl mx-auto overflow-x-auto">
      {currentUser.isAdmin && products.length > 0 ? (
        <>
          <table className="w-full border-collapse shadow-lg text-center">
            <thead className="bg-gray-200">
              <tr className="text-gray-700">
                <th className="px-4 py-2 border">IMAGE</th>
                <th className="px-4 py-2 border">PRODUCT CODE</th>
                <th className="px-4 py-2 border">NAME</th>
                <th className="px-4 py-2 border">PRICE</th>
                <th className="px-4 py-2 border">ACTIONS</th>
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
                  <td className="px-4 py-2 border">${product.productPrice}</td>
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
          {showMore && (
            <button
              onClick={handleShowMore}
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
