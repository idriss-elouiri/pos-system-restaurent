"use client";

import React, { useEffect, useState } from "react";
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
            setStaffs(data.staffs);
            setShowMore(data.staffs.length >= 9);
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error(error.message);
        }
      };
      fetchStaffs();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = staffs.length;
    try {
      const res = await fetch(
        `${apiUrl}/api/hrm/getStaffs?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setStaffs((prev) => [...prev, ...data.staffs]);
        setShowMore(data.staffs.length >= 9);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteStaff = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/user/adminDeleteStaff/${staffIdToDelete}`,
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
        console.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditClick = (id) => {
    router.push(`/hrm/${id}/editStaff`);
  };
  
  return (
    <div className="w-[90%] mx-auto p-4 overflow-x-auto">
      <div className="flex justify-between items-center w-full h-full">
        <Link
          href="/hrm/newStaff"
          className="flex items-center gap-2 p-2 border-2 font-semibold border-green-600 rounded text-green-600 mb-4"
        >
          <FaRegUser />
          <span>Add New Staff</span>
        </Link>
        {showMore && (
          <button
            onClick={handleShowMore}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Load More Staff
          </button>
        )}
      </div>

      {currentUser.isAdmin && staffs?.length > 0 ? (
        <table className="min-w-full bg-white text-center shadow-md rounded-lg">
          <thead className="bg-slate-200 h-14">
            <tr>
              <th className="p-4">STAFF NUMBER</th>
              <th className="p-4">NAME</th>
              <th className="p-4">EMAIL</th>
              <th className="p-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {staffs.map((staff) => (
              <tr key={staff._id} className="border">
                <td className="p-4">{staff.numberStaff}</td>
                <td className="p-4">{staff.nameStaff}</td>
                <td className="p-4">{staff.emailStaff}</td>
                <td className="p-4 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handleEditClick(staff._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded"
                  >
                    <HiPencilAlt />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setStaffIdToDelete(staff._id);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">You have no staff yet!</p>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-4xl text-gray-500" />
            <h3 className="text-lg mb-5">
              Are you sure you want to delete this staff?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteStaff}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Yes, I’m sure
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hrm;
