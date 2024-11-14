import React from "react";
import {
  FaBoxOpen,
  FaChartLine,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";

const HeroSection = ({
  totalCustomers,
  totalOrders,
  totalProducts,
  totalSales,
  isAdmin,
  isStaff,
}) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
      {(isAdmin || isStaff) && (
        <>
          <div className="bg-blue-500 p-6 text-white rounded-lg shadow-md text-center">
            <i className="text-3xl mb-2">
              <FaUser />
            </i>
            <h2 className="text-lg font-semibold">Customers</h2>
            <p className="text-2xl">{totalCustomers}</p>
          </div>
          <div className="bg-green-500 p-6 text-white rounded-lg shadow-md text-center">
            <i className="text-3xl mb-2">
              <FaBoxOpen />
            </i>
            <h2 className="text-lg font-semibold">Products</h2>
            <p className="text-2xl">{totalProducts}</p>
          </div>
          <div className="bg-red-500 p-6 text-white rounded-lg shadow-md text-center">
            <i className="text-3xl mb-2">
              <FaClipboardList />
            </i>
            <h2 className="text-lg font-semibold">Orders</h2>
            <p className="text-2xl">{totalOrders}</p>
          </div>
          <div className="bg-purple-500 p-6 text-white rounded-lg shadow-md text-center">
            <i className="text-3xl mb-2">
              <FaChartLine />
            </i>

            <h2 className="text-lg font-semibold">Sales</h2>
            <p className="text-2xl">{totalSales}</p>
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;
