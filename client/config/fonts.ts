import localFont from "next/font/local";

export const sfLight = localFont({
  src: "../public/fonts/SFArabic-Light.ttf",
  variable: "--font-sflight",
});
export const sfMed = localFont({
  src: "../public/fonts/SFArabic-Medium.ttf",
  variable: "--font-sfmed",
});
export const sfBold = localFont({
  src: "../public/fonts/SFArabic-Semibold.ttf",
  variable: "--font-sfbold",
});

export const sfProBold = localFont({
  src: "../public/fonts/SF-Pro-Rounded-Black.otf",
  variable: "--font-sfbold",
});
