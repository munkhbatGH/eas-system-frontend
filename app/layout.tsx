import "@/styles/globals.css";
import "@/styles/main.css";

import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Head } from "next/document";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
	const isProd = process.env.NODE_ENV === 'production'
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta charSet='utf-8' />
        <link rel='icon' type='image/png' href={isProd ? `/eas-system-frontend/images/favicon.png` : '/images/favicon.png'} />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
        />
        <meta
          name='theme-color'
          content='#18181b'
          media='(prefers-color-scheme: dark)'
        />
        <meta name='theme-color' content='#f4f4f5' />
        <link rel='apple-touch-icon' href={isProd ? '/eas-system-frontend/images/icon-maskable-512.png' : '/images/icon-maskable-512.png'} />
        <link rel='manifest' href={isProd ? `/eas-system-frontend/manifest.json` : '/manifest.json'} />
      </head>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
