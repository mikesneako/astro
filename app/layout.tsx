import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { config, symbol } from "@/config";
import "./globals.css";
import "./orbit.css";

const title = `${config.brand.name} (${symbol}) — A new orbit`;
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: config.site.background };
export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  title,
  description: config.site.description,
  icons: { icon: config.brand.favicon, apple: config.brand.logo || config.brand.favicon },
  openGraph: { title, description: config.site.description, siteName: config.brand.name, url: config.site.url, images: [config.site.shareImage], type: "website" },
  twitter: { card: "summary_large_image", title, description: config.site.description, images: [config.site.shareImage] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" style={{ "--accent": config.site.accent, "--background": config.site.background, "--ink": config.site.ink, "--secondary": config.site.secondary, "--pink": config.site.pink } as CSSProperties}><body>{children}</body></html>;
}
