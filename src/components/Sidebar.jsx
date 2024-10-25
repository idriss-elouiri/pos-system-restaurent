// components/Sidebar.js

import Link from 'next/link';
import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-indigo-600 text-white h-screen p-4">
      <h2 className="text-xl font-semibold mb-8">Menu</h2>
      <nav className="space-y-4">
        <Link href="/dashboard" className="block">Dashboard</Link>
        <Link href="/hrm" className="block">HRM</Link>
        <Link href="/customers" className="block">Customers</Link>
        <Link href="/products" className="block">Products</Link>
        <Link href="/orders" className="block">Orders</Link>
        <Link href="/payements" className="block">Payments</Link>
        <Link href="/receipts" className="block">Receipts</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
