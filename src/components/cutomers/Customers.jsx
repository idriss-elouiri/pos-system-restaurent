"use client";

import React from "react";
import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle, HiPencilAlt } from "react-icons/hi";
import { FaTrash, FaRegUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CustomersComp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [customers, setCustomers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchCustomers = async () => {
        try {
          const res = await fetch(`${apiUrl}/api/user/getusers`, {
            method: "GET",
            credentials: "include", // يضمن إرسال الكوكيز مع الطلب
          });
          const data = await res.json();
          if (res.ok) {
            setCustomers(data.users);
            if (data.users.length < 9) {
              setShowMore(false);
            }
          } else {
            console.log(data.message); // طباعة أي رسالة خطأ
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchCustomers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = customers.length;
    try {
      const res = await fetch(
        `${apiUrl}/api/user/getusers?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setCustomers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/user/delete/${customerIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setCustomers((prev) =>
          prev.filter((customer) => customer._id !== customerIdToDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditClick = (id) => {
    router.push(`/customers/${id}/editCustomer`);
  };
  return (
    <div className="table-auto w-[90%] overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Link
        href={"/customers/newCustomer"}
        className="p-2 border-2 font-semibold my-3 border-green-600 rounded text-green-600 flex justify-center items-center w-fit"
      >
        <span>
          <FaRegUser />
        </span>
        +<p>add new customer</p>
      </Link>
      {currentUser.isAdmin && customers.length > 0 ? (
        <>
          <Table hoverable className="shadow-md text-center">
            <Table.Head className="bg-slate-200 h-14">
              <Table.HeadCell>CUSTOMER NUMBER</Table.HeadCell>
              <Table.HeadCell>NAME</Table.HeadCell>
              <Table.HeadCell>EMAIL</Table.HeadCell>
              <Table.HeadCell>ACTIONS</Table.HeadCell>
            </Table.Head>

            {customers.filter(customer => customer.isCustomer !== false)
              .map((customer) => (
                <Table.Body className="divide-y" key={customer._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 h-14 border">
                    <Table.Cell>{customer.number}</Table.Cell>
                    <Table.Cell>{customer.name}</Table.Cell>
                    <Table.Cell>{customer.email}</Table.Cell>
                    <Table.Cell className="flex text-center justify-center items-center gap-3 my-3">
                      <button
                        onClick={() => handleEditClick(customer._id)}
                        className="font-medium flex justify-center items-center gap-2 rounded bg-green-600 hover:underline cursor-pointe p-2 bg-red-500 text-white"
                      >
                        <span>
                          <HiPencilAlt />
                        </span>{" "}
                        Updated
                      </button>
                      <div
                        onClick={() => {
                          setShowModal(true);
                          setCustomerIdToDelete(customer._id);
                        }}
                        className="font-medium flex justify-center items-center gap-2 rounded  bg-red-600 hover:underline cursor-pointe p-2 bg-red-500 text-white"
                      >
                        <span>
                          <FaTrash />
                        </span>{" "}
                        Delete
                      </div>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no customers yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this customer?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteCustomer}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CustomersComp;
