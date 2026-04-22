import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import GoogleAnalytics from "./GoogleAnalytics";
import useScrollDepth from "./hooks/useScrollDepth";

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
  title: {
    default: "Nutriblog Hub",
    template: "%s | Nutriblog Hub",
  },
  description: "A modern nutrition blog sharing healthy food tips, diet guides, and wellness insights.",
  keywords: [
    "nutrition",
    "healthy eating",
    "diet tips",
    "food blog",
    "wellness",
    "healthy lifestyle",
    "fitness nutrition",
    "weight loss",
    "weight gain"
  ],
  authors: [{ name: "Nutriblog Team" }],
  creator: "Nutriblog hub",
  publisher: "Nutriblog hub",

  metadataBase: new URL("https://nutribloghub.com"),

  openGraph: {
    title: "Nutriblog hub",
    description: "A modern nutrition blog sharing healthy food tips and wellness insights.",
    url: "https://nutribloghub.com",
    siteName: "Nutriblog hub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nutriblog Hub preview image",
      },
    ],
    locale: "en_NG",
    type: "website",
  },

  // twitter: {
  //   card: "summary_large_image",
  //   title: "Nutriblog",
  //   description: "Healthy eating tips and nutrition guides.",
  //   images: ["/og-image.jpg"],
  //   creator: "@yourhandle",
  // },
  alternates: {
  canonical: "https://nutribloghub.com",
},

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased`}>

      <body className="min-h-screen flex flex-col font-body">

        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BB34925SVH"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BB34925SVH');
          `}
        </Script>

        <Providers>
          <GoogleAnalytics />

          <Navbar />

          <main className="flex-1">{children}</main>

          <ToastContainer position="top-right" autoClose={3000} />

          <Footer />
        </Providers>

      </body>
    </html>
  );
}