"use client";

import { useMemo, useState } from "react";

type Category = "游戏桌" | "游戏椅" | "泳池浮具" | "边桌" | "其他";

type Product = {
  rank: number;
  title: string;
  category: Category;
  url: string;
  signal: string;
  asin?: string;
};

type Channel = {
  id: string;
  name: string;
  region: string;
  url: string;
  type: string;
  evidence: "强" | "中" | "有限";
  method: string;
  products: Product[];
};

const amazon = (domain: string, asin: string) => `https://${domain}/dp/${asin}`;

const channels: Channel[] = [
  {
    id: "amazon-us",
    name: "Amazon 美国",
    region: "US",
    url: "https://www.amazon.com/stores/HLDIRECT/page/3879C02E-4AF1-4D11-A2D8-DA3734361877",
    type: "品牌旗舰店",
    evidence: "强",
    method: "品牌结果页按 Best Sellers 排序；剔除广告位",
    products: [
      { rank: 1, title: "充气泳池躺椅｜杯架 + 头枕", category: "泳池浮具", asin: "B0GKFHPWBQ", url: amazon("www.amazon.com", "B0GKFHPWBQ"), signal: "公开畅销排序 #1" },
      { rank: 2, title: "40 英寸 LED 游戏桌", category: "游戏桌", asin: "B0DDK8RYT9", url: amazon("www.amazon.com", "B0DDK8RYT9"), signal: "公开畅销排序 #2" },
      { rank: 3, title: "双人漂流浮床｜冷藏区 + 靠背", category: "泳池浮具", asin: "B0GKGGL6GX", url: amazon("www.amazon.com", "B0GKGGL6GX"), signal: "公开畅销排序 #3" },
      { rank: 4, title: "晒太阳充气泳池躺椅", category: "泳池浮具", asin: "B0GKFQSTZ8", url: amazon("www.amazon.com", "B0GKFQSTZ8"), signal: "公开畅销排序 #4" },
      { rank: 5, title: "47 英寸 RGB 游戏桌", category: "游戏桌", asin: "B0B3DSSSFQ", url: amazon("www.amazon.com", "B0B3DSSSFQ"), signal: "公开畅销排序 #5" },
      { rank: 6, title: "人体工学游戏椅｜黑色", category: "游戏椅", asin: "B0FF4PTWKF", url: amazon("www.amazon.com", "B0FF4PTWKF"), signal: "公开畅销排序 #6" },
      { rank: 7, title: "47 英寸理线游戏桌", category: "游戏桌", asin: "B0DK15L2B4", url: amazon("www.amazon.com", "B0DK15L2B4"), signal: "公开畅销排序 #7" },
      { rank: 8, title: "C 型充电边桌", category: "边桌", asin: "B0FD3MZBPP", url: amazon("www.amazon.com", "B0FD3MZBPP"), signal: "公开畅销排序 #8" },
    ],
  },
  {
    id: "amazon-ca",
    name: "Amazon 加拿大",
    region: "CA",
    url: "https://www.amazon.ca/stores/HLDIRECT/page/A0890835-DFEE-44B1-870F-57BD38991DC2",
    type: "品牌旗舰店",
    evidence: "强",
    method: "品牌结果页按 Best Sellers 排序；剔除广告位",
    products: [
      { rank: 1, title: "47 英寸 LED 游戏桌", category: "游戏桌", asin: "B0BSGKRK7P", url: amazon("www.amazon.ca", "B0BSGKRK7P"), signal: "公开畅销排序 #1" },
      { rank: 2, title: "47 英寸 RGB 游戏桌", category: "游戏桌", asin: "B0B3DSSSFQ", url: amazon("www.amazon.ca", "B0B3DSSSFQ"), signal: "公开畅销排序 #2" },
      { rank: 3, title: "47 英寸 LED / 插座 / 显示器架游戏桌", category: "游戏桌", asin: "B0DJLSYC22", url: amazon("www.amazon.ca", "B0DJLSYC22"), signal: "公开畅销排序 #3" },
      { rank: 4, title: "55 英寸碳纤维纹游戏桌", category: "游戏桌", asin: "B0BV2PWM3J", url: amazon("www.amazon.ca", "B0BV2PWM3J"), signal: "公开畅销排序 #4" },
      { rank: 5, title: "55 英寸 L 型桌｜3 抽屉", category: "游戏桌", asin: "B0FPC54S4F", url: amazon("www.amazon.ca", "B0FPC54S4F"), signal: "公开畅销排序 #5" },
      { rank: 6, title: "55 英寸电动升降游戏桌", category: "游戏桌", asin: "B0GHLJGLGB", url: amazon("www.amazon.ca", "B0GHLJGLGB"), signal: "公开畅销排序 #6" },
      { rank: 7, title: "人体工学游戏椅", category: "游戏椅", asin: "B0FF4X1PCX", url: amazon("www.amazon.ca", "B0FF4X1PCX"), signal: "公开畅销排序 #7" },
      { rank: 8, title: "折叠 C 型充电边桌", category: "边桌", asin: "B0FPC7RHYK", url: amazon("www.amazon.ca", "B0FPC7RHYK"), signal: "公开畅销排序 #8" },
    ],
  },
  {
    id: "amazon-mx",
    name: "Amazon 墨西哥",
    region: "MX",
    url: "https://www.amazon.com.mx/s?k=HLDIRECT&s=exact-aware-popularity-rank",
    type: "品牌结果页",
    evidence: "强",
    method: "品牌结果页按 Best Sellers 排序；无独立旗舰店",
    products: [
      { rank: 1, title: "40 英寸 LED 游戏桌", category: "游戏桌", asin: "B0DDK8RYT9", url: amazon("www.amazon.com.mx", "B0DDK8RYT9"), signal: "公开畅销排序 #1" },
      { rank: 2, title: "47 英寸理线游戏桌", category: "游戏桌", asin: "B0DK15L2B4", url: amazon("www.amazon.com.mx", "B0DK15L2B4"), signal: "公开畅销排序 #2" },
      { rank: 3, title: "按摩腰枕游戏椅", category: "游戏椅", asin: "B0FF4TCZBD", url: amazon("www.amazon.com.mx", "B0FF4TCZBD"), signal: "公开畅销排序 #3" },
      { rank: 4, title: "充气晒太阳泳池躺椅", category: "泳池浮具", asin: "B0GKFGQGGW", url: amazon("www.amazon.com.mx", "B0GKFGQGGW"), signal: "公开畅销排序 #4" },
      { rank: 5, title: "47 英寸 8 抽屉 LED / 插座桌", category: "游戏桌", asin: "B0GXTW6S14", url: amazon("www.amazon.com.mx", "B0GXTW6S14"), signal: "公开畅销排序 #5" },
      { rank: 6, title: "55 英寸 3 布抽屉 / LED / 层架桌", category: "游戏桌", asin: "B0GPPP1CTR", url: amazon("www.amazon.com.mx", "B0GPPP1CTR"), signal: "公开畅销排序 #6" },
      { rank: 7, title: "47 英寸 LED 游戏桌", category: "游戏桌", asin: "B0BSGKRK7P", url: amazon("www.amazon.com.mx", "B0BSGKRK7P"), signal: "公开畅销排序 #7" },
      { rank: 8, title: "63 英寸 RGB 游戏桌", category: "游戏桌", asin: "B0BMXB13TR", url: amazon("www.amazon.com.mx", "B0BMXB13TR"), signal: "公开畅销排序 #8" },
    ],
  },
  {
    id: "amazon-jp",
    name: "Amazon 日本",
    region: "JP",
    url: "https://www.amazon.co.jp/s?k=HLDIRECT&s=exact-aware-popularity-rank",
    type: "品牌结果页",
    evidence: "强",
    method: "品牌结果页按 Best Sellers 排序；无独立旗舰店",
    products: [
      { rank: 1, title: "47 英寸 6 抽屉电脑桌｜棕色", category: "游戏桌", asin: "B0GRFZF32C", url: amazon("www.amazon.co.jp", "B0GRFZF32C"), signal: "公开畅销排序 #1" },
      { rank: 2, title: "电动升降桌", category: "游戏桌", asin: "B0H25GFRQ8", url: amazon("www.amazon.co.jp", "B0H25GFRQ8"), signal: "公开畅销排序 #2" },
      { rank: 3, title: "晒太阳泳池躺椅｜绿色", category: "泳池浮具", asin: "B0GKFG61KS", url: amazon("www.amazon.co.jp", "B0GKFG61KS"), signal: "公开畅销排序 #3" },
      { rank: 4, title: "人体工学游戏椅", category: "游戏椅", asin: "B0FF4PTWKF", url: amazon("www.amazon.co.jp", "B0FF4PTWKF"), signal: "公开畅销排序 #4" },
      { rank: 5, title: "C 型充电边桌｜白色", category: "边桌", asin: "B0FD3L5NXH", url: amazon("www.amazon.co.jp", "B0FD3L5NXH"), signal: "公开畅销排序 #5" },
      { rank: 6, title: "双人漂流浮圈", category: "泳池浮具", asin: "B0GKFM1JN8", url: amazon("www.amazon.co.jp", "B0GKFM1JN8"), signal: "公开畅销排序 #6" },
      { rank: 7, title: "带冷藏区 / 杯架漂流浮圈", category: "泳池浮具", asin: "B0GKG7LVFW", url: amazon("www.amazon.co.jp", "B0GKG7LVFW"), signal: "公开畅销排序 #7" },
      { rank: 8, title: "双人泳池浮床", category: "泳池浮具", asin: "B0GKG27KB5", url: amazon("www.amazon.co.jp", "B0GKG27KB5"), signal: "公开畅销排序 #8" },
    ],
  },
  {
    id: "walmart",
    name: "Walmart",
    region: "US",
    url: "https://www.walmart.com/brand/hldirect/10044222",
    type: "品牌页",
    evidence: "中",
    method: "按公开评分数排序；销量数字未公开，变体可能共享评论",
    products: [
      { rank: 1, title: "55 英寸 LED 游戏桌｜白色", category: "游戏桌", url: "https://www.walmart.com/ip/18581707234", signal: "333 条评分 · Best seller" },
      { rank: 2, title: "32 英寸游戏桌", category: "游戏桌", url: "https://www.walmart.com/ip/11670058479", signal: "262 条评分" },
      { rank: 3, title: "40 英寸碳纤维纹游戏桌", category: "游戏桌", url: "https://www.walmart.com/ip/11906505249", signal: "258 条评分" },
      { rank: 4, title: "55 英寸 LED 游戏桌｜黑色", category: "游戏桌", url: "https://www.walmart.com/ip/3477756251", signal: "156 条评分" },
      { rank: 5, title: "63 英寸 LED 游戏桌｜黑色", category: "游戏桌", url: "https://www.walmart.com/ip/11894063774", signal: "156 条评分" },
      { rank: 6, title: "55 英寸 LED / 插座 / 显示器架桌", category: "游戏桌", url: "https://www.walmart.com/ip/15144853968", signal: "136 条评分" },
      { rank: 7, title: "47 英寸 8 抽屉 LED / USB 桌", category: "游戏桌", url: "https://www.walmart.com/ip/17010500236", signal: "61 条评分" },
      { rank: 8, title: "51 英寸 L 型 LED / 显示器架桌", category: "游戏桌", url: "https://www.walmart.com/ip/15434210439", signal: "38 条评分" },
    ],
  },
  {
    id: "direct",
    name: "HLDIRECT 直营站",
    region: "Global / US",
    url: "https://hldirect.co/",
    type: "独立站",
    evidence: "中",
    method: "按官网合集公开陈列顺序；并非销量榜",
    products: [
      { rank: 1, title: "袋装弹簧坐垫游戏椅｜黑色", category: "游戏椅", url: "https://hldirect.co/collections/chairs", signal: "椅类合集陈列 #1 · $79.99 起" },
      { rank: 2, title: "袋装弹簧坐垫游戏椅｜黑蓝", category: "游戏椅", url: "https://hldirect.co/collections/chairs", signal: "椅类合集陈列 #2 · $78.99 起" },
      { rank: 3, title: "袋装弹簧坐垫游戏椅｜黑灰", category: "游戏椅", url: "https://hldirect.co/collections/chairs", signal: "椅类合集陈列 #3 · $78.99 起" },
      { rank: 4, title: "可调靠背办公椅", category: "游戏椅", url: "https://hldirect.co/collections/chairs", signal: "椅类合集陈列 #4 · $84.99 起" },
      { rank: 5, title: "袋装弹簧坐垫游戏椅｜黑红", category: "游戏椅", url: "https://hldirect.co/collections/chairs", signal: "椅类合集陈列 #5 · $79.99 起" },
      { rank: 6, title: "游戏椅｜白黑", category: "游戏椅", url: "https://hldirect.co/collections/chairs", signal: "椅类合集陈列 #6 · $78.99 起" },
      { rank: 7, title: "游戏椅｜黑绿", category: "游戏椅", url: "https://hldirect.co/collections/chairs", signal: "椅类合集陈列 #7 · $78.99 起" },
      { rank: 8, title: "袋装弹簧坐垫游戏椅｜黑色变体", category: "游戏椅", url: "https://hldirect.co/collections/chairs", signal: "椅类合集陈列 #8 · $78.99 起" },
    ],
  },
  {
    id: "newegg",
    name: "Newegg",
    region: "US",
    url: "https://www.newegg.com/p/pl?d=HLDIRECT&Order=3",
    type: "品牌搜索页",
    evidence: "中",
    method: "按 Best Selling 页面公开顺序；未公开销量或评论量",
    products: [
      { rank: 1, title: "55 英寸 LED 人体工学游戏桌｜黑色", category: "游戏桌", url: "https://www.newegg.com/p/pl?d=HLDIRECT&Order=3", signal: "Best Selling 页面顺序 #1" },
      { rank: 2, title: "55 英寸 LED 人体工学游戏桌｜白色", category: "游戏桌", url: "https://www.newegg.com/p/pl?d=HLDIRECT&Order=3", signal: "Best Selling 页面顺序 #2" },
      { rank: 3, title: "55 英寸电动升降游戏桌", category: "游戏桌", url: "https://www.newegg.com/p/3EA-00C2-00012?item=9SIC5TJKZ75212", signal: "Best Selling 页面顺序 #3" },
      { rank: 4, title: "55 英寸 Z 型 LED 游戏桌", category: "游戏桌", url: "https://www.newegg.com/p/pl?d=HLDIRECT&Order=3", signal: "Best Selling 页面顺序 #4" },
      { rank: 5, title: "55 英寸 5 插座 / LED / 显示器架桌", category: "游戏桌", url: "https://www.newegg.com/p/pl?d=HLDIRECT&Order=3", signal: "Best Selling 页面顺序 #5" },
      { rank: 6, title: "55 英寸 LED 游戏桌｜另一变体", category: "游戏桌", url: "https://www.newegg.com/p/pl?d=HLDIRECT&Order=3", signal: "Best Selling 页面顺序 #6" },
      { rank: 7, title: "40 英寸理线游戏桌", category: "游戏桌", url: "https://www.newegg.com/p/pl?d=HLDIRECT&Order=3", signal: "Best Selling 页面顺序 #7" },
      { rank: 8, title: "40 英寸 LED 游戏桌", category: "游戏桌", url: "https://www.newegg.com/p/pl?d=HLDIRECT&Order=3", signal: "Best Selling 页面顺序 #8" },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok Shop",
    region: "US",
    url: "https://shop.tiktok.com/us/search?q=HLDIRECT",
    type: "商城搜索 / 商品页",
    evidence: "中",
    method: "按可核验商品页的公开销量 / 评价信号；当前仅足够确认 4 款",
    products: [
      { rank: 1, title: "人体工学布艺游戏椅", category: "游戏椅", url: "https://shop.tiktok.com/us/search?q=HLDIRECT%20gaming%20chair", signal: "公开页显示约 90 sold · 4.4" },
      { rank: 2, title: "人体工学游戏椅｜腰枕 + 脚托", category: "游戏椅", url: "https://shop.tiktok.com/us/pdp/hldirect-ergonomic-gaming-chair-lumbar-footrest-200lbs/1732317301233390445", signal: "4.3 · 59 条全球评价" },
      { rank: 3, title: "55 英寸插座 / 3 布抽屉游戏桌", category: "游戏桌", url: "https://shop.tiktok.com/us/search?q=HLDIRECT%2055%20inch%20desk", signal: "公开页显示 23 sold · 3.5" },
      { rank: 4, title: "47 英寸 6 抽屉电脑桌", category: "游戏桌", url: "https://shop.tiktok.com/us/search?q=HLDIRECT%2047%20inch%20desk", signal: "已核验商品页，销量未公开" },
    ],
  },
  {
    id: "wayfair",
    name: "Wayfair",
    region: "US",
    url: "https://www.wayfair.com/furniture/pdp/hldirect-gaming-chair-with-pocket-spring-cushion-video-game-chair-gaming-computer-chair-ergonomic-chairs-with-massage-lumbar-support-for-adults-swivel-pu-leather-office-chair-hdir1016.html",
    type: "单品上架",
    evidence: "有限",
    method: "当前仅核验到 1 个可访问商品页，不能构成 Top 8",
    products: [
      { rank: 1, title: "高背袋装弹簧坐垫游戏椅｜HDIR1016", category: "游戏椅", url: "https://www.wayfair.com/furniture/pdp/hldirect-gaming-chair-with-pocket-spring-cushion-video-game-chair-gaming-computer-chair-ergonomic-chairs-with-massage-lumbar-support-for-adults-swivel-pu-leather-office-chair-hdir1016.html", signal: "4.5 · 87 条评价 · $98.99" },
    ],
  },
  {
    id: "ebay",
    name: "eBay",
    region: "US",
    url: "https://www.ebay.com/sch/i.html?_nkw=HLDIRECT&_sop=13",
    type: "转售市场",
    evidence: "有限",
    method: "非品牌官方店；当前仅保留已核验的公开转售商品",
    products: [
      { rank: 1, title: "47 英寸 LED / 插座游戏桌｜二手", category: "游戏桌", url: "https://www.ebay.com/itm/127185499963", signal: "转售商品 · $87.34" },
    ],
  },
  {
    id: "ubuy",
    name: "Ubuy 全球进口",
    region: "UK / Global",
    url: "https://www.u-buy.co.uk/product/MXMZ0LRDC-hldirect-gaming-chair-ergonomic-video-game-seat-with-360-swivel-lumbar-massage-computer-chair-pu-leather-cushion-for-adults-home-office-use",
    type: "跨境导购 / 进口",
    evidence: "有限",
    method: "进口镜像，不视为官方店；仅用于确认跨境可见性",
    products: [
      { rank: 1, title: "360° 旋转按摩腰枕游戏椅", category: "游戏椅", url: "https://www.u-buy.co.uk/product/MXMZ0LRDC-hldirect-gaming-chair-ergonomic-video-game-seat-with-360-swivel-lumbar-massage-computer-chair-pu-leather-cushion-for-adults-home-office-use", signal: "英国进口商品页" },
    ],
  },
];

const categories = ["全部", "游戏桌", "游戏椅", "泳池浮具", "边桌"] as const;

export default function Home() {
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("全部");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const totalProducts = channels.reduce((sum, channel) => sum + channel.products.length, 0);

  const visibleChannels = useMemo(() => {
    const search = query.trim().toLowerCase();
    return channels
      .filter((channel) => selectedChannel === "all" || channel.id === selectedChannel)
      .map((channel) => ({
        ...channel,
        products: channel.products.filter((product) => {
          const categoryMatch = selectedCategory === "全部" || product.category === selectedCategory;
          const searchMatch = !search || `${product.title} ${product.asin ?? ""} ${channel.name}`.toLowerCase().includes(search);
          return categoryMatch && searchMatch;
        }),
      }))
      .filter((channel) => channel.products.length > 0);
  }, [query, selectedCategory, selectedChannel]);

  const copyShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "HLDIRECT 全网销售地图", url: window.location.href });
        return;
      } catch {
        // The user may cancel the native share dialog; fall through to copy.
      }
    }
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="回到顶部">HL<span>DIRECT</span></a>
        <nav aria-label="页面导航">
          <a href="#channels">渠道</a>
          <a href="#products">商品榜</a>
          <a href="#method">方法</a>
        </nav>
        <button className="shareButton" onClick={copyShareLink}>{copied ? "链接已复制" : "分享报告 ↗"}</button>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span>Market Map 01</span><span>更新于 2026-07-16</span></div>
        <h1>HLDIRECT<br /><em>全网销售地图</em></h1>
        <div className="heroGrid">
          <div className="thesis">
            <p className="thesisLabel">核心发现</p>
            <p>品牌已从“游戏桌椅”延伸到<strong>泳池浮具与充电边桌</strong>；美国站的公开畅销排序中，泳池浮具占据前四名中的三席。</p>
          </div>
          <div className="heroNote">
            <span>范围</span>
            <p>Amazon、独立站、Walmart、Newegg、TikTok Shop、Wayfair、eBay 与跨境进口页。</p>
          </div>
        </div>
        <div className="metrics">
          <div><strong>{channels.length}</strong><span>个可验证站点 / 渠道</span></div>
          <div><strong>{totalProducts}</strong><span>条商品记录</span></div>
          <div><strong>4</strong><span>个 Amazon 地区榜单</span></div>
          <div><strong>2</strong><span>个容易被忽略的新品类</span></div>
        </div>
      </section>

      <section className="section" id="channels">
        <div className="sectionHead">
          <div><span className="sectionNo">01</span><h2>渠道地图</h2></div>
          <p>点击卡片直达店铺或品牌结果页。证据“强”代表存在可重复的公开排序；“有限”代表仅核验到部分商品。</p>
        </div>
        <div className="channelGrid">
          {channels.map((channel) => (
            <a key={channel.id} className="channelCard" href={channel.url} target="_blank" rel="noreferrer">
              <div className="channelCardTop"><span>{channel.region}</span><span className={`evidence ${channel.evidence}`}>{channel.evidence}证据</span></div>
              <h3>{channel.name}</h3>
              <p>{channel.type}</p>
              <div className="channelFoot"><span>{channel.products.length >= 8 ? "Top 8 已整理" : `已核验 ${channel.products.length} 款`}</span><span>↗</span></div>
            </a>
          ))}
        </div>
        <div className="secondaryLinks">
          <span>品牌信息站</span>
          <a href="https://www.thehldirect.com/" target="_blank" rel="noreferrer">thehldirect.com ↗</a>
          <a href="https://hldirects.com/" target="_blank" rel="noreferrer">hldirects.com ↗</a>
          <span className="caveat">后者来源归属不如直营站清晰，故仅作补充入口。</span>
        </div>
      </section>

      <section className="section productsSection" id="products">
        <div className="sectionHead">
          <div><span className="sectionNo">02</span><h2>公开需求信号榜</h2></div>
          <p>“销量最高”按各平台能公开验证的最近似信号定义；并不等同于品牌后台真实销量。</p>
        </div>

        <div className="filterPanel">
          <div className="channelPills" aria-label="站点筛选">
            <button className={selectedChannel === "all" ? "active" : ""} onClick={() => setSelectedChannel("all")}>全部站点</button>
            {channels.map((channel) => <button key={channel.id} className={selectedChannel === channel.id ? "active" : ""} onClick={() => setSelectedChannel(channel.id)}>{channel.name}</button>)}
          </div>
          <div className="filterRow">
            <label className="searchBox"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索商品、ASIN 或站点" /></label>
            <div className="categoryPills" aria-label="品类筛选">
              {categories.map((category) => <button key={category} className={selectedCategory === category ? "active" : ""} onClick={() => setSelectedCategory(category)}>{category}</button>)}
            </div>
          </div>
        </div>

        <div className="resultMeta"><span>显示 {visibleChannels.reduce((sum, channel) => sum + channel.products.length, 0)} 条结果</span><span>泳池浮具与边桌已纳入 ✓</span></div>

        <div className="tables">
          {visibleChannels.map((channel) => (
            <article className="rankTable" key={channel.id}>
              <div className="tableHead">
                <div><span>{channel.region}</span><h3>{channel.name}</h3></div>
                <div><p>{channel.method}</p><a href={channel.url} target="_blank" rel="noreferrer">访问店铺 / 结果页 ↗</a></div>
              </div>
              <div className="rows">
                {channel.products.map((product) => (
                  <a className="productRow" href={product.url} target="_blank" rel="noreferrer" key={`${channel.id}-${product.rank}-${product.title}`}>
                    <span className="rank">{String(product.rank).padStart(2, "0")}</span>
                    <span className="productName"><strong>{product.title}</strong>{product.asin && <small>ASIN {product.asin}</small>}</span>
                    <span className={`category category-${product.category}`}>{product.category}</span>
                    <span className="signal">{product.signal}</span>
                    <span className="out">↗</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
          {visibleChannels.length === 0 && <div className="empty">没有匹配的商品。试试清空搜索或切换品类。</div>}
        </div>
      </section>

      <section className="insightBand">
        <div><span>Category Shift</span><h2>不要再把 HLDIRECT 只看作游戏家具品牌。</h2></div>
        <p>Amazon 美国和日本的前列商品显示，季节性泳池浮具已成为重要流量入口；C 型充电边桌则在美国、加拿大和日本均进入公开前列。</p>
      </section>

      <section className="section methodSection" id="method">
        <div className="sectionHead">
          <div><span className="sectionNo">03</span><h2>口径与限制</h2></div>
          <p>本页面是公开网页快照，不接触品牌卖家后台、广告后台或第三方付费销量数据库。</p>
        </div>
        <div className="methodGrid">
          <div><span>01</span><h3>先用原生销量信号</h3><p>平台公开 sold 数、Best Seller 标识或 Best Selling 排序优先。</p></div>
          <div><span>02</span><h3>再用需求代理</h3><p>无销量时采用评论量、品牌结果页排序或合集陈列顺序，并明确标注。</p></div>
          <div><span>03</span><h3>不把转售当官方</h3><p>eBay、Ubuy 等仅用于确认跨境可见性，不等同于品牌直营网点。</p></div>
          <div><span>04</span><h3>Top 8 不强凑</h3><p>Wayfair、TikTok Shop 等若仅能核验少量商品，则保留真实数量。</p></div>
        </div>
        <p className="finePrint">数据快照：2026-07-16（Asia/Shanghai）。价格、库存、评论数和排序会随地区、登录状态与时间变化；购买前请以目标平台页面为准。</p>
      </section>

      <footer>
        <div className="footerMark">HLDIRECT<br />MARKET MAP</div>
        <div><p>公开渠道研究 · 中文整理</p><p>泳池浮具与边桌已纳入统计</p></div>
        <button onClick={copyShareLink}>{copied ? "已复制" : "复制分享链接"}</button>
      </footer>
    </main>
  );
}
