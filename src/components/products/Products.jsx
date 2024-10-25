"use client";

import React from "react";
import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle, HiPencilAlt } from "react-icons/hi";
import { FaTrash, FaRegUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Products = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchProducts = async () => {
        try {
          const res = await fetch(`${apiUrl}/api/product/getProducts`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            setProducts(data.products);
            if (data.products.length < 9) {
              setShowMore(false);
            }
          } else {
            console.log(data.message);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchProducts();
    }
  }, [currentUser._id]);
  console.log(products);
  const handleShowMore = async () => {
    const startIndex = products.length;
    try {
      const res = await fetch(
        `${apiUrl}/api/product/getProducts?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => [...prev, ...data.products]);
        if (data.products.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteproduct = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/product/deleteproduct/${productIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
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
    router.push(`/products/${id}/editProduct`);
  };
  return (
    <div className="table-auto w-[90%] overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Link
        href={"/products/newProduct"}
        className="p-2 border-2 font-semibold my-3 border-green-600 rounded text-green-600 flex justify-center items-center w-fit"
      >
        <span>
          <FaRegUser />
        </span>
        +<p>add new product</p>
      </Link>
      {currentUser.isAdmin && products?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md text-center">
            <Table.Head className="bg-slate-200 h-14">
              <Table.HeadCell>IMAGE</Table.HeadCell>
              <Table.HeadCell>PRODUCT CODE</Table.HeadCell>
              <Table.HeadCell>NAME</Table.HeadCell>
              <Table.HeadCell>PRICE</Table.HeadCell>
              <Table.HeadCell>ACTIONS</Table.HeadCell>
            </Table.Head>

            {products.map((product) => (
              <Table.Body className="divide-y" key={product._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 h-14 border">
                  <Table.Cell>
                    {" "}
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell>{product.productCode}</Table.Cell>
                  <Table.Cell>{product.productName}</Table.Cell>
                  <Table.Cell>{product.productPrice}</Table.Cell>
                  <Table.Cell className="flex text-center justify-center items-center gap-3 my-3">
                    <button
                      onClick={() => handleEditClick(product._id)}
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
                        setProductIdToDelete(product._id);
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
        <p>You have no Productss yet!</p>
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
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteproduct}>
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

export default Products;
