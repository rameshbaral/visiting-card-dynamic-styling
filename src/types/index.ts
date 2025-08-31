export type FieldKey =
  | "firstName"
  | "lastName"
  | "occupation"
  | "landline"
  | "mobile"
  | "fax"
  | "address"
  | "company"
  | "email"
  | "website"
  | "logo";

export type BoundingBox = { x: number; y: number; w: number; h: number }; // pixels on a 1050x600 canvas

export type TextStyle = {
  fontFamily: string;
  fontSize: number;
  weight?: number | "bold";
  color: string;
  letterSpacing?: number;
  lineHeight?: number;
  align?: "left" | "center" | "right";
  uppercase?: boolean;
  opacity?: number;
};

export type FieldSpec = {
  key: FieldKey;
  label?: string;
  box: BoundingBox;
  style: TextStyle;
  placeholder?: string;
};

export type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      w: number;
      h: number;
      fill: string;
      radius?: number;
    }
  | { type: "polygon"; points: Array<{ x: number; y: number }>; fill: string }
  | {
      type: "image";
      path: string;
      x: number;
      y: number;
      w: number;
      h: number;
      fit?: "cover" | "contain";
      radius?: number;
    }
  | {
      type: "dashedRect";
      x: number;
      y: number;
      w: number;
      h: number;
      stroke: string;
      dash: number[];
      radius?: number;
    };

export type TemplateDesign = {
  id: string;
  name: string;
  size: { width: number; height: number };
  background: { color?: string } | null;
  shapes: Shape[];
  fields: FieldSpec[];
  defaults?: Partial<Record<FieldKey, string>>;
  previewThumb?: string; // optional, can be generated
};
