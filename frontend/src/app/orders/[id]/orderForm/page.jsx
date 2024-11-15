"use client";

import Layout from "@/components/Layout";
import OrderForm from "@/components/orders/OrderForm";
import React from "react";

export default function placeOrder() {
  return (
    <Layout>
      <OrderForm />
    </Layout>
  );
}
