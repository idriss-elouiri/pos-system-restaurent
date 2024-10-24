"use client";

import React from "react";
import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle, HiPencilAlt } from "react-icons/hi";
import { FaTrash, FaRegUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Hrm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [staffs, setStaffs] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [staffIdToDelete, setStaffIdToDelete] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchStaffs = async () => {
        try {
          const res = await fetch(`${apiUrl}/api/hrm/getStaffs`, {
            method: "GET",
            credentials: "include", 
          });
          const data = await res.json();
          if (res.ok) {
            setStaffs(data.Staffs);
            if (data.Staffs.length < 9) {
              setShowMore(false);
            }
          } else {
            console.log(data.message); 
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchStaffs();
    }
  }, [currentUser._id]);

  console.log(staffs);
  const handleShowMore = async () => {
    const startIndex = staffs.length;
    try {
      const res = await fetch(
        `${apiUrl}/api/hrm/getStaffs?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setStaffs((prev) => [...prev, ...data.Staffs]);
        if (data.Staffs.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteStaff = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/hrm/deleteStaff/${staffIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setStaffs((prev) =>
          prev.filter((staff) => staff._id !== staffIdToDelete)
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
    router.push(`/hrm/${id}/editStaff`);
  };
  return (
    <div className="table-auto w-[90%] overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Link
        href={"/hrm/newStaff"}
        className="p-2 border-2 font-semibold my-3 border-green-600 rounded text-green-600 flex justify-center items-center w-fit"
      >
        <span>
          <FaRegUser />
        </span>
        +<p>add new Staff</p>
      </Link>
      {currentUser.isAdmin && staffs?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md text-center">
            <Table.Head className="bg-slate-200 h-14">
              <Table.HeadCell>STAFF NUMBER</Table.HeadCell>
              <Table.HeadCell>NAME</Table.HeadCell>
              <Table.HeadCell>EMAIL</Table.HeadCell>
              <Table.HeadCell>ACTIONS</Table.HeadCell>
            </Table.Head>

            {staffs.map((staff) => (
              <Table.Body className="divide-y" key={staff._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 h-14 border">
                  <Table.Cell>{staff.numberStaff}</Table.Cell>
                  <Table.Cell>{staff.nameStaff}</Table.Cell>
                  <Table.Cell>{staff.emailStaff}</Table.Cell>
                  <Table.Cell className="flex text-center justify-center items-center gap-3 my-3">
                    <button
                      onClick={() => handleEditClick(staff._id)}
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
                        setStaffIdToDelete(staff._id);
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
        <p>You have no staffss yet!</p>
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
              Are you sure you want to delete this staff?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteStaff}>
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

export default Hrm;
