import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trayce Laser & Skin Care",
  description:
    "Thiệp mời sự kiện Trayce Laser & Skin Care – xác nhận tham dự và xem thông tin chương trình.",
  icons: {
    icon: "https://trayce.vn/uploaded/favicon.png",
  },
  openGraph: {
    title: "Trayce Laser & Skin Care",
    description:
      "Thiệp mời sự kiện Trayce Laser & Skin Care – xác nhận tham dự và xem thông tin chương trình.",
    images: [
      {
        url: "https://trayce.vn/temp/-uploaded_0708b64c7ed6ef1b8943b95d9dce8da2_cr_866x532.jpg",
        width: 866,
        height: 532,
        alt: "Trayce Laser & Skin Care Event",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trayce Laser & Skin Care",
    description:
      "Thiệp mời sự kiện Trayce Laser & Skin Care – xác nhận tham dự và xem thông tin chương trình.",
    images: [
      "https://trayce.vn/temp/-uploaded_0708b64c7ed6ef1b8943b95d9dce8da2_cr_866x532.jpg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
