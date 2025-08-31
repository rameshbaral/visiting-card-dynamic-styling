import blueGray from "./blueGray.json";
import modernSimple from "./modernSimple.json";
import pinkBlue from "./pinkBlue.json";
import type { TemplateDesign } from "../types";

export const templates: TemplateDesign[] = [
  blueGray as TemplateDesign,
  modernSimple as TemplateDesign,
  pinkBlue as TemplateDesign,
];

export const getTemplateById = (id: string): TemplateDesign | undefined => {
  return templates.find((template) => template.id === id);
};

export const getDefaultTemplate = (): TemplateDesign => {
  return blueGray as TemplateDesign;
};
