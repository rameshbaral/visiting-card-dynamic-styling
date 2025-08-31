import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FieldKey, TemplateDesign } from "../types";
import { templates, getDefaultTemplate } from "../templates";

export type SavedDesign = {
  templateId: string;
  fields: Record<FieldKey, string>;
  logo: string | null;
  name: string;
  createdAt: string;
};

interface CardStore {
  // Current state
  currentTemplateId: string;
  currentTemplate: TemplateDesign;
  fields: Record<FieldKey, string>;
  logo: string | null;

  // Actions
  setTemplate: (templateId: string) => void;
  setField: (key: FieldKey, value: string) => void;
  setLogo: (logoDataUrl: string | null) => void;
  resetFields: () => void;

  // Save/Load functionality
  savedDesigns: SavedDesign[];
  saveDesign: (name: string) => void;
  loadDesign: (name: string) => void;
  deleteDesign: (name: string) => void;
}

const getEmptyFields = (): Record<FieldKey, string> => ({
  firstName: "",
  lastName: "",
  occupation: "",
  landline: "",
  mobile: "",
  fax: "",
  address: "",
  company: "",
  email: "",
  website: "",
  logo: "",
});

export const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTemplateId: getDefaultTemplate().id,
      currentTemplate: getDefaultTemplate(),
      fields: getEmptyFields(),
      logo: null,
      savedDesigns: [],

      // Actions
      setTemplate: (templateId: string) => {
        const template = templates.find((t) => t.id === templateId);
        if (template) {
          set({
            currentTemplateId: templateId,
            currentTemplate: template,
            fields: { ...getEmptyFields(), ...template.defaults },
            logo: get().logo,
            savedDesigns: get().savedDesigns,
          });
        } else {
          console.error("Template not found:", templateId);
        }
      },

      setField: (key: FieldKey, value: string) => {
        set((state) => ({
          fields: { ...state.fields, [key]: value },
        }));
      },

      setLogo: (logoDataUrl: string | null) => {
        set({ logo: logoDataUrl });
      },

      resetFields: () => {
        const template = get().currentTemplate;
        set({ fields: { ...getEmptyFields(), ...template.defaults } });
      },

      // Save/Load functionality
      saveDesign: (name: string) => {
        const state = get();
        const design: SavedDesign = {
          templateId: state.currentTemplateId,
          fields: state.fields,
          logo: state.logo,
          name,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          savedDesigns: [
            ...state.savedDesigns.filter((d) => d.name !== name),
            design,
          ],
        }));
      },

      loadDesign: (name: string) => {
        const state = get();
        const design = state.savedDesigns.find((d) => d.name === name);
        if (design) {
          const template = templates.find((t) => t.id === design.templateId);
          set({
            currentTemplateId: design.templateId,
            currentTemplate: template || getDefaultTemplate(),
            fields: design.fields,
            logo: design.logo,
          });
        }
      },

      deleteDesign: (name: string) => {
        set((state) => ({
          savedDesigns: state.savedDesigns.filter((d) => d.name !== name),
        }));
      },
    }),
    {
      name: "card-designer-storage",
      partialize: (state) => ({
        currentTemplateId: state.currentTemplateId,
        currentTemplate: state.currentTemplate,
        fields: state.fields,
        logo: state.logo,
        savedDesigns: state.savedDesigns,
      }),
    }
  )
);
