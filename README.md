# 4P+ Coffee — Landing Page

Landing page tĩnh cho **4P+ Coffee** — 120 Trung Kính, phường Yên Hoà, quận Cầu Giấy, Hà Nội. Phong cách vintage ấm cúng, tối ưu SEO chuyên sâu cho local search, không cần build.

## Thông tin quán

- **Địa chỉ:** 120 Trung Kính, phường Yên Hoà, quận Cầu Giấy, Hà Nội
- **Điện thoại:** 096 6195 000
- **Giờ mở cửa:** 07:00 — 23:00 (tất cả các ngày)
- **Facebook:** <https://www.facebook.com/profile.php?id=61587287768345>
- **TikTok:** [@4Pcoffeexinchao](https://www.tiktok.com/@4Pcoffeexinchao)

## Cấu trúc file

```text
4P+ Coffee/
├── index.html              # Trang chính (SEO + Schema.org @graph đầy đủ)
├── styles.css              # Stylesheet (vintage theme)
├── script.js               # Interactions + lightbox gallery
├── manifest.webmanifest    # PWA manifest (cài làm app trên mobile)
├── netlify.toml            # Caching + security headers + redirects
├── robots.txt              # Crawl directives (block AI scrapers)
├── humans.txt              # Thông tin team đằng sau site
├── sitemap.xml             # Sitemap + Image Sitemap
├── images/                 # 30 ảnh quán từ Facebook
└── README.md
```

## Xem thử

```powershell
python -m http.server 8000
# hoặc
npx serve .
```

Mở `http://localhost:8000`.

---

## SEO — đã tối ưu sẵn

Trang đã được tối ưu SEO toàn diện cho **local search Hà Nội** với các kỹ thuật sau:

### 1. On-page SEO

- **Title tag** chứa thương hiệu + địa danh + USP: *"4P+ Coffee — 120 Trung Kính, Yên Hoà, Hà Nội | Cafe vintage ấm cúng"*
- **Meta description** 155 ký tự, chứa địa chỉ + 3 USP chính (đèn lồng Hội An, sân vườn, phòng riêng) + giờ mở cửa
- **Keywords meta** (informational): cafe Trung Kính / Yên Hoà / Cầu Giấy / Hà Nội / vintage / cold brew / matcha
- **Canonical URL** + `hreflang vi-VN` + `x-default`
- **H1 unique** chứa keyword chính (visually-hidden cho SEO) + tagline đẹp (visible)
- **H2/H3 hierarchy** đúng cho từng section (Giới thiệu / Thực đơn / Không gian / FAQ / Liên hệ)
- **Alt text** đầy đủ và mô tả tốt cho tất cả ảnh (image SEO + a11y)
- **Internal anchor text** chứa keywords: "thực đơn", "Facebook", "TikTok @4Pcoffeexinchao"

### 2. Schema.org Structured Data (JSON-LD @graph)

Một block `@graph` duy nhất chứa **7 schema entities** liên kết với nhau qua `@id`:

| Schema | Lợi ích |
| --- | --- |
| `CafeOrCoffeeShop` + `LocalBusiness` | Google Knowledge Panel, Maps integration |
| `Organization` | Brand entity, contactPoint cho Google Search |
| `WebSite` | Sitelink search box tiềm năng |
| `WebPage` + `speakable` | Voice search / Google Assistant |
| `Menu` + `MenuSection` + `MenuItem` | Rich snippet hiển thị giá món |
| `FAQPage` + 6 `Question`/`Answer` | **FAQ rich snippet trên SERP** (boost CTR rất mạnh) |
| `BreadcrumbList` | Breadcrumb trail trên SERP |

Có thêm các thuộc tính quan trọng cho local SEO:

- `geo.GeoCoordinates` (lat/lng)
- `hasMap` link Google Maps
- `address.PostalAddress` đầy đủ
- `openingHoursSpecification`
- `amenityFeature` (Wi-Fi, phòng riêng, sân vườn)
- `acceptsReservations: true`
- `priceRange`, `paymentAccepted`, `currenciesAccepted`
- `sameAs` Facebook + TikTok (entity disambiguation)

### 3. Open Graph + Twitter + Facebook Places

- `og:type = restaurant.restaurant` (rich preview riêng cho nhà hàng)
- `og:image` size 1200×630 với width/height + alt
- `business:contact_data:*` cho Facebook Places
- `restaurant:hours:opens/closes`
- `place:location:latitude/longitude`

### 4. Local SEO (quan trọng nhất cho cafe)

- **NAP nhất quán** (Name / Address / Phone) — xuất hiện 5+ chỗ với format giống hệt
- **Geo meta tags** (geo.region, geo.placename, geo.position, ICBM)
- **Sitemap có image entries** với caption tiếng Việt
- Schema địa chỉ chia rõ `streetAddress` / `addressLocality` / `addressRegion`
- Số điện thoại có `tel:+84...` link để click-to-call trên mobile

### 5. Technical SEO

- **Mobile-first responsive** (Google's primary index)
- **Core Web Vitals:**
  - LCP: hero image `preload` + `fetchpriority="high"`
  - CLS: tất cả `<img>` có `width` + `height` attribute
  - INP: vanilla JS nhẹ, không framework
- **PWA-ready** — `manifest.webmanifest` với shortcuts (Menu / Map / Call)
- **Caching headers** (Netlify) — CSS/JS 1 năm immutable, ảnh 30 ngày SWR
- **Security headers** — HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy
- **HTTPS redirect** + WWW → non-WWW canonical
- **Crawl-friendly** — không có block JavaScript, sitemap fresh `lastmod`
- **robots.txt** block AI training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended) — bảo vệ content

### 6. Accessibility (a11y — Google ranking factor)

- Skip-to-content semantic landmarks
- ARIA labels trên tất cả interactive controls
- Focus-visible outlines
- Reduced-motion support
- `lang="vi-VN"` trên `<html>`
- Lightbox keyboard + screen-reader friendly

---

## SEO checklist sau khi deploy

Sau khi đẩy lên domain thật, **bắt buộc** làm các bước sau theo thứ tự:

### Tuần 1 — Foundation

- [ ] **Mua/kết nối domain custom** (vd `4pcoffee.vn`) thay cho subdomain Render. Sau đó trong các file `index.html`, `sitemap.xml`, `robots.txt`, `humans.txt`, `netlify.toml`, `render.yaml` tìm-thay `https://fourp-coffee.onrender.com/` → domain mới.
- [ ] Tạo email công khai `hello@4pcoffee.vn` hoặc `info@4pcoffee.vn` (tốt cho schema `Organization.email`).
- [ ] Cài SSL/HTTPS (Netlify/Vercel/Cloudflare tự động cấp Let's Encrypt miễn phí).
- [ ] **Google Search Console** — submit `sitemap.xml`, request indexing trang chủ.
- [ ] **Bing Webmaster Tools** — submit sitemap.
- [ ] Test với:
  - [Rich Results Test](https://search.google.com/test/rich-results) — kiểm tra FAQ + LocalBusiness + Menu hiển thị đúng
  - [Schema Markup Validator](https://validator.schema.org/)
  - [PageSpeed Insights](https://pagespeed.web.dev/) — mục tiêu LCP <2.5s, CLS <0.1
  - [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Tuần 2 — Local SEO (quan trọng nhất cho cafe)

- [ ] **Google Business Profile** (Google Maps) — bước quan trọng số 1 cho quán cafe:
  - Tạo/claim profile tại business.google.com
  - Verify bằng bưu thiếp (mất 5-7 ngày)
  - Điền NAP **giống hệt** như trên website
  - Thêm 10+ ảnh thực tế của quán
  - Bật messaging, đặt giờ mở cửa
  - Thêm menu items + giá
  - Khuyến khích khách review (mục tiêu: 20+ reviews 4-5 sao trong 3 tháng đầu)
- [ ] **Facebook Page** — đảm bảo "About" trên FB có cùng địa chỉ, SĐT, giờ mở.
- [ ] **Foody, Lozi, Now/Shopee Food** — niêm yết quán trên các platform này (citation building).
- [ ] **Đăng ký Apple Maps** (vì iPhone user) qua [Apple Business Connect](https://businessconnect.apple.com).

### Tuần 3 — Content marketing

- [ ] Đăng đều đặn lên Facebook + TikTok (vd 3 bài/tuần). Mỗi bài chèn link website.
- [ ] Khuyến khích khách check-in trên Facebook tại địa điểm "4P+ Coffee".
- [ ] Tạo Google Business Profile **Posts** hàng tuần (đồ uống mới, sự kiện, khuyến mãi).
- [ ] Backlink ban đầu từ:
  - Page hangoutvietnam, hanoigrapevine, foodybattle
  - Blog du lịch / lifestyle Hà Nội
  - Hội nhóm Facebook "Review quán cafe Hà Nội"

### Tháng 2 trở đi — Long-term

- [ ] Tracking ranking các keyword chính:
  - "cafe trung kính" / "cafe yên hoà" / "cafe cầu giấy"
  - "cafe vintage hà nội" / "cafe làm việc hà nội"
  - "4P+ coffee" (brand keyword)
- [ ] Phân tích traffic bằng GA4 + Google Search Console
- [ ] Tối ưu trang theo hành vi user (heat-map, scroll depth)
- [ ] Bài blog định kỳ (`/blog/...`) tăng topical authority (vd "Top 5 quán cafe Cầu Giấy", "Hướng dẫn pha cà phê muối"...)

---

## Việc còn lại cần làm trong code

- [ ] **Giá menu** đang là tham khảo (25k–55k). Cập nhật theo bảng giá thật trong `index.html` (cả phần HTML cards và phần JSON-LD `MenuItem.offers.price`).
- [ ] **Google Maps embed** — nếu muốn marker chính xác hơn, vào Maps → tìm quán → Share → Embed a map → copy iframe → dán đè vào section `.contact__map`.
- [ ] **Geo coordinates** (21.0186, 105.7942) — toạ độ gần đúng. Lấy chính xác từ Google Maps (chuột phải lên quán → copy coordinates) rồi cập nhật 3 nơi:
  - `<meta name="geo.position">`
  - `<meta name="ICBM">`
  - JSON-LD `GeoCoordinates`
- [ ] **Email** trong `Organization.email` đang để `hello@4pcoffee.vn`. Đổi sang email thật khi có.
- [ ] **Domain** — toàn bộ link đang dùng `https://fourp-coffee.onrender.com/`. Nếu domain khác, find-replace.
- [ ] **og:image** nên đổi sang ảnh "đại diện thương hiệu" tỷ lệ chuẩn 1200×630 (hiện đang dùng `fb-01.jpg` 1280×853, Facebook sẽ crop).

---

## Deploy miễn phí + auto-config

| Nền tảng | Setup | Note |
| --- | --- | --- |
| **Netlify** (Recommended) | Drag-drop thư mục → `netlify.toml` tự áp dụng | Caching + redirects + headers tự động |
| **Vercel** | `vercel` trong thư mục | Cần thêm `vercel.json` cho headers |
| **GitHub Pages** | Push repo → Settings → Pages | Không có headers config |
| **Cloudflare Pages** | Connect repo, build empty, output `/` | `_headers` + `_redirects` files (cần convert từ netlify.toml) |

**Khuyến nghị: Netlify** — `netlify.toml` đã được config sẵn để áp dụng ngay sau khi deploy.

---

## Performance benchmarks (mục tiêu)

| Metric | Target | Hiện trạng |
| --- | --- | --- |
| LCP (Largest Contentful Paint) | < 2.5s | OK với preload `fb-01.jpg` |
| CLS (Cumulative Layout Shift) | < 0.1 | OK (tất cả img có dimensions) |
| INP (Interaction to Next Paint) | < 200ms | OK (vanilla JS) |
| PageSpeed Mobile | > 90 | Cần test sau deploy |
| Lighthouse SEO | 100/100 | Đã tối ưu |
| Lighthouse Accessibility | > 95 | Đã có ARIA + landmarks |

---

Made with ☕ in Hà Nội.
