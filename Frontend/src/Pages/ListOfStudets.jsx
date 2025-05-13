import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import { GroupsStore } from "../store/groupsStore";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-hot-toast";

// Default ustunlar
const DEFAULT_COLUMNS = ["1-nazorat", "2-nazorat"];

const ListOfStudent = ({ groupName, subjectName, subjectId }) => {
  const {
    studentss,
    loading,
    getStudentsInGroup,
    updateStudent,
    addStudent,
    deleteStudent,
    getGrades,
    gradeses,
    createGrades,
    deleteColumn,
  } = GroupsStore();
  const [students, setStudents] = useState([]);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [grades, setGrades] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showColModal, setShowColModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [newColumn, setNewColumn] = useState("");
  const [newStudent, setNewStudent] = useState({ firstName: "", lastName: "" });
  const [editStudentId, setEditStudentId] = useState(null);
  const [editStudent, setEditStudent] = useState({
    firstName: "",
    lastName: "",
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const [editColumn, setEditColumn] = useState(null);
  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudents() {
      try {
        await getStudentsInGroup({ groupId: groupId });
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
    fetchStudents();
  }, [getStudentsInGroup, groupId]);

  useEffect(() => {
    setColumns([]);
    getGrades({ groupId: groupId, subjectId: subjectId });
  }, [groupId, subjectId, getGrades]);

  useEffect(() => {
    if (gradeses && gradeses.grades && gradeses.grades.length > 0) {
      const gradesObject = {};
      const backendColumns = new Set();

      gradeses.grades.forEach((grade) => {
        backendColumns.add(grade.columnName);
        grade.baholar.forEach((baho) => {
          if (!gradesObject[baho.student_id]) {
            gradesObject[baho.student_id] = {};
          }
          gradesObject[baho.student_id][grade.columnName] = baho.grade;
        });
      });

      // Faqat backenddan kelgan ustunlarni ishlatamiz
      setColumns([...backendColumns]);
      setGrades(gradesObject);
    } else {
      // Agar backenddan ma'lumotlar bo'sh bo'lsa, default ustunlarni ko'rsatamiz
      setColumns(DEFAULT_COLUMNS);
      setGrades({});
    }
  }, [gradeses]);

  console.log("grades9888:", grades);
  useEffect(() => {
    console.log("Students data updated:", studentss);
    if (studentss && studentss[0]?.students) {
      console.log("Setting students:", studentss[0].students);
      setStudents(studentss[0].students);
    } else {
      console.log("No students data available");
      setStudents([]);
    }
  }, [studentss]);

  if (loading) return <LoadingSpinner />;

  // Filter students
  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new column - faqat local state'ga qo'shish
  const handleAddColumn = () => {
    if (newColumn.trim() && !columns.includes(newColumn.trim())) {
      setColumns([...columns, newColumn.trim()]);
      setNewColumn("");
      setShowColModal(false);
    }
  };

  // Add new student
  const handleAddStudent = async () => {
    if (newStudent.firstName.trim() && newStudent.lastName.trim()) {
      await addStudent({
        groupId: groupId,
        firstName: newStudent.firstName.trim(),
        lastName: newStudent.lastName.trim(),
      });
      setStudents([
        ...students,
        {
          id: Date.now(),
          firstName: newStudent.firstName.trim(),
          lastName: newStudent.lastName.trim(),
        },
      ]);
      setNewStudent({ firstName: "", lastName: "" });
      setShowStudentModal(false);
    }
  };

  // Edit student
  const handleEditStudent = (student) => {
    setEditStudentId(student._id);

    setEditStudent({
      firstName: student.firstName,
      lastName: student.lastName,
    });
  };

  const handleSaveEditStudent = () => {
    updateStudent({
      studentId: editStudentId,
      firstName: editStudent.firstName,
      lastName: editStudent.lastName,
      groupId: groupId,
    });
    setStudents((prev) =>
      prev.map((s) =>
        s._id === editStudentId
          ? {
              ...s,
              firstName: editStudent.firstName,
              lastName: editStudent.lastName,
            }
          : s
      )
    );
    setEditStudentId(null);
    setEditStudent({ firstName: "", lastName: "" });
  };

  // Delete student
  const handleDeleteStudent = async (id) => {
    try {
      if (!id) {
        console.error("Student ID is undefined");
        toast.error("Talaba ID si topilmadi");
        return;
      }
      await deleteStudent({ studentId: id, groupId: groupId });
      // Frontend state'ni yangilash
      setStudents((prev) => prev.filter((s) => s._id !== id));
      setGrades((prev) => {
        const newGrades = { ...prev };
        delete newGrades[id];
        return newGrades;
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Talabani o'chirishda xatolik yuz berdi");

      // Xatolik yuz berganda state'ni qaytarish
      setStudents((prev) => [...prev]);
      setGrades((prev) => ({ ...prev }));
    }
  };

  // Edit/save grade
  const handleGradeChange = (studentId, column, value) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [column]: value },
    }));
  };

  // Saqlash faqat shu column uchun
  const handleSaveColumn = () => {
    if (!editColumn) return;

    // Joriy ustundagi barcha baholarni yig'ish
    const columnGrades = students.map((student) => ({
      studentId: student._id,
      value: isNaN(Number(grades[student._id]?.[editColumn]))
        ? 0
        : Number(grades[student._id]?.[editColumn]),
    }));

    // Baholarni saqlash
    createGrades({
      groupId: groupId,
      subjectId: subjectId,
      columnName: editColumn,
      grades: columnGrades,
    });

    setEditColumn(null);
  };

  // Delete column
  const handleDeleteColumn = (col) => {
    deleteColumn({ groupId: groupId, subjectId: subjectId, columnName: col });
    setColumns((prev) => prev.filter((c) => c !== col));
    setGrades((prev) => {
      const newGrades = {};
      Object.keys(prev).forEach((studentId) => {
        const { [col]: _, ...rest } = prev[studentId] || {};
        newGrades[studentId] = rest;
      });
      return newGrades;
    });
    if (editColumn === col) setEditColumn(null);
  };

  const handleGoBack = () => {
    navigate(-1);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div
      className="w-full min-h-screen p-0 m-0"
      style={{
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)",
      }}
    >
      {/* Title Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              title="Orqaga qaytish"
            >
              <FaArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">Baholar Jadvali</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-blue-200">Guruh:</span>
                <span className="font-medium">{groupName}</span>
              </div>
              <div className="w-px h-4 bg-blue-400"></div>
              <div className="flex items-center gap-1">
                <span className="text-blue-200">Fan:</span>
                <span className="font-medium">{subjectName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1"
            title="Ustun qo'shish"
            onClick={() => setShowColModal(true)}
          >
            <FaPlus size={14} />
            <span>Ustun</span>
          </button>
          <button
            className="p-2 rounded bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-1"
            title="Talaba qo'shish"
            onClick={() => setShowStudentModal(true)}
          >
            <FaPlus size={14} />
            <span>Talaba</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-8 pb-8">
        <table className="w-full border-collapse border border-gray-400 bg-white shadow-lg">
          <thead>
            <tr>
              <th className="border border-gray-400 bg-blue-600 text-white font-semibold py-2 px-2 text-sm w-12">
                №
              </th>
              <th className="border border-gray-400 bg-blue-600 text-white font-semibold py-2 px-2 text-sm w-32">
                Ism
              </th>
              <th className="border border-gray-400 bg-blue-600 text-white font-semibold py-2 px-2 text-sm w-40">
                Familiya
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="border border-gray-400 bg-blue-600 text-white font-semibold py-2 px-2 text-sm min-w-[80px] relative group"
                >
                  <span>{col}</span>
                  <span className="absolute right-2 top-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      className="p-1 text-xs text-yellow-200 hover:text-yellow-500"
                      title="Baholarni tahrirlash"
                      onClick={() => setEditColumn(col)}
                    >
                      <FaEdit size={13} />
                    </button>
                    <button
                      className="p-1 text-xs text-red-200 hover:text-red-600"
                      title="Ustunni o'chirish"
                      onClick={() => handleDeleteColumn(col)}
                    >
                      <FaTrash size={13} />
                    </button>
                  </span>
                  {editColumn === col && (
                    <button
                      className="ml-2 p-1 rounded bg-orange-500 text-white hover:bg-orange-600 transition absolute left-4 -translate-x-1/2"
                      style={{ zIndex: 20 }}
                      onClick={handleSaveColumn}
                    >
                      <FaSave size={13} />
                    </button>
                  )}
                </th>
              ))}
              <th className="border border-gray-400 bg-blue-600 text-white font-semibold py-2 px-2 text-sm w-20">
                Amal
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, rowIdx) => (
              <tr
                key={student._id}
                className={`transition-colors ${
                  selectedRow === student._id
                    ? "bg-yellow-200"
                    : rowIdx % 2 === 0
                    ? "bg-blue-50"
                    : "bg-white"
                } hover:bg-green-100`}
                onClick={() => setSelectedRow(student._id)}
              >
                <td className="border border-gray-400 py-1 px-2 text-sm text-center w-12">
                  {rowIdx + 1}
                </td>
                <td className="border border-gray-400 py-1 px-2 text-sm w-32 truncate">
                  {editStudentId === student._id ? (
                    <input
                      type="text"
                      className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm"
                      value={editStudent.firstName}
                      onChange={(e) =>
                        setEditStudent((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    student.firstName
                  )}
                </td>
                <td className="border border-gray-400 py-1 px-2 text-sm w-40 truncate">
                  {editStudentId === student._id ? (
                    <input
                      type="text"
                      className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm"
                      value={editStudent.lastName}
                      onChange={(e) =>
                        setEditStudent((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    student.lastName
                  )}
                </td>
                {columns.map((col) => {
                  const studentGrade = grades[student._id]?.[col] || "";

                  return (
                    <td
                      key={col}
                      className="border border-gray-400 py-1 px-2 text-sm min-w-[80px]"
                    >
                      {editColumn === col ? (
                        <input
                          type="text"
                          className="w-full px-1 py-0.5 border border-gray-300 rounded text-center text-sm"
                          value={studentGrade}
                          onChange={(e) =>
                            handleGradeChange(student._id, col, e.target.value)
                          }
                        />
                      ) : (
                        <span>{studentGrade}</span>
                      )}
                    </td>
                  );
                })}
                <td className="border border-gray-400 py-1 px-2 text-sm w-20 flex gap-1 items-center justify-center">
                  {editStudentId === student._id ? (
                    <>
                      <button
                        className="p-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        title="Saqlash"
                        onClick={handleSaveEditStudent}
                      >
                        <FaSave size={14} />
                      </button>
                      <button
                        className="p-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                        title="Bekor qilish"
                        onClick={() => setEditStudentId(null)}
                      >
                        <FaTimes size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="p-1 rounded bg-yellow-400 text-white hover:bg-yellow-500"
                        title="Tahrirlash"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStudent(student);
                        }}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        className="p-1 rounded bg-red-500 text-white hover:bg-red-600"
                        title="O'chirish"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStudent(student._id);
                        }}
                      >
                        <FaTrash size={14} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ustun qo'shish modal */}
      {showColModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h2 className="text-lg font-semibold mb-4">
              Ustun nomini kiriting
            </h2>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
              placeholder="Masalan: 1-nazorat"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowColModal(false)}
              >
                Bekor qilish
              </button>
              <button
                className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleAddColumn}
              >
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Talaba qo'shish modal */}
      {showStudentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h2 className="text-lg font-semibold mb-4">
              Yangi talaba qo'shish
            </h2>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newStudent.firstName}
              onChange={(e) =>
                setNewStudent((prev) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
              }
              placeholder="Ism"
              autoFocus
            />
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newStudent.lastName}
              onChange={(e) =>
                setNewStudent((prev) => ({
                  ...prev,
                  lastName: e.target.value,
                }))
              }
              placeholder="Familiya"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowStudentModal(false)}
              >
                Bekor qilish
              </button>
              <button
                className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                onClick={handleAddStudent}
              >
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfStudent;
