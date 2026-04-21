import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

export const metadata = {
  title: "Nutriblog",
  description: "A modern nutrition blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-body">
        <Providers>
          <Navbar />

          <main className="flex-1">{children}</main>

          <ToastContainer position="top-right" autoClose={3000} />

          <Footer />
        </Providers>
      </body>
    </html>
  );
}