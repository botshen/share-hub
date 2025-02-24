export const widthMap = {
  sm: "340px",
  md: "440px",
  lg: "640px",
  xl: "840px",
} as const;

export const paddingMap = {
  sm: "p-4",
  md: "p-8",
  lg: "p-12",
  xl: "p-16",
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
export const themeMapClassName = {
  //gradient
  blue: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-500',
  pink: 'bg-gradient-to-br from-[#FF7DB4] to-[#654EA3]',
  purple: 'bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0]',
  green: 'bg-gradient-to-br from-[#99F2C8] to-[#1F4037]',
  yellow: 'bg-gradient-to-br from-[#F5AF19] to-[#F12711]',
  gray: 'bg-gradient-to-br from-[#5C5C5C] to-[#0F1015]',
  red: 'bg-gradient-to-r from-[#DD1818] to-[#380202]',
  indigo: 'bg-gradient-to-br from-[#A8C0FF] to-[#3F2B96]',
  //radial gradients
  radial1: 'bg-radial from-[#695BF8] to-[#131308]',
  radial2: 'bg-radial from-[#4d4d4d] to-[#000000]',
  radial3: 'bg-radial from-[#f5af19] to-[#f12711]',
  radial4: 'bg-radial from-[#1D6E47] to-[#041B11]',
  radial5: 'bg-radial from-[#ffffff] to-[#666666]',
  radial6: 'bg-radial from-[#d9f1f8] to-[#002069]',
  radial7: 'bg-radial from-[#f95356] to-[#7e0000]',
  radial8: 'bg-radial from-[#ffbb00] to-[#ffe74b]',
}
export type WidthSize = keyof typeof widthMap;
export type FontSize = keyof typeof postFontSizeMap;
export type TitleFontSize = keyof typeof titleFontSizeMap;

export interface ColorPreset {
  backgroundFillType: 'Linear' | 'Radial'
  backgroundStartColor: string
  backgroundEndColor: string
  backgroundAngle?: number
}


export const presets: ColorPreset[] = [
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#FF7DB4",
    backgroundEndColor: "#654EA3",
    backgroundAngle: 45,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#8E2DE2",
    backgroundEndColor: "#4A00E0",
    backgroundAngle: 45,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#99F2C8",
    backgroundEndColor: "#1F4037",
    backgroundAngle: 45,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#F953C6",
    backgroundEndColor: "#B91D73",
    backgroundAngle: 45,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#91EAE4",
    backgroundEndColor: "#7F7FD5",
    backgroundAngle: 45,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#F5AF19",
    backgroundEndColor: "#F12711",
    backgroundAngle: 45,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#EAAFC8",
    backgroundEndColor: "#EC2F4B",
    backgroundAngle: 45,
  },

  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#00B4DB",
    backgroundEndColor: "#003357",
    backgroundAngle: 45,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#A8C0FF",
    backgroundEndColor: "#3F2B96",
    backgroundAngle: 90,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#DD1818",
    backgroundEndColor: "#380202",
    backgroundAngle: 135,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#DECBA4",
    backgroundEndColor: "#3E5151",
    backgroundAngle: 45,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#FC466B",
    backgroundEndColor: "#3F5EFB",
    backgroundAngle: 180,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#CCCFE2",
    backgroundEndColor: "#25242B",
    backgroundAngle: 180,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#68AEFF",
    backgroundEndColor: "#003EB7",
    backgroundAngle: 180,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#C9D6FF",
    backgroundEndColor: "#596AA1",
    backgroundAngle: 180,
  },
  {
    backgroundFillType: "Linear",
    backgroundStartColor: "#5C5C5C",
    backgroundEndColor: "#0F1015",
    backgroundAngle: 180,
  },
  {
    backgroundFillType: "Radial",
    backgroundStartColor: "#695BF8",
    backgroundEndColor: "#131308",
    backgroundPosition: "50%,0%",
  },
  {
    backgroundFillType: "Radial",
    backgroundStartColor: "#4d4d4d",
    backgroundEndColor: "#000000",
    backgroundPosition: "50%,0%",
  },
  {
    backgroundFillType: "Radial",
    backgroundStartColor: "#f5af19",
    backgroundEndColor: "#f12711",
    backgroundPosition: "50%,50%",
  },
  {
    backgroundFillType: "Radial",
    backgroundStartColor: "#1D6E47",
    backgroundEndColor: "#041B11",
    backgroundPosition: "50%,0%",
  },
  {
    backgroundFillType: "Radial",
    backgroundStartColor: "#ffffff",
    backgroundEndColor: "#666666",
    backgroundPosition: "50%,100%",
  },
  {
    backgroundFillType: "Radial",
    backgroundStartColor: "#d9f1f8",
    backgroundEndColor: "#002069",
    backgroundPosition: "50%,100%",
  },
  {
    backgroundFillType: "Radial",
    backgroundStartColor: "#f95356",
    backgroundEndColor: "#7e0000",
    backgroundPosition: "50%,50%",
  },
  {
    backgroundFillType: "Radial",
    backgroundStartColor: "#ffbb00",
    backgroundEndColor: "#ffe74b",
    backgroundPosition: "50%,0%",
  },
];

// 一个函数，转换 
// {
//     backgroundFillType: "Radial",
//     backgroundStartColor: "#ffbb00",
//     backgroundEndColor: "#ffe74b",
//     backgroundPosition: "50%,0%",
//   },
//   {
//     backgroundFillType: "Linear",
//     backgroundStartColor: "#DECBA4",
//     backgroundEndColor: "#3E5151",
//     backgroundAngle: 45,
//   },
// 为上述对象转换为 tailwindcss 的 className
export const transformPresetToTailwindcssClassName = (preset: ColorPreset) => {
  if (preset.backgroundFillType === 'Linear') {
    // 根据角度确定方向
    const direction = getGradientDirection(preset.backgroundAngle || 0);
    return `bg-gradient-to-${direction} from-[${preset.backgroundStartColor}] to-[${preset.backgroundEndColor}]`;
  } else {
    // Radial gradient
    return `bg-radial from-[${preset.backgroundStartColor}] to-[${preset.backgroundEndColor}]`;
  }
};

function getGradientDirection(angle: number): string {
  // 将角度映射到 Tailwind 的方向
  const directions: Record<number, string> = {
    0: 'r',    // right
    45: 'br',  // bottom-right
    90: 'b',   // bottom
    135: 'bl', // bottom-left
    180: 'l',  // left
    225: 'tl', // top-left
    270: 't',  // top
    315: 'tr'  // top-right
  };

  // 将角度规范化到 0-360 范围内
  const normalizedAngle = ((angle % 360) + 360) % 360;
  // 找到最接近的方向
  const closestAngle = Object.keys(directions)
    .map(Number)
    .reduce((a, b) => {
      return Math.abs(b - normalizedAngle) < Math.abs(a - normalizedAngle) ? b : a;
    });

  return directions[closestAngle];
}
