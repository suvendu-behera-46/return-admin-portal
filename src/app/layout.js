import { Inter } from "next/font/google";
import "./globals.css";
import MiniDrawer from "@/component/base/Layout";
import Providers from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin",
  description: "Admin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ height: "100vh" }} className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
