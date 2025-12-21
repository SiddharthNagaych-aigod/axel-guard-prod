import type { Metadata } from "next";
import { Roboto, Raleway, Poppins } from "next/font/google";
import ChatBot from "@/components/features/ChatBot";
import InquiryPopup from "@/components/features/InquiryPopup";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

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
  title: "AxelGuard",
  description: "Leaders in vehicle safety systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${raleway.variable} ${poppins.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ChatBot />
          <InquiryPopup />
        </ThemeProvider>
      </body>
    </html>
  );
}
