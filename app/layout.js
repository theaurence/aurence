import "./globals.css";
import NavbarWrapper from "../components/NavbarWrapper";

export const metadata = {
  title: "Aurence",
  description: "Find collabs. Grow together.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <NavbarWrapper />  {/* ✅ Conditional Navbar */}
        {children}
      </body>
    </html>
  );
}
