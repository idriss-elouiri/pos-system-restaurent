import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaClipboardList, FaMoneyCheckAlt, FaReceipt, FaUtensils } from "react-icons/fa";
import { MdPeople } from "react-icons/md"; // HRM Icon

const Sidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;
  const isCustomer = currentUser?.isCustomer;

  return (
    <aside className="w-64 bg-indigo-600 text-white min-h-min	 p-4">
      <div className="flex items-center mb-8 gap-2">
      <h2 className="text-xl font-semibold ">System Restaurent</h2>
      <i className="p-2 bg-orange-600 rounded"><FaUtensils/></i>
      </div>
      <nav className="space-y-4">
        {(isAdmin || isStaff || isCustomer) && (
          <Link href="/dashboard" className="flex items-center block p-2 rounded hover:bg-indigo-700">
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </Link>
        )}
        {isAdmin && (
          <Link href="/hrm" className="flex items-center block p-2 rounded hover:bg-indigo-700">
            <MdPeople className="mr-2" />
            HRM
          </Link>
        )}
        {(isAdmin || isStaff) && (
          <Link href="/customers" className="flex items-center block p-2 rounded hover:bg-indigo-700">
            <FaUsers className="mr-2" />
            Customers
          </Link>
        )}
        {(isAdmin || isStaff) && (
          <Link href="/products" className="flex items-center block p-2 rounded hover:bg-indigo-700">
            <FaBoxOpen className="mr-2" />
            Products
          </Link>
        )}
        {(isAdmin || isStaff || isCustomer) && (
          <Link href="/orders" className="flex items-center block p-2 rounded hover:bg-indigo-700">
            <FaClipboardList className="mr-2" />
            {isCustomer ? "Make Orders" : "Orders"}
          </Link>
        )}
        {(isAdmin || isStaff || isCustomer) && (
          <Link href="/payements" className="flex items-center block p-2 rounded hover:bg-indigo-700">
            <FaMoneyCheckAlt className="mr-2" />
            Payments
          </Link>
        )}
        <Link href="/receipts" className="flex items-center block p-2 rounded hover:bg-indigo-700">
          <FaReceipt className="mr-2" />
          Receipts
        </Link>
        <hr className="my-4 border-gray-400" />
        <h2 className="text-xl font-semibold mb-4 text-slate-300">Reporting</h2>
        {(isAdmin || isStaff || isCustomer) && (
          <>
            <Link href="/payements/paymentsReport" className="flex items-center block p-2 rounded hover:bg-indigo-700">
              <FaMoneyCheckAlt className="mr-2" />
              {isCustomer ? "My Payments Report" : "Payments Report"}
            </Link>
            <Link href="/orders/ordersReport" className="flex items-center block p-2 rounded hover:bg-indigo-700">
              <FaClipboardList className="mr-2" />
              {isCustomer ? "My Orders Report" : "Orders Report"}
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
