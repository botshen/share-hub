export const widthMap = {
  sm: "340px",
  md: "440px",
  lg: "640px",
  xl: "840px",
  full: "100%",
} as const;

export const paddingMap = {
  sm: "16px",
  md: "24px",
  lg: "32px",
  xl: "40px",
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

// {backgroundStartColor:"#99F2C8",backgroundViaColor:"#4F8F6D",backgroundEndColor:"#1F4037"} to bg-gradient-to-br from-[#99F2C8] via-[#4F8F6D] to-[#1F4037]
export const transformObjToTailwindcss = (preset: ColorPreset) => {
  const { backgroundStartColor, backgroundEndColor } = preset;
  return `bg-gradient-to-br from-[${backgroundStartColor}] to-[${backgroundEndColor}]`;
};


export type WidthSize = keyof typeof widthMap;
export type FontSize = keyof typeof postFontSizeMap;
export type TitleFontSize = keyof typeof titleFontSizeMap;

export interface ColorPreset {
  backgroundStartColor: string
  backgroundEndColor: string
}



