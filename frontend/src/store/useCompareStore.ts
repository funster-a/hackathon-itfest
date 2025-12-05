import { create } from 'zustand';
import type { IUniversity, IAcademicProgram } from '../types';

export interface ICompareProgram {
  universityId: string;
  universityName: string;
  program: IAcademicProgram;
}

interface CompareStore {
  compareList: IUniversity[];
  compareProgramsList: ICompareProgram[];
  userEntScore: number | null;
  addToCompare: (university: IUniversity) => void;
  removeFromCompare: (id: string) => void;
  addProgramToCompare: (universityId: string, universityName: string, program: IAcademicProgram) => void;
  removeProgramFromCompare: (universityId: string, programName: string) => void;
  setEntScore: (score: number | null) => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  compareList: [],
  compareProgramsList: [],
  userEntScore: null,
  addToCompare: (university) =>
    set((state) => {
      // Проверяем, не добавлен ли уже университет
      if (state.compareList.some((u) => u.id === university.id)) {
        return state;
      }
      return {
        compareList: [...state.compareList, university],
      };
    }),
  removeFromCompare: (id) =>
    set((state) => ({
      compareList: state.compareList.filter((u) => u.id !== id),
    })),
  addProgramToCompare: (universityId, universityName, program) =>
    set((state) => {
      // Проверяем, не добавлена ли уже программа
      if (state.compareProgramsList.some(
        (p) => p.universityId === universityId && p.program.name === program.name
      )) {
        return state;
      }
      return {
        compareProgramsList: [...state.compareProgramsList, { universityId, universityName, program }],
      };
    }),
  removeProgramFromCompare: (universityId, programName) =>
    set((state) => ({
      compareProgramsList: state.compareProgramsList.filter(
        (p) => !(p.universityId === universityId && p.program.name === programName)
      ),
    })),
  setEntScore: (score) =>
    set(() => ({
      userEntScore: score,
    })),
}));

