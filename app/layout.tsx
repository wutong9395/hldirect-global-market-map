import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HLDIRECT 全网销售地图",
  description: "HLDIRECT 在 Amazon、Walmart、独立站、Newegg、TikTok Shop 等公开渠道的店铺链接与热销商品信号。",
  openGraph: {
    title: "HLDIRECT 全网销售地图",
    description: "跨平台店铺入口、公开需求信号榜与品类变化。",
    images: [{ url: "/hldirect-market-og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/hldirect-market-og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
