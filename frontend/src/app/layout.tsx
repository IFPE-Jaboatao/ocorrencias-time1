import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeModeScript } from "flowbite-react";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <AuthProvider>
          <Navbar />
          <main className="pt-28 min-h-screen container mx-auto px-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

