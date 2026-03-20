import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppApolloProvider } from "@/shared/providers/apollo-provider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EBMS",
  description: "Employee Benefits Management System",
  icons: {
    icon: "/icon.svg",
  },
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider
          appearance={{
            cssLayerName: "clerk",
          }}
          publishableKey={clerkPublishableKey}
        >
          <AppApolloProvider>{children}</AppApolloProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
