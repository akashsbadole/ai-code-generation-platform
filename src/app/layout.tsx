import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Code Generation Platform",
  description: "Modern AI-powered code generation platform with real-time collaboration, advanced editing features, and intelligent optimizations.",
  keywords: ["AI", "Code Generation", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Monaco Editor", "Collaboration"],
  authors: [{ name: "AI Platform Team" }],
  openGraph: {
    title: "AI Code Generation Platform",
    description: "AI-powered code generation with modern development tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Code Generation Platform",
    description: "AI-powered code generation with modern development tools",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
