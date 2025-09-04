import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FieldKey, TemplateDesign } from "../types";
import { templates, getDefaultTemplate } from "../templates";

export type SavedDesign = {
  templateId: string;
  fields: Record<FieldKey, string>;
  logo: string | null;
  picture: string | null;
  name: string;
  createdAt: string;
};

interface CardStore {
  // Current state
  currentTemplateId: string;
  currentTemplate: TemplateDesign;
  fields: Record<FieldKey, string>;
  logo: string | null;
  picture: string | null;

  // Actions
  setTemplate: (templateId: string) => void;
  setField: (key: FieldKey, value: string) => void;
  setLogo: (logoDataUrl: string | null) => void;
  setPicture: (pictureDataUrl: string | null) => void;
  resetFields: () => void;

  // Template management
  customTemplates: TemplateDesign[];
  addCustomTemplate: (template: TemplateDesign) => void;
  removeCustomTemplate: (templateId: string) => void;

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
  picture: "",
});

export const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTemplateId: getDefaultTemplate().id,
      currentTemplate: getDefaultTemplate(),
      fields: getEmptyFields(),
      logo: null,
      picture: null,
      customTemplates: [],
      savedDesigns: [],

      // Actions
      setTemplate: (templateId: string) => {
        const allTemplates = [...templates, ...get().customTemplates];
        const template = allTemplates.find((t) => t.id === templateId);
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

      setPicture: (pictureDataUrl: string | null) => {
        set({ picture: pictureDataUrl });
      },

      resetFields: () => {
        const template = get().currentTemplate;
        set({
          fields: { ...getEmptyFields(), ...template.defaults },
          logo: null,
          picture: null,
        });
      },

      // Template management
      addCustomTemplate: (template: TemplateDesign) => {
        set((state) => ({
          customTemplates: [
            ...state.customTemplates.filter((t) => t.id !== template.id),
            template,
          ],
        }));
      },

      removeCustomTemplate: (templateId: string) => {
        set((state) => ({
          customTemplates: state.customTemplates.filter(
            (t) => t.id !== templateId
          ),
        }));
      },

      // Save/Load functionality
      saveDesign: (name: string) => {
        const state = get();
        const design: SavedDesign = {
          templateId: state.currentTemplateId,
          fields: state.fields,
          logo: state.logo,
          picture: state.picture,
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
            picture: design.picture || null,
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
        picture: state.picture,
        customTemplates: state.customTemplates,
        savedDesigns: state.savedDesigns,
      }),
    }
  )
);
