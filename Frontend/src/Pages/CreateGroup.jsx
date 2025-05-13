import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { FaUsers, FaBook, FaFileExcel } from "react-icons/fa";
import { GroupsStore } from "../store/groupsStore";
import { SubStore } from "../store/subjectStore";
const CreateGroup = () => {
  const navigate = useNavigate();
  const { createGroup, loading, groups, getGroups } = GroupsStore();
  const { subjects01, getSubjects } = SubStore();
  const [formData, setFormData] = useState({
    groupName: "",
    subject: "",
    existingGroup: "",
  });
  const [excelFile, setExcelFile] = useState(null);
  const [isNewGroup, setIsNewGroup] = useState(true);
  const fileInputRef = useRef(null);
  useEffect(() => {
    getSubjects();
  }, [getSubjects]);

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  const existingGroups = groups.map((group) => ({
    id: group._id,
    name: group.groupName,
  }));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setExcelFile(file);
    } else {
      alert("Iltimos, faqat Excel fayl yuklang (.xlsx)");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGroup({
        groupName: formData.groupName,
        exelFile: excelFile,
        subjectId: formData.subject,
        existingGroupId: formData.existingGroup,
      });

      // Barcha inputlarni tozalash
      setFormData({
        groupName: "",
        subject: "",
        existingGroup: "",
      });
      setExcelFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative p-8">
        <div className="max-w-2xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-0.5">
              Yangi guruh yaratish
            </h1>
          </Motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Guruh tanlash turi */}
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-8 p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20"
            >
              <label
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => {
                  setIsNewGroup(false);
                  // Mavjud guruh tanlanganda, guruh nomi va Excel faylini tozalash
                  setFormData((prev) => ({
                    ...prev,
                    groupName: "",
                  }));
                  setExcelFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    !isNewGroup
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300 group-hover:border-blue-400"
                  }`}
                >
                  {!isNewGroup && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    !isNewGroup
                      ? "text-blue-700"
                      : "text-gray-600 group-hover:text-blue-600"
                  }`}
                >
                  Mavjud guruhlardan foydalanish
                </span>
              </label>
              <label
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => {
                  setIsNewGroup(true);
                  // Yangi guruh tanlanganda, mavjud guruhni tozalash
                  setFormData((prev) => ({
                    ...prev,
                    existingGroup: "",
                  }));
                }}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isNewGroup
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300 group-hover:border-blue-400"
                  }`}
                >
                  {isNewGroup && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isNewGroup
                      ? "text-blue-700"
                      : "text-gray-600 group-hover:text-blue-600"
                  }`}
                >
                  Yangi guruh qo'shish
                </span>
              </label>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 gap-8"
            >
              <div className="relative group">
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200"
                >
                  Fanlar
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBook
                      className={`h-5 w-5 ${
                        formData.subject ? "text-blue-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 bg-white/80 backdrop-blur-sm max-h-[200px] overflow-y-auto"
                  >
                    <option value="">Fan tanlang</option>
                    {subjects01.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject?.subjectName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!isNewGroup && (
                <div className="relative group">
                  <label
                    htmlFor="existingGroup"
                    className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200"
                  >
                    Mavjud guruhlar
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUsers
                        className={`h-5 w-5 ${
                          formData.existingGroup
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <select
                      id="existingGroup"
                      name="existingGroup"
                      required
                      value={formData.existingGroup}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 bg-white/80 backdrop-blur-sm"
                    >
                      <option value="">Guruh tanlang</option>
                      {existingGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative group"
            >
              <label
                htmlFor="groupName"
                className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200"
              >
                Guruh nomi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUsers
                    className={`h-5 w-5 ${
                      formData.groupName ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  id="groupName"
                  name="groupName"
                  required
                  value={formData.groupName}
                  onChange={handleChange}
                  disabled={!isNewGroup}
                  className={`block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 bg-white/80 backdrop-blur-sm ${
                    !isNewGroup ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Masalan: 101-guruh"
                />
              </div>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative group"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                Talabalar ro'yxati (Excel)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFileExcel
                    className={`h-5 w-5 ${
                      excelFile ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx"
                  required
                  onChange={handleFileChange}
                  disabled={!isNewGroup}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!isNewGroup}
                  className={`block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-xl shadow-sm hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-left bg-white/80 backdrop-blur-sm ${
                    !isNewGroup ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {excelFile ? excelFile.name : "Excel fayl yuklang"}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Faqat .xlsx formatidagi fayllar qabul qilinadi
              </p>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex justify-end gap-4 pt-6"
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                Bekor qilish
              </button>
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Yuklanmoqda...</span>
                  </div>
                ) : isNewGroup ? (
                  "Guruh yaratish"
                ) : (
                  "Guruhni tanlash"
                )}
              </Motion.button>
            </Motion.div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
