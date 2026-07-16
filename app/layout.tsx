import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wutong9395.github.io/hldirect-global-market-map/"),
  title: "HLDIRECT 全网评价地图",
  description: "HLDIRECT 在 Amazon、Walmart、独立站、Newegg、TikTok Shop 等公开渠道的店铺链接、商品评价数、产品图片与全球覆盖。",
  openGraph: {
    title: "HLDIRECT 全网评价地图",
    description: "跨平台店铺入口、公开评价数优先榜、商品图片与世界渠道地图。",
    images: [{ url: "/hldirect-market-og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/hldirect-market-og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
