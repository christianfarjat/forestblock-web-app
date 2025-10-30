import localFont from "next/font/local";

export const aeonik = localFont({
  src: [
    {
      path: "../public/fonts/Aeonik/Aeonik-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Aeonik/Aeonik-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Aeonik/Aeonik-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Aeonik/Aeonik-Light.otf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-aeonik",
});

export const neueMontreal = localFont({
  src: [
    {
      path: "../public/fonts/Neue Montreal/NeueMontreal-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Neue Montreal/NeueMontreal-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Neue Montreal/NeueMontreal-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Neue Montreal/NeueMontreal-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Neue Montreal/NeueMontreal-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Neue Montreal/NeueMontreal-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-neue-montreal",
});
