// components/RecentOrders.js

import React from "react";

const RecentOrders = ({
  orders,
  handleShowMore,
  showMore,
  ordersCustomer,
  isAdmin,
  isStaff,
  isCustomer,
}) => {
  return (
    <section className="my-6 bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center w-full h-full">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {showMore && (
          <button
            onClick={handleShowMore}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            See All Orders
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        {(isAdmin || isStaff) && (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">Code</th>
                <th className="py-2 px-4">Customer</th>
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Qty</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-2 px-4">{order.orderCode}</td>
                  <td className="py-2 px-4">{order.customerName}</td>
                  <td className="py-2 px-4">{order.productName}</td>
                  <td className="py-2 px-4">${order.productPrice}</td>
                  <td className="py-2 px-4">{order.productQty}</td>
                  <td className="py-2 px-4">
                    ${(order?.productQty * order?.productPrice).toFixed(2)}
                  </td>
                  <td className="py-2 px-4">
                    {order.isPaid ? (
                      <span className="p-2 rounded bg-green-500 text-white">
                        Paid
                      </span>
                    ) : (
                      <span className="p-2 rounded bg-red-500 text-white">
                        Not Paid
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4">{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {isCustomer && (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">Code</th>
                <th className="py-2 px-4">Customer</th>
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Qty</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {ordersCustomer?.map((orderCustomer) => (
                <tr key={orderCustomer._id}>
                  <td className="py-2 px-4">{orderCustomer.orderCode}</td>
                  <td className="py-2 px-4">{orderCustomer.customerName}</td>
                  <td className="py-2 px-4">{orderCustomer.productName}</td>
                  <td className="py-2 px-4">${orderCustomer.productPrice}</td>
                  <td className="py-2 px-4">{orderCustomer.productQty}</td>
                  <td className="py-2 px-4">${orderCustomer.productPrice}</td>
                  <td className="py-2 px-4">
                    {orderCustomer.isPaid ? (
                      <span className="p-2 rounded bg-green-500 text-white">
                        Paid
                      </span>
                    ) : (
                      <span className="p-2 rounded bg-red-500 text-white">
                        Not Paid
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4">{orderCustomer.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default RecentOrders;
