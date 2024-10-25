// components/HeroSection.js

import React from 'react';

const HeroSection = ({totalCustomers, totalOrders, totalProducts }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
      <div className="bg-blue-500 p-6 text-white rounded-lg shadow-md text-center">
        <h2 className="text-lg font-semibold">Customers</h2>
        <p className="text-2xl">{totalCustomers}</p>
      </div>
      <div className="bg-green-500 p-6 text-white rounded-lg shadow-md text-center">
        <h2 className="text-lg font-semibold">Products</h2>
        <p className="text-2xl">{totalProducts}</p>
      </div>
      <div className="bg-purple-500 p-6 text-white rounded-lg shadow-md text-center">
        <h2 className="text-lg font-semibold">Sales</h2>
        <p className="text-2xl">0</p>
      </div>
      <div className="bg-red-500 p-6 text-white rounded-lg shadow-md text-center">
        <h2 className="text-lg font-semibold">Orders</h2>
        <p className="text-2xl">{totalOrders}</p>
      </div>
    </section>
  );
};

export default HeroSection;
