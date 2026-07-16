import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wutong9395.github.io/hldirect-global-market-map/"),
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
  return <html lang="zh-CN"><body>{children}</body></html>;
}
