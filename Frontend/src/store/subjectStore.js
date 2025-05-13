import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../library/axios";

export const SubStore = create((set) => ({
  subjects01: [],
  loading: false,
  statistics: [],

  getSubjects: async () => {
    set({ loading: true });
    try {
      const subjects = await axios.get("/subjects/get_all_subject");
      console.log("Sibjects:", subjects);
      if (!subjects) {
        set({ subjects: [] });
        return;
      }
      set({ subjects01: subjects.data, loading: false });
    } catch (error) {
      set({ loading: false });
      const errorMessage =
        error.response?.data?.message || "Xatolik yuz berdi ⚠️";
      toast.error(errorMessage);
    }
  },

  createSubject: async (subjectName, id) => {
    console.log("SubjectName:", subjectName);
    set({ loading: true });
    try {
      const res = await axios.post(`/subjects/create/${id}`, { subjectName });
      const newSubject = res.data;
      set((state) => ({
        subjects01: [...state.subjects01, newSubject],
        loading: false,
      }));
      toast.success("Fan muvaffaqiyatli qo'shildi!");
      SubStore.getState().getStatistics();
    } catch (error) {
      set({ loading: false });
      const errorMessage =
        error.response?.data?.message || "Fan qo'shishda xatolik yuz berdi!";
      toast.error(errorMessage);
    }
  },

  deleteSubject: async (id) => {
    try {
      await axios.delete(`/subjects/delete/subject/${id}`);
      set((state) => ({
        subjects01: state.subjects01.filter((subject) => subject._id !== id),
      }));

      toast.success("Fan muvaffaqiyatli o'chirildi! ");
      SubStore.getState().getStatistics();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Fan o'chirishda xatolik yuz berdi!";
      toast.error(errorMessage);
    }
  },

  getStatistics: async () => {
    try {
      const res = await axios.get("/getStatistics");
      console.log("Statistics:", res.data);
      set({ statistics: res.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Statistika olishda xatolik yuz berdi!";
      toast.error(errorMessage);
    }
  },
}));
