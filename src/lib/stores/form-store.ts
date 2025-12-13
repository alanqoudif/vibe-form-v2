import { create } from 'zustand';
import type { Form, FormQuestion } from '@/types/database';

interface FormBuilderState {
  form: Partial<Form> | null;
  questions: FormQuestion[];
  selectedQuestionId: string | null;
  isDirty: boolean;
  isGenerating: boolean;
  
  // Actions
  setForm: (form: Partial<Form> | null) => void;
  updateForm: (updates: Partial<Form>) => void;
  setQuestions: (questions: FormQuestion[]) => void;
  addQuestion: (question: FormQuestion) => void;
  updateQuestion: (id: string, updates: Partial<FormQuestion>) => void;
  removeQuestion: (id: string) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  selectQuestion: (id: string | null) => void;
  setDirty: (dirty: boolean) => void;
  setGenerating: (generating: boolean) => void;
  reset: () => void;
}

export const useFormStore = create<FormBuilderState>((set, get) => ({
  form: null,
  questions: [],
  selectedQuestionId: null,
  isDirty: false,
  isGenerating: false,

  setForm: (form) => set({ form, isDirty: false }),
  
  updateForm: (updates) => set((state) => ({
    form: state.form ? { ...state.form, ...updates } : updates,
    isDirty: true,
  })),

  setQuestions: (questions) => set({ questions, isDirty: false }),

  addQuestion: (question) => set((state) => ({
    questions: [...state.questions, question],
    isDirty: true,
  })),

  updateQuestion: (id, updates) => set((state) => ({
    questions: state.questions.map((q) =>
      q.id === id ? { ...q, ...updates } : q
    ),
    isDirty: true,
  })),

  removeQuestion: (id) => set((state) => ({
    questions: state.questions.filter((q) => q.id !== id),
    selectedQuestionId: state.selectedQuestionId === id ? null : state.selectedQuestionId,
    isDirty: true,
  })),

  reorderQuestions: (fromIndex, toIndex) => set((state) => {
    const newQuestions = [...state.questions];
    const [removed] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, removed);
    
    // Update order_index for all questions
    const reorderedQuestions = newQuestions.map((q, index) => ({
      ...q,
      order_index: index,
    }));
    
    return { questions: reorderedQuestions, isDirty: true };
  }),

  selectQuestion: (id) => set({ selectedQuestionId: id }),
  
  setDirty: (isDirty) => set({ isDirty }),
  
  setGenerating: (isGenerating) => set({ isGenerating }),

  reset: () => set({
    form: null,
    questions: [],
    selectedQuestionId: null,
    isDirty: false,
    isGenerating: false,
  }),
}));




