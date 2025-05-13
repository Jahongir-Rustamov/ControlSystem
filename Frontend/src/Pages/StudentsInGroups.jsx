import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaChevronLeft,
  FaSearch,
  FaClock,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { GroupsStore } from "../store/groupsStore";
import LoadingSpinner from "../components/LoadingSpinner";

const StudentsInGroups = ({ groups = [], subjectName, subjectId }) => {
  const [searchValue, setSearchValue] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();
  const { deleteGroup, loading, getStudentsInGroup } = GroupsStore();

  if (loading) return <LoadingSpinner />;

  // Guruhlarni to'g'ri formatda olish
  const formattedGroups = groups.map((group) => ({
    _id: group._id?._id || group._id,
    groupName: group._id?.groupName || group.groupName,
    createdAt: group.createdAt || new Date().toISOString(),
  }));

  // Qidiruv bo'yicha filtrlash
  const filteredGroups = formattedGroups.filter(
    (group) =>
      group?.groupName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      false
  );

  // Vaqtni formatlash
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const time = date.toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (diffDays === 0) {
      return `Bugun, ${time}`;
    } else if (diffDays === 1) {
      return `Kecha, ${time}`;
    } else if (diffDays < 7) {
      return `${diffDays} kun oldin, ${time}`;
    } else {
      return date.toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Guruhni o'chirish
  const handleDeleteGroup = async () => {
    try {
      // TODO: API call to delete group
      await deleteGroup({ groupId: selectedGroup._id, subjectId });
      setShowDeleteModal(false);
      setSelectedGroup(null);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              <FaChevronLeft size={18} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">
              {subjectName
                ? `${subjectName} fanidan guruhlar`
                : "Guruhlar ro'yxati"}
            </h1>
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Guruh nomi bo'yicha qidirish..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full md:w-80 pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => (
            <div
              key={group._id}
              className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-200 relative group"
            >
              <button
                onClick={() => {
                  setSelectedGroup(group);
                  setShowDeleteModal(true);
                }}
                className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <FaTrash size={16} />
              </button>
              <div
                className="p-5 cursor-pointer hover:bg-gray-50 transition-all duration-200"
                onClick={() => {
                  getStudentsInGroup({ groupId: group._id });
                  navigate(`/list/${group._id}`, {
                    state: {
                      subjectName,
                      groupName: group.groupName,
                      subjectId,
                    },
                  });
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaUsers className="text-blue-500" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-lg mb-1 truncate">
                      {group?.groupName || "Noma'lum guruh"}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaClock className="text-gray-400" size={14} />
                      <span>{formatDate(group.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
              <FaSearch className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500">Guruhlar topilmadi</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <FaTrash className="text-red-500" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Guruhni o'chirish
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedGroup.groupName}
                </p>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 mb-6">
              <p className="text-gray-700">
                <span className="font-medium text-red-500">Diqqat!</span> Agar
                bu guruhni o'chirsangiz, bu guruhga tegishli barcha baholar ham
                o'chib ketadi va bu amalni ortga qaytarib bo'lmaydi.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedGroup(null);
                }}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDeleteGroup}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsInGroups;
