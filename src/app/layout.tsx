import type { Metadata } from "next";
import { Roboto, Raleway, Poppins } from "next/font/google";
import ChatBot from "@/components/features/ChatBot";
import InquiryPopup from "@/components/features/InquiryPopup";
import WhatsAppButton from "@/components/features/WhatsAppButton";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";
import { CategoryProvider } from "@/context/CategoryContext";
import AdminToggle from "@/components/admin/AdminToggle";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "AxelGuard Brand of RealTrack Technology",
  description: "Axel-Guard specializes in MDVR systems, dashcams, vehicle cameras, and fuel sensors for fleet safety and management. Offering advanced AI-powered solutions for comprehensive vehicle security.",
  openGraph: {
    title: "AxelGuard Brand of RealTrack Technology",
    description: "Axel-Guard specializes in MDVR systems, dashcams, vehicle cameras, and fuel sensors for fleet safety and management.",
    type: "website",
    locale: "en_US",
    siteName: "AxelGuard",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${raleway.variable} ${poppins.variable} antialiased`}
      >
        <AdminProvider>
          <CategoryProvider>
            {children}
            <ChatBot />
            <InquiryPopup />
            <WhatsAppButton />
            <AdminToggle />
          </CategoryProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
