import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaHome,
  FaBook,
  FaCalendarAlt,
  FaTelegram,
  FaBookOpen,
  FaUsers,
  FaUserGraduate,
  FaSearch,
  FaChevronDown,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaPlus,
  FaChartPie,
  FaEllipsisV,
  FaExclamationTriangle,
  FaTrash,
  FaTimes,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useAuthStore } from "../store/authStore";
import { SubStore } from "../store/subjectStore";
import { GroupsStore } from "../store/groupsStore";

const HomePage = () => {
  const {
    subjects01,
    loading,
    createSubject,
    getSubjects,
    deleteSubject,
    getStatistics,
    statistics,
  } = SubStore();
  const { groups, getGroups } = GroupsStore();
  const { logout, user } = useAuthStore();
  const [searchValue, setSearchValue] = React.useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [modalError, setModalError] = useState("");
  const [activeMenu, setActiveMenu] = useState("home");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    getStatistics();
  }, [getStatistics]);
  useEffect(() => {
    getSubjects();
  }, [getSubjects]);
  useEffect(() => {
    getGroups();
  }, [getGroups]);
  const chartData = groups.map((group) => ({
    name: group.groupName,
    students: group.studentCount,
  }));

  const handlePrevGroup = () => {
    setCurrentGroupIndex((prev) =>
      prev > 0 ? prev - 1 : chartData.length - 3
    );
  };

  const handleNextGroup = () => {
    setCurrentGroupIndex((prev) =>
      prev < chartData.length - 3 ? prev + 1 : 0
    );
  };

  // Dropdown tashqarisiga bosilganda yopiladi
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Chap panel ochilganda Bosh sahifa aktiv bo'ladi
  useEffect(() => {
    setActiveMenu("home");
  }, []);

  const handleDropdownClick = (id, event) => {
    event.stopPropagation();
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteSubjectId(id);
    setShowDeleteModal(true);
    setConfirmDelete(false);
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete) {
      await deleteSubject(deleteSubjectId);
      setShowDeleteModal(false);
      setOpenDropdownId(null);
      setConfirmDelete(false);
    }
  };

  // Modal ochish/berkitish
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewSubjectName("");
    setModalError("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Qidiruv funksiyasi (hozircha alert)
    alert(`Qidiruv: ${searchValue}`);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleTelegramClick = () => {
    window.open("https://t.me/sadu11ayevvv", "_blank");
  };

  // Rang tanlash funksiyasi
  const getRandomColor = () => {
    const colors = [
      "border-blue-500",
      "border-green-500",
      "border-yellow-500",
      "border-red-500",
      "border-purple-500",
      "border-indigo-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const stats = [
    {
      label: "Fanlar soni",
      value: statistics.subject,
      icon: <FaBook className="text-white" size={20} />,
      color: "bg-green-400",
      progress: "bg-green-400",
    },
    {
      label: "Guruhlar soni",
      value: statistics.groups,
      icon: <FaUsers className="text-white" size={20} />,
      color: "bg-blue-400",
      progress: "bg-blue-400",
    },
    {
      label: "Talabalar soni",
      value: statistics.students,
      icon: <FaUserGraduate className="text-white" size={20} />,
      color: "bg-yellow-400",
      progress: "bg-yellow-400",
    },
  ];
  // Statistika kartalarini yaratish
  const StatCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center bg-white rounded-xl shadow p-4 min-w-[220px]"
        >
          {/* Icon */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${stat.color} mr-4`}
          >
            {stat.icon}
          </div>
          {/* Info */}
          <div className="flex-1">
            <div className="text-xs text-gray-500 font-medium">
              {stat.label}
            </div>
            <div className="w-full h-1 mt-1 mb-1 rounded bg-gray-200 overflow-hidden">
              <div
                className={`h-1 rounded ${stat.progress}`}
                style={{ width: "80%" }}
              />
            </div>
          </div>
          {/* Value */}
          <div className="ml-4 text-lg font-bold text-gray-700 whitespace-nowrap">
            {stat.value} ta
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setShowDeleteModal(false)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative transform transition-all">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-600 text-3xl" />
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ogohlantirish!
                </h3>
                <p className="text-gray-600">
                  Siz{" "}
                  <span className="font-semibold text-red-600">
                    {
                      subjects01.find(
                        (subject) => subject._id === deleteSubjectId
                      )?.subjectName
                    }
                  </span>{" "}
                  fanini o'chirib tashlamoqchisiz
                </p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 mb-6">
                <div className="text-gray-700 space-y-3">
                  <div className="flex items-start gap-3">
                    <FaTrash className="text-red-500 mt-1 flex-shrink-0" />
                    <p>Fanga tegishli barcha guruhlar o'chib ketadi</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaUsers className="text-red-500 mt-1 flex-shrink-0" />
                    <p>
                      Guruhlardagi barcha talabalar ma'lumotlari ham o'chib
                      ketadi
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                    <p>Bu amalni qaytarib bo'lmaydi</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
                <input
                  type="checkbox"
                  id="confirmDelete"
                  checked={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.checked)}
                  className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label
                  htmlFor="confirmDelete"
                  className="text-sm text-gray-700 font-medium"
                >
                  Haqiqatdan ham o'chirmoqchimisiz?
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors flex items-center gap-2"
                >
                  <FaTimes className="text-gray-500" />
                  Bekor qilish
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={!confirmDelete}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
                    confirmDelete
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaCheckCircle
                    className={confirmDelete ? "text-white" : "text-gray-400"}
                  />
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={closeModal}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
              <div className="text-lg font-bold mb-4 text-center">
                Fan qo'shish
              </div>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => {
                  setNewSubjectName(e.target.value);
                }}
                placeholder="Fan nomini kiriting"
                className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {modalError && (
                <div className="mb-4 text-sm text-red-600 bg-red-100 rounded px-3 py-2">
                  {modalError}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={() => {
                    if (newSubjectName.trim()) {
                      createSubject(newSubjectName.trim(), user._id);
                      setNewSubjectName("");
                      closeModal();
                    }
                  }}
                  className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                >
                  Yaratish
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Sidebar */}
      <aside className="w-64 bg-[#23272e] text-white flex flex-col">
        <div className="flex flex-col items-center py-8">
          <img
            src="https://media.istockphoto.com/id/1131164548/vector/avatar-5.jpg?s=612x612&w=0&k=20&c=CK49ShLJwDxE4kiroCR42kimTuuhvuo2FH5y_6aSgEo="
            alt="User"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <div className="mt-2 font-semibold text-lg text-center">
            {user.firstName.charAt(0).toUpperCase() +
              user.firstName.slice(1).toLowerCase()}{" "}
            {user.lastName.charAt(0).toUpperCase() +
              user.lastName.slice(1).toLowerCase()}
          </div>
        </div>
        <nav className="flex-1">
          <ul className="space-y-1 px-4">
            <li
              className={`rounded font-bold flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                activeMenu === "home"
                  ? "bg-red-500 text-white"
                  : "hover:bg-gray-700 text-white"
              }`}
              onClick={() => {
                setActiveMenu("home");
                navigate("/");
              }}
            >
              <FaHome size={18} /> Bosh sahifa
            </li>
            <li
              className={`rounded flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                activeMenu === "fan"
                  ? "bg-red-500 text-white"
                  : "hover:bg-gray-700 text-white"
              }`}
              onClick={() => {
                setActiveMenu("fan");
                openModal();
              }}
            >
              <FaBookOpen size={18} /> Fan yaratish
            </li>
            <li
              className={`rounded flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                activeMenu === "guruh"
                  ? "bg-red-500 text-white"
                  : "hover:bg-gray-700 text-white"
              }`}
              onClick={() => {
                setActiveMenu("guruh"), navigate("/create-group");
              }}
            >
              <FaCalendarAlt size={18} /> Guruh yaratish
            </li>
            <li
              onClick={handleTelegramClick}
              className="hover:bg-gray-700 rounded flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors"
            >
              <FaTelegram size={18} /> Dasturchiga savol
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-3 relative">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/vite.svg" alt="Logo" className="w-10 h-10" />
            <span className="font-bold text-xl text-[#23272e]">
              Boshqaruv tizimi
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search panel */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Qidiruv..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-48 border rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
              >
                <FaSearch size={16} />
              </button>
            </form>

            {/* Profile */}
            <div ref={profileRef} className="relative flex items-center gap-2">
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src="https://media.istockphoto.com/id/1131164548/vector/avatar-5.jpg?s=612x612&w=0&k=20&c=CK49ShLJwDxE4kiroCR42kimTuuhvuo2FH5y_6aSgEo="
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                />
                <span className="font-semibold text-gray-700 select-none">
                  {user.firstName.charAt(0).toUpperCase() +
                    user.firstName.slice(1).toLowerCase()}{" "}
                  {user.lastName.charAt(0).toUpperCase()}
                </span>
                <FaChevronDown
                  className={`text-gray-500 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-14 bg-white shadow-lg rounded-lg py-2 w-56 z-20 border border-gray-100"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="font-semibold text-gray-800">
                      {user.firstName.charAt(0).toUpperCase() +
                        user.firstName.slice(1).toLowerCase()}{" "}
                      {user.lastName.charAt(0).toUpperCase() +
                        user.lastName.slice(1).toLowerCase()}
                    </div>
                    <div className="flex">
                      <div className="text-sm text-gray-500 underline pr-1">
                        username:
                      </div>
                      <div className="text-sm text-blue-800">
                        {user.username}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition"
                    >
                      <FaSignOutAlt /> Chiqish
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <StatCards />

        {/* Main widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6">
          {/* Temperament Chart */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center md:col-span-1">
            <div className="font-semibold mb-4 text-gray-700">
              O'QITUVCHI FUNKSIYALARI
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3 flex items-center gap-3 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <FaBookOpen className="text-blue-600" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">
                    Fan yaratish
                  </div>
                  <div className="text-xs text-gray-600">
                    Fanlarni boshqarish
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-3 flex items-center gap-3 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                  <FaUsers className="text-green-600" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">
                    Guruhlar
                  </div>
                  <div className="text-xs text-gray-600">
                    Guruhlarni boshqarish
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-3 flex items-center gap-3 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                  <FaUserGraduate className="text-yellow-600" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">
                    Talabalar
                  </div>
                  <div className="text-xs text-gray-600">
                    Talabalarni boshqarish
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-3 flex items-center gap-3 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                  <FaChartPie className="text-purple-600" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">
                    Baholash
                  </div>
                  <div className="text-xs text-gray-600">Nazorat qilish</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-3 flex items-center gap-3 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center">
                  <FaBook className="text-indigo-600" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">
                    Statistika
                  </div>
                  <div className="text-xs text-gray-600">
                    Natijalarni kuzatish
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Fanlar kartalari */}
          <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
            <div className="font-semibold mb-2 text-xl">
              Fanlar statistikasi
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-64 pr-2">
              {loading ? (
                <div className="col-span-2 flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : subjects01 && subjects01.length > 0 ? (
                subjects01.map((subject, idx) => (
                  <div
                    key={subject._id}
                    className={`bg-white rounded-xl shadow p-4 border-l-4 ${getRandomColor()} flex flex-col justify-between min-h-[100px] relative group`}
                  >
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => handleDropdownClick(idx, e)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
                          ${
                            openDropdownId === idx
                              ? "bg-blue-100 text-blue-600"
                              : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          }`}
                      >
                        <FaEllipsisV size={16} />
                      </button>
                      {openDropdownId === idx && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 transform transition-all duration-200 ease-out z-20"
                        >
                          <button
                            onClick={() => handleDeleteClick(subject._id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <FaSignOutAlt className="text-red-500" size={14} />
                            O'chirish
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-4">
                      {subject.subjectName}
                    </div>
                    <button
                      className="flex items-center gap-2 mt-auto text-blue-600 font-bold cursor-pointer"
                      onClick={() =>
                        navigate("/students-in-groups", {
                          state: {
                            subjectId: subject._id,
                            groups: subject.groups,
                            subjectName: subject.subjectName,
                          },
                        })
                      }
                    >
                      <FaUsers />
                      <span className="text-base">
                        {subject.groups?.length || 0} ta guruh
                      </span>
                      <FaChevronRight size={15} />
                    </button>
                  </div>
                ))
              ) : (
                <div
                  className="col-span-2 flex flex-col items-center justify-center min-h-[100px] bg-blue-50/50 border-2 border-dashed border-blue-400 rounded-xl shadow cursor-pointer hover:bg-blue-100/70 transition"
                  onClick={openModal}
                >
                  <FaPlus className="text-blue-500 text-3xl mb-2" />
                  <span className="text-blue-700 font-semibold">
                    Fan qo'shish
                  </span>
                </div>
              )}
              {subjects01 && subjects01.length > 0 && (
                <div
                  className="flex flex-col items-center justify-center min-h-[100px] bg-blue-50/50 border-2 border-dashed border-blue-400 rounded-xl shadow cursor-pointer hover:bg-blue-100/70 transition"
                  onClick={openModal}
                >
                  <FaPlus className="text-blue-500 text-3xl mb-2" />
                  <span className="text-blue-700 font-semibold">
                    Fan qo'shish
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guruhlar ro'yxati */}
        <div className="p-4">
          <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg p-4 w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-500" size={20} />
                <div className="font-semibold text-lg text-gray-700">
                  GURUHLAR RO'YXATI
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevGroup}
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <FaChevronLeft className="text-blue-500" size={20} />
                </button>
                <div className="flex space-x-4 relative">
                  {chartData
                    .slice(currentGroupIndex, currentGroupIndex + 3)
                    .map((group, index) => (
                      <div
                        key={index}
                        className={`flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-xl p-3 w-[150px] text-center shadow-sm hover:shadow-lg transition-all duration-500 ease-in-out border border-blue-100 ${
                          index === 1
                            ? "scale-110 z-10 shadow-lg translate-x-0"
                            : index === 0
                            ? "scale-90 opacity-70 -translate-x-4"
                            : "scale-90 opacity-70 translate-x-4"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <FaUserGraduate className="text-blue-500" size={14} />
                          <div className="font-bold text-gray-800 text-sm">
                            {group.name}
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                          <FaUsers className="text-blue-400" size={12} />
                          <span>{group.students} talaba</span>
                        </div>
                      </div>
                    ))}
                </div>
                <button
                  onClick={handleNextGroup}
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <FaChevronRight className="text-blue-500" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

// CSS qo'shamiz
const styles = `
@keyframes carousel {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-carousel {
  animation: carousel 20s linear infinite;
  display: flex;
  width: max-content;
}

.animate-carousel:hover {
  animation-play-state: paused;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-carousel > div {
  animation: fadeIn 0.5s ease-out forwards;
}
`;

// Style qo'shamiz
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
