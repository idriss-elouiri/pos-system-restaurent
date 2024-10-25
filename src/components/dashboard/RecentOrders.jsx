// components/RecentOrders.js

import React from 'react';

const RecentOrders = ({ orders }) => {
  return (
    <section className="my-6 bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
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
                <td className="py-2 px-4">${order.productPrice}</td>
                <td className="py-2 px-4">{order.isPaid}</td>
                <td className="py-2 px-4">{order.lastMonthorders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">See All Orders</button>
    </section>
  );
};

export default RecentOrders;
