import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;
  const isCustomer = currentUser?.isCustomer;

  return (
    <aside className="w-64 bg-indigo-600 text-white h-screen p-4">
      <h2 className="text-xl font-semibold mb-8">Menu</h2>
      <nav className="space-y-4">
        {(isAdmin || isStaff) && (
          <Link href="/dashboard" className="block">
            Dashboard
          </Link>
        )}
        {isAdmin && (
          <Link href="/hrm" className="block">
            HRM
          </Link>
        )}
        {(isAdmin || isStaff) && (
          <Link href="/customers" className="block">
            Customers
          </Link>
        )}
        {(isAdmin || isStaff) && (
          <Link href="/products" className="block">
            Products
          </Link>
        )}
        {(isAdmin || isStaff || isCustomer) && (
          <Link href="/orders" className="block">
            {isCustomer ? "Make Orders" : " Orders"}
          </Link>
        )}
        {(isAdmin || isStaff || isCustomer) && (
          <Link href="/payements" className="block">
            Payments
          </Link>
        )}
        <Link href="/receipts" className="block">
          Receipts
        </Link>
        <hr className="my-4 border-gray-400" />
        <h2 className="text-xl font-semibold mb-4 text-slate-300">Reporting</h2>
        {(isAdmin || isStaff || isCustomer) && (
          <>
            <Link href="/orders/ordersReport" className="block">
              {isCustomer ? "My Orders Report" : " Orders Report"}
            </Link>
            <Link href="/payements/paymentsReport" className="block">
              {isCustomer ? "My Payements Report" : " Payements Report"}
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
