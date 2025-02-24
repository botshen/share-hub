export const widthMap = {
  sm: "300px",
  md: "400px",
  lg: "600px",
  xl: "800px",
} as const;
export const titleFontSizeMap = {
  xs: "20px",
  sm: "24px",
  md: "28px",
  lg: "32px",
  xl: "36px",
  "2xl": "40px",
  "3xl": "48px",
} as const;
export const postFontSizeMap = {
  xs: "12px",
  sm: "14px",
  md: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "32px",
} as const;

export type WidthSize = keyof typeof widthMap;
export type FontSize = keyof typeof postFontSizeMap;
export type TitleFontSize = keyof typeof titleFontSizeMap;
