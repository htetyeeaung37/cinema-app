import Header from "@/components/layout/Header/Header";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthContext";
import Footer from "@/components/layout/Footer/Footer";

export const metadata = {
  title: "JCGV Cinema | Book Your Favorite Movies Online",
  description: "Explore the latest movies and showtimes at JCGV Cinema.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
