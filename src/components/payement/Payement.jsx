"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaPaypal, FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const Payement = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/order/getorders`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (res.ok) {
                    setOrders(data.orders);
                    setOrderDate(data.lastMonthorders)
                    if (data.orders.length < 9) {
                        setShowMore(false);
                    }
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchOrders();
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = orders.length;
        try {
            const res = await fetch(
                `${apiUrl}/api/order/getorders?startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setOrders((prev) => [...prev, ...data.orders]);
                if (data.orders.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteOrder = async () => {
        try {
            const res = await fetch(
                `${apiUrl}/api/order/deleteorder/${orderIdToDelete}`,
                {
                    method: "DELETE",
                }
            );
            const data = await res.json();
            if (res.ok) {
                setOrders((prev) =>
                    prev.filter((order) => order._id !== orderIdToDelete)
                );
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handlePayOrder = (id) => {
        router.push(`/payements/${id}/payementForm`);
    };

    return (
        <div className="p-4 max-w-full mx-auto">
            <Link
                href={"/orders/makeOrder"}
                className="p-2 border-2 font-semibold my-3 border-green-600 rounded text-green-600 flex justify-center items-center w-fit"
            >
                +<p>Add New Order</p>
            </Link>
            {currentUser.isAdmin && orders?.length > 0 ? (
                <>
                    <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left">CODE</th>
                                <th className="px-4 py-2 text-left">CUSTOMER</th>
                                <th className="px-4 py-2 text-left">PRODUCT</th>
                                <th className="px-4 py-2 text-left">TOTAL PRICE</th>
                                <th className="px-4 py-2 text-left">DATE</th>
                                <th className="px-4 py-2 text-left">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.map((order) => (
                                <tr key={order._id} className="bg-white">
                                    <td className="px-4 py-2">{order.orderCode}</td>
                                    <td className="px-4 py-2">{order.customerName}</td>
                                    <td className="px-4 py-2">{order.productName}</td>
                                    <td className="px-4 py-2">{order.productPrice}</td>
                                    <td className="px-4 py-2">{order.createdAt}</td>
                                    <td className="flex justify-center items-center gap-3 px-4 py-2">
                                        <button
                                            className="flex items-center gap-2 bg-green-600 text-white rounded px-3 py-1 hover:bg-green-700"
                                            onClick={() => handlePayOrder(order._id)}
                                        >
                                            <FaPaypal /> Pay Order
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowModal(true);
                                                setOrderIdToDelete(order._id);
                                            }}
                                            className="flex items-center gap-2 bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className="w-full text-teal-500 self-center text-sm py-4"
                        >
                            Show More
                        </button>
                    )}
                </>
            ) : (
                <p>You have no orders yet!</p>
            )}

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
                            <h3 className="mb-5 text-lg text-gray-500">
                                Are you sure you want to delete this order?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleDeleteOrder}
                                    className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700"
                                >
                                    Yes, I'm sure
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 text-black rounded px-4 py-2 hover:bg-gray-400"
                                >
                                    No, cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Payement;
