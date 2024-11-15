"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PrintComp = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getOrder = async () => {
        try {
          const res = await fetch(`${apiUrl}/api/order/${id}`);
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch Order data");
          }

          setOrder(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      if (id) {
        getOrder();
      }
    }
  }, [id]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-white">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Order Receipt
        </h1>

        {loading && <p className="text-center text-gray-700">Loading...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        {order && (
          <>
            <div className="mb-6">
              <p className="text-center text-gray-700">
                Order Code: {order?.orderCode}
              </p>
            </div>
            <div>
              <table className="w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 border-b">Item</th>
                    <th className="text-left p-2 border-b">Qty</th>
                    <th className="text-left p-2 border-b">Price</th>
                    <th className="text-left p-2 border-b">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={id} className="border-b">
                    <td className="p-2">{order?.customerName}</td>
                    <td className="p-2">{order?.productQty}</td>
                    <td className="p-2">${order?.productPrice}</td>
                    <td className="p-2">
                      ${(order?.productQty * order?.productPrice).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-6 font-semibold text-lg">
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
              >
                Print Receipt
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrintComp;
