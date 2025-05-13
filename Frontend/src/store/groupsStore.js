import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../library/axios";
import { SubStore } from "./subjectStore.js";

export const GroupsStore = create((set) => ({
  groups: [],
  loading: false,
  studentss: [],
  gradeses: [],

  getGroups: async () => {
    try {
      const res = await axios.get("/groups");
      set({ groups: res.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Guruhlarni  olishda xatolik yuz berdi!";
      toast.error(errorMessage);
    }
  },

  createGroup: async ({ groupName, exelFile, subjectId, existingGroupId }) => {
    set({ loading: true });
    try {
      // FormData yaratish
      const formData = new FormData();
      formData.append("groupName", groupName);
      formData.append("existingGroupId", existingGroupId);
      if (exelFile) {
        formData.append("exelFile", exelFile);
      }

      const res = await axios.post(`/groups/create/${subjectId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ loading: false });
      SubStore.getState().getStatistics();
      toast.success(
        `${res.data.data.studentsCount} ta talaba ${
          groupName ? groupName : "shu fanga"
        } - ga qo'shildi`
      );
    } catch (error) {
      set({ loading: false });
      const errorMessage =
        error.response?.data?.message || "Guruh qo'shishda xatolik yuz berdi!";
      toast.error(errorMessage);
    }
  },

  deleteGroup: async ({ groupId, subjectId }) => {
    set({ loading: true });
    try {
      await axios.delete(`/groups/${groupId}?subjectId=${subjectId}`);
      set({ loading: false });
      toast.success("Guruh muvaffaqiyatli o'chirildi");
    } catch (error) {
      set({ loading: false });
      const errorMessage =
        error.response?.data?.message || "Guruh o'chirishda xatolik yuz berdi!";
      toast.error(errorMessage);
    }
  },

  getStudentsInGroup: async ({ groupId }) => {
    set({ loading: true });
    try {
      console.log("Fetching students for group:", groupId);
      const res = await axios.get(`/groups/students/${groupId}`);
      console.log("Response from server:", res.data);

      // Check if response is an array and has data
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // Check if the first item has students array
        if (res.data[0].students && Array.isArray(res.data[0].students)) {
          set({ studentss: res.data, loading: false });
          console.log("Students set successfully:", res.data[0].students);
        } else {
          console.error("No students array in response:", res.data[0]);
          set({ studentss: [], loading: false });
          toast.error("Talabalar ma'lumotlari topilmadi");
        }
      } else {
        console.error("Empty or invalid response:", res.data);
        set({ studentss: [], loading: false });
        toast.error("Talabalar ma'lumotlari topilmadi");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      set({ studentss: [], loading: false });
      const errorMessage =
        error.response?.data?.message || "Talabalar olishda xatolik yuz berdi!";
      toast.error(errorMessage);
    }
  },

  updateStudent: async ({ studentId, firstName, lastName, groupId }) => {
    try {
      await axios.patch(`/students/${studentId}`, {
        firstName,
        lastName,
        groupId,
      });
      toast.success("Talaba muvaffaqiyatli o'zgartirildi");
    } catch (error) {
      set({ loading: false });
      const errorMessage =
        error.response?.data?.message ||
        "Talaba o'zgartirishda xatolik yuz berdi!";
      toast.error(errorMessage);
    }
  },

  addStudent: async ({ groupId, firstName, lastName }) => {
    try {
      await axios.post(`/students/add/${groupId}`, {
        firstName,
        lastName,
      });
      toast.success("Talaba muvaffaqiyatli qo'shildi 🎉");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Talaba qo'shishda xatolik yuz berdi!";
      toast.error(errorMessage);
    }
  },

  deleteStudent: async ({ studentId, groupId }) => {
    try {
      await axios.delete(`/students/${studentId}`, {
        data: { groupId },
      });
      toast.success("Talaba muvaffaqiyatli o'chirildi 🎉", {
        id: "delete-student-success",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Talaba o'chirishda xatolik yuz berdi!";
      toast.error(errorMessage);
    }
  },

  createGrades: async ({ groupId, subjectId, columnName, grades }) => {
    try {
      await axios.post(`/grades/create-grades/${groupId}`, {
        subjectId,
        columnName,
        grades,
      });
      toast.success("Baholar muvaffaqiyatli yuklandi 🎉");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Baholar yuklashda xatolik yuz berdi!";
      toast.error(errorMessage, { id: "create-grades-error" });
    }
  },

  getGrades: async ({ groupId, subjectId }) => {
    try {
      const res = await axios.get(
        `/grades/get-grades/${groupId}?subjectId=${subjectId}`
      );
      console.log("grades", res.data);
      set({ gradeses: res.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Baho olishda xatolik yuz berdi!";
      toast.error(errorMessage, { id: "get-grades-error" });
    }
  },

  deleteColumn: async ({ groupId, subjectId, columnName }) => {
    try {
      await axios.delete(`/grades/delete-column/${groupId}`, {
        data: { subjectId, columnName },
      });
      toast.success(`"${columnName}" ustuni muvaffaqiyatli o'chirildi`);
    } catch (error) {   
      const errorMessage =
        error.response?.data?.message || "Ustun o'chirishda xatolik yuz berdi!";
      toast.error(errorMessage, { id: "delete-column-error" });
    }
  },
}));
