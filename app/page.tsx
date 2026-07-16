"use client";

import { useMemo, useState } from "react";
import amazonScrape from "../data/amazon-scrape.json";

type Category = "游戏桌" | "游戏椅" | "泳池浮具" | "边桌" | "其他";

type Product = {
  rank: number;
  title: string;
  category: Category;
  url: string;
  signal: string;
  image: string;
  reviewCount: number;
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

type AmazonRow = {
  region: string;
  domain: string;
  asin: string;
  url: string;
  title: string;
  reviewText: string;
  reviewCount: number;
  image: string;
  verified: boolean;
};

const productImage = (asin: string) => `products/${asin}.jpg`;
const formatReviews = (count: number) => count > 0 ? `${count.toLocaleString("zh-CN")} 条评价` : "评价数未公开";

const asinCatalog: Record<string, { title: string; category: Category }> = {
  B0B3DSSSFQ: { title: "47 英寸 RGB 游戏桌", category: "游戏桌" },
  B0BMXB13TR: { title: "63 英寸 LED 游戏桌", category: "游戏桌" },
  B0BSGKRK7P: { title: "47 英寸 LED 游戏桌", category: "游戏桌" },
  B0BV2PWM3J: { title: "55 英寸碳纤维纹游戏桌", category: "游戏桌" },
  B0DDK8RYT9: { title: "40 英寸 LED 游戏桌", category: "游戏桌" },
  B0DJLSYC22: { title: "47 英寸 LED / 插座 / 显示器架游戏桌", category: "游戏桌" },
  B0DK15L2B4: { title: "47 英寸理线游戏桌", category: "游戏桌" },
  B0FD3L5NXH: { title: "C 型充电边桌｜白色", category: "边桌" },
  B0FD3MZBPP: { title: "C 型充电边桌｜乡村棕", category: "边桌" },
  B0FF4PTWKF: { title: "人体工学游戏椅｜黑色", category: "游戏椅" },
  B0FF4TCZBD: { title: "按摩腰枕游戏椅", category: "游戏椅" },
  B0FF4X1PCX: { title: "高背脚托游戏椅", category: "游戏椅" },
  B0FPC54S4F: { title: "55 英寸 L 型桌｜3 抽屉", category: "游戏桌" },
  B0FPC7RHYK: { title: "折叠 C 型充电边桌", category: "边桌" },
  B0GHLJGLGB: { title: "55 英寸电动升降游戏桌", category: "游戏桌" },
  B0GKFG61KS: { title: "晒太阳泳池躺椅｜绿色", category: "泳池浮具" },
  B0GKFGQGGW: { title: "充气晒太阳泳池躺椅", category: "泳池浮具" },
  B0GKFHPWBQ: { title: "充气泳池躺椅｜杯架 + 头枕", category: "泳池浮具" },
  B0GKFM1JN8: { title: "双人漂流浮圈", category: "泳池浮具" },
  B0GKFQSTZ8: { title: "晒太阳充气泳池躺椅", category: "泳池浮具" },
  B0GKG27KB5: { title: "双人泳池浮床", category: "泳池浮具" },
  B0GKG7LVFW: { title: "带冷藏区 / 杯架漂流浮圈", category: "泳池浮具" },
  B0GKGGL6GX: { title: "双人漂流浮床｜冷藏区 + 靠背", category: "泳池浮具" },
  B0GPPP1CTR: { title: "55 英寸 3 布抽屉 / LED / 层架桌", category: "游戏桌" },
  B0GRFZF32C: { title: "47 英寸 6 抽屉电脑桌｜棕色", category: "游戏桌" },
  B0GXTW6S14: { title: "47 英寸 8 抽屉 LED / 插座桌", category: "游戏桌" },
  B0H25GFRQ8: { title: "电动升降桌｜布抽屉", category: "游戏桌" },
};

const amazonRegionConfig = [
  { id: "amazon-us", region: "US", name: "Amazon 美国", url: "https://www.amazon.com/stores/HLDIRECT/page/3879C02E-4AF1-4D11-A2D8-DA3734361877", type: "品牌旗舰店" },
  { id: "amazon-ca", region: "CA", name: "Amazon 加拿大", url: "https://www.amazon.ca/stores/HLDIRECT/page/A0890835-DFEE-44B1-870F-57BD38991DC2", type: "品牌旗舰店" },
  { id: "amazon-mx", region: "MX", name: "Amazon 墨西哥", url: "https://www.amazon.com.mx/s?k=HLDIRECT", type: "品牌结果页" },
  { id: "amazon-jp", region: "JP", name: "Amazon 日本", url: "https://www.amazon.co.jp/s?k=HLDIRECT", type: "品牌结果页" },
  { id: "amazon-de", region: "DE", name: "Amazon 德国", url: "https://www.amazon.de/s?k=HLDIRECT", type: "欧洲商品页集合" },
  { id: "amazon-uk", region: "UK", name: "Amazon 英国", url: "https://www.amazon.co.uk/s?k=HLDIRECT", type: "欧洲商品页集合" },
  { id: "amazon-fr", region: "FR", name: "Amazon 法国", url: "https://www.amazon.fr/s?k=HLDIRECT", type: "欧洲商品页集合" },
  { id: "amazon-it", region: "IT", name: "Amazon 意大利", url: "https://www.amazon.it/s?k=HLDIRECT", type: "欧洲商品页集合" },
  { id: "amazon-es", region: "ES", name: "Amazon 西班牙", url: "https://www.amazon.es/s?k=HLDIRECT", type: "欧洲商品页集合" },
] as const;

const amazonChannels: Channel[] = amazonRegionConfig.map((config) => {
  const products = (amazonScrape as AmazonRow[])
    .filter((row) => row.region === config.region && row.verified && asinCatalog[row.asin])
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 8)
    .map((row, index) => ({
      rank: index + 1,
      title: asinCatalog[row.asin].title,
      category: asinCatalog[row.asin].category,
      url: row.url,
      signal: formatReviews(row.reviewCount),
      image: row.image ? row.image.replace(/^\//, "") : productImage(row.asin),
      reviewCount: row.reviewCount,
      asin: row.asin,
    }));

  return {
    ...config,
    evidence: "强",
    method: "按商品页公开评价数降序；可访问商品页不等同于当前有库存",
    products,
  };
});

const otherChannels: Channel[] = [
  {
    id: "walmart", name: "Walmart", region: "US", url: "https://www.walmart.com/brand/hldirect/10044222", type: "品牌页", evidence: "强",
    method: "按公开评价数降序；不同变体可能共享评价",
    products: [
      { rank: 1, title: "55 英寸 LED 游戏桌｜白色", category: "游戏桌", url: "https://www.walmart.com/ip/18581707234", signal: "333 条评价 · Best seller", image: productImage("B0BSGKRK7P"), reviewCount: 333 },
      { rank: 2, title: "32 英寸游戏桌", category: "游戏桌", url: "https://www.walmart.com/ip/11670058479", signal: "262 条评价", image: productImage("B0DK15L2B4"), reviewCount: 262 },
      { rank: 3, title: "40 英寸碳纤维纹游戏桌", category: "游戏桌", url: "https://www.walmart.com/ip/11906505249", signal: "258 条评价", image: productImage("B0DDK8RYT9"), reviewCount: 258 },
      { rank: 4, title: "55 英寸 LED 游戏桌｜黑色", category: "游戏桌", url: "https://www.walmart.com/ip/3477756251", signal: "156 条评价", image: productImage("B0BV2PWM3J"), reviewCount: 156 },
      { rank: 5, title: "63 英寸 LED 游戏桌｜黑色", category: "游戏桌", url: "https://www.walmart.com/ip/11894063774", signal: "156 条评价", image: productImage("B0BMXB13TR"), reviewCount: 156 },
      { rank: 6, title: "55 英寸 LED / 插座 / 显示器架桌", category: "游戏桌", url: "https://www.walmart.com/ip/15144853968", signal: "136 条评价", image: productImage("B0DJLSYC22"), reviewCount: 136 },
      { rank: 7, title: "47 英寸 8 抽屉 LED / USB 桌", category: "游戏桌", url: "https://www.walmart.com/ip/17010500236", signal: "61 条评价", image: productImage("B0GXTW6S14"), reviewCount: 61 },
      { rank: 8, title: "51 英寸 L 型 LED / 显示器架桌", category: "游戏桌", url: "https://www.walmart.com/ip/15434210439", signal: "38 条评价", image: productImage("B0FPC54S4F"), reviewCount: 38 },
    ],
  },
  {
    id: "direct", name: "HLDIRECT 直营站", region: "Global / US", url: "https://hldirect.co/", type: "独立站", evidence: "中",
    method: "官网未公开评价数；以下按椅类合集陈列顺序保留",
    products: [
      ["袋装弹簧坐垫游戏椅｜黑色", "B0FF4PTWKF"], ["袋装弹簧坐垫游戏椅｜黑蓝", "B0FF4X1PCX"], ["袋装弹簧坐垫游戏椅｜黑灰", "B0FF4TCZBD"], ["可调靠背办公椅", "B0FF4PTWKF"],
      ["袋装弹簧坐垫游戏椅｜黑红", "B0FF4X1PCX"], ["游戏椅｜白黑", "B0FF4TCZBD"], ["游戏椅｜黑绿", "B0FF4PTWKF"], ["袋装弹簧坐垫游戏椅｜黑色变体", "B0FF4X1PCX"],
    ].map(([title, asin], index) => ({ rank: index + 1, title, category: "游戏椅" as Category, url: "https://hldirect.co/collections/chairs", signal: `评价数未公开 · 合集陈列 #${index + 1}`, image: productImage(asin), reviewCount: 0 })),
  },
  {
    id: "newegg", name: "Newegg", region: "US", url: "https://www.newegg.com/p/pl?d=HLDIRECT&Order=3", type: "品牌搜索页", evidence: "中",
    method: "未公开评价数；按 Best Selling 页面顺序补充",
    products: [
      ["55 英寸 LED 人体工学游戏桌｜黑色", "B0BV2PWM3J"], ["55 英寸 LED 人体工学游戏桌｜白色", "B0BSGKRK7P"], ["55 英寸电动升降游戏桌", "B0GHLJGLGB"], ["55 英寸 Z 型 LED 游戏桌", "B0BMXB13TR"],
      ["55 英寸 5 插座 / LED / 显示器架桌", "B0DJLSYC22"], ["55 英寸 LED 游戏桌｜另一变体", "B0B3DSSSFQ"], ["40 英寸理线游戏桌", "B0DK15L2B4"], ["40 英寸 LED 游戏桌", "B0DDK8RYT9"],
    ].map(([title, asin], index) => ({ rank: index + 1, title, category: "游戏桌" as Category, url: index === 2 ? "https://www.newegg.com/p/3EA-00C2-00012?item=9SIC5TJKZ75212" : "https://www.newegg.com/p/pl?d=HLDIRECT&Order=3", signal: `评价数未公开 · 页面顺序 #${index + 1}`, image: productImage(asin), reviewCount: 0 })),
  },
  {
    id: "tiktok", name: "TikTok Shop", region: "US", url: "https://shop.tiktok.com/us/search?q=HLDIRECT", type: "商城搜索 / 商品页", evidence: "中",
    method: "按可见评价数优先；评价数未显示的商品保留在后",
    products: [
      { rank: 1, title: "人体工学游戏椅｜腰枕 + 脚托", category: "游戏椅", url: "https://shop.tiktok.com/us/pdp/hldirect-ergonomic-gaming-chair-lumbar-footrest-200lbs/1732317301233390445", signal: "59 条全球评价 · 4.3", image: productImage("B0FF4PTWKF"), reviewCount: 59 },
      { rank: 2, title: "人体工学布艺游戏椅", category: "游戏椅", url: "https://shop.tiktok.com/us/search?q=HLDIRECT%20gaming%20chair", signal: "评分 4.4 · 评价数未显示", image: productImage("B0FF4X1PCX"), reviewCount: 0 },
      { rank: 3, title: "55 英寸插座 / 3 布抽屉游戏桌", category: "游戏桌", url: "https://shop.tiktok.com/us/search?q=HLDIRECT%2055%20inch%20desk", signal: "评分 3.5 · 评价数未显示", image: productImage("B0GPPP1CTR"), reviewCount: 0 },
      { rank: 4, title: "47 英寸 6 抽屉电脑桌", category: "游戏桌", url: "https://shop.tiktok.com/us/search?q=HLDIRECT%2047%20inch%20desk", signal: "评价数未公开", image: productImage("B0GRFZF32C"), reviewCount: 0 },
    ],
  },
  {
    id: "wayfair", name: "Wayfair", region: "US", url: "https://www.wayfair.com/furniture/pdp/hldirect-gaming-chair-with-pocket-spring-cushion-video-game-chair-gaming-computer-chair-ergonomic-chairs-with-massage-lumbar-support-for-adults-swivel-pu-leather-office-chair-hdir1016.html", type: "单品上架", evidence: "有限",
    method: "当前仅核验到 1 个稳定商品页",
    products: [{ rank: 1, title: "高背袋装弹簧坐垫游戏椅｜HDIR1016", category: "游戏椅", url: "https://www.wayfair.com/furniture/pdp/hldirect-gaming-chair-with-pocket-spring-cushion-video-game-chair-gaming-computer-chair-ergonomic-chairs-with-massage-lumbar-support-for-adults-swivel-pu-leather-office-chair-hdir1016.html", signal: "87 条评价 · 4.5", image: productImage("B0FF4TCZBD"), reviewCount: 87 }],
  },
  {
    id: "ebay", name: "eBay", region: "US", url: "https://www.ebay.com/sch/i.html?_nkw=HLDIRECT&_sop=13", type: "转售市场", evidence: "有限", method: "非品牌官方店；当前仅保留已核验转售商品",
    products: [{ rank: 1, title: "47 英寸 LED / 插座游戏桌｜二手", category: "游戏桌", url: "https://www.ebay.com/itm/127185499963", signal: "评价数未公开 · 转售商品", image: productImage("B0BSGKRK7P"), reviewCount: 0 }],
  },
  {
    id: "ubuy", name: "Ubuy 全球进口", region: "UK / Global", url: "https://www.u-buy.co.uk/product/MXMZ0LRDC-hldirect-gaming-chair-ergonomic-video-game-seat-with-360-swivel-lumbar-massage-computer-chair-pu-leather-cushion-for-adults-home-office-use", type: "跨境导购 / 进口", evidence: "有限", method: "进口镜像，不视为官方店；用于确认跨境可见性",
    products: [{ rank: 1, title: "360° 旋转按摩腰枕游戏椅", category: "游戏椅", url: "https://www.u-buy.co.uk/product/MXMZ0LRDC-hldirect-gaming-chair-ergonomic-video-game-seat-with-360-swivel-lumbar-massage-computer-chair-pu-leather-cushion-for-adults-home-office-use", signal: "评分 4.0 · 评价数未显示", image: productImage("B0FF4PTWKF"), reviewCount: 0 }],
  },
];

const channels: Channel[] = [...amazonChannels, ...otherChannels];
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
      .map((channel) => ({ ...channel, products: channel.products.filter((product) => {
        const categoryMatch = selectedCategory === "全部" || product.category === selectedCategory;
        const searchMatch = !search || `${product.title} ${product.asin ?? ""} ${channel.name}`.toLowerCase().includes(search);
        return categoryMatch && searchMatch;
      }) }))
      .filter((channel) => channel.products.length > 0);
  }, [query, selectedCategory, selectedChannel]);

  const copyShareLink = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "HLDIRECT 全网评价地图", url: window.location.href }); return; } catch { /* copy fallback */ }
    }
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="回到顶部">HL<span>DIRECT</span></a>
        <nav aria-label="页面导航"><a href="#channels">渠道</a><a href="#products">评价榜</a><a href="#method">方法</a></nav>
        <button className="shareButton" onClick={copyShareLink}>{copied ? "链接已复制" : "分享报告 ↗"}</button>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span>Review Map 02</span><span>更新于 2026-07-16</span></div>
        <h1><span>HLDIRECT</span><em>全网评价地图</em></h1>
        <div className="heroGrid">
          <div className="thesis"><p className="thesisLabel">核心发现</p><p>评价数显示，<strong>游戏桌仍是品牌的口碑主力</strong>；泳池浮具与充电边桌是新增品类，但评价积累尚处于早期。</p></div>
          <div className="heroNote"><span>本次新增</span><p>英国、德国、法国、意大利、西班牙站点，以及逐条商品图片与公开评价数口径。</p></div>
        </div>
        <div className="metrics">
          <div><strong>{channels.length}</strong><span>个站点 / 渠道</span></div>
          <div><strong>{totalProducts}</strong><span>条商品记录</span></div>
          <div><strong>5</strong><span>个欧洲 Amazon 站点</span></div>
          <div><strong>100%</strong><span>商品记录配图</span></div>
        </div>
      </section>

      <section className="section" id="channels">
        <div className="sectionHead"><div><span className="sectionNo">01</span><h2>渠道总览</h2></div><p>“强”代表能够核验公开评价数；“中”代表只有评分或页面顺序；“有限”代表仅确认少量商品。</p></div>
        <div className="channelGrid">
          {channels.map((channel) => <a key={channel.id} className="channelCard" href={channel.url} target="_blank" rel="noreferrer">
            <div className="channelCardTop"><span>{channel.region}</span><span className={`evidence ${channel.evidence}`}>{channel.evidence}证据</span></div>
            <h3>{channel.name}</h3><p>{channel.type}</p>
            <div className="channelFoot"><span>{channel.products.length >= 8 ? "评价 Top 8" : `已核验 ${channel.products.length} 款`}</span><span>↗</span></div>
          </a>)}
        </div>
        <div className="secondaryLinks"><span>品牌信息站</span><a href="https://www.thehldirect.com/" target="_blank" rel="noreferrer">thehldirect.com ↗</a><a href="https://hldirects.com/" target="_blank" rel="noreferrer">hldirects.com ↗</a><span className="caveat">后者来源归属不如直营站清晰，仅作补充。</span></div>
      </section>

      <section className="section productsSection" id="products">
        <div className="sectionHead"><div><span className="sectionNo">02</span><h2>公开评价数优先榜</h2></div><p>排序优先采用商品页公开评价数。未显示评价数的平台按页面顺序补充，并明确标注，不再称为销量。</p></div>
        <div className="filterPanel">
          <div className="channelPills" aria-label="站点筛选"><button className={selectedChannel === "all" ? "active" : ""} onClick={() => setSelectedChannel("all")}>全部站点</button>{channels.map((channel) => <button key={channel.id} className={selectedChannel === channel.id ? "active" : ""} onClick={() => setSelectedChannel(channel.id)}>{channel.name}</button>)}</div>
          <div className="filterRow"><label className="searchBox"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索商品、ASIN 或站点" /></label><div className="categoryPills" aria-label="品类筛选">{categories.map((category) => <button key={category} className={selectedCategory === category ? "active" : ""} onClick={() => setSelectedCategory(category)}>{category}</button>)}</div></div>
        </div>
        <div className="resultMeta"><span>显示 {visibleChannels.reduce((sum, channel) => sum + channel.products.length, 0)} 条结果</span><span>按评价数优先 · 商品图已补充 ✓</span></div>
        <div className="tables">
          {visibleChannels.map((channel) => <article className="rankTable" key={channel.id}>
            <div className="tableHead"><div><span>{channel.region}</span><h3>{channel.name}</h3></div><div><p>{channel.method}</p><a href={channel.url} target="_blank" rel="noreferrer">访问店铺 / 结果页 ↗</a></div></div>
            <div className="rows">{channel.products.map((product) => <a className="productRow" href={product.url} target="_blank" rel="noreferrer" key={`${channel.id}-${product.rank}-${product.title}`}>
              <span className="rank">{String(product.rank).padStart(2, "0")}</span>
              <span className="productThumb"><img src={product.image} alt={`${product.title} 产品图`} loading="lazy" /></span>
              <span className="productName"><strong>{product.title}</strong>{product.asin && <small>ASIN {product.asin}</small>}</span>
              <span className={`category category-${product.category}`}>{product.category}</span><span className="signal">{product.signal}</span><span className="out">↗</span>
            </a>)}</div>
          </article>)}
          {visibleChannels.length === 0 && <div className="empty">没有匹配的商品。试试清空搜索或切换品类。</div>}
        </div>
      </section>

      <section className="insightBand"><div><span>Review Signal</span><h2>评价数适合比较口碑积累，不等同于销量。</h2></div><p>同一 ASIN 在不同国家站点显示的评价数可能不同，且父子变体可能共享评价。因此本页把评价数视为公开需求代理，而非品牌后台成交数据。</p></section>

      <section className="section methodSection" id="method">
        <div className="sectionHead"><div><span className="sectionNo">03</span><h2>口径与限制</h2></div><p>本页面是公开网页快照，不接触品牌卖家后台、广告后台或第三方付费销量数据库。</p></div>
        <div className="methodGrid">
          <div><span>01</span><h3>评价数优先</h3><p>有公开评价数时按数量降序，不再使用“销量最高”表述。</p></div>
          <div><span>02</span><h3>没有就明确留白</h3><p>平台未显示评价数时，仅保留评分或页面陈列顺序。</p></div>
          <div><span>03</span><h3>图片分级</h3><p>Amazon 使用对应 ASIN 主图；不稳定市场页使用最接近的同系列代表图。</p></div>
          <div><span>04</span><h3>欧洲页不等于现货</h3><p>商品页可访问只代表曾经或当前上架，购买前仍需核对库存与配送。</p></div>
        </div>
        <p className="finePrint">数据快照：2026-07-16（Asia/Shanghai）。评价数、评分、价格、库存和页面可见性会随地区与时间变化；请以目标平台实时页面为准。</p>
      </section>

      <footer><div className="footerMark">HLDIRECT<br />REVIEW MAP</div><div><p>公开渠道与评价数研究 · 中文整理</p><p>欧洲五站、泳池浮具与边桌已纳入</p></div><button onClick={copyShareLink}>{copied ? "已复制" : "复制分享链接"}</button></footer>
    </main>
  );
}
