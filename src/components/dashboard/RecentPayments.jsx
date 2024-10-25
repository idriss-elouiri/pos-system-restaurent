// components/RecentPayments.js

import React from 'react';

const RecentPayments = ({ payments }) => {
  return (
    <section className="my-6 bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Code</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Order Code</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="py-2 px-4">{payment.paymentCode}</td>
                <td className="py-2 px-4">${payment.amount}</td>
                <td className="py-2 px-4">{payment.orderCode}</td>
                <td className="py-2 px-4">{payment.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentPayments;
