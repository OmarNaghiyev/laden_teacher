import { PT_Serif } from "next/font/google";

// PT Serif: спроектирован ParaType для кириллицы и латиницы одновременно,
// поэтому заголовки не проваливаются в системный шрифт на /ru.
export const ptSerif = PT_Serif({
  subsets: ["cyrillic", "latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-pt-serif",
  display: "swap",
});
