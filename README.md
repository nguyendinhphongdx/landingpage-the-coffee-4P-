# 4P+ Coffee — Landing Page

Landing page tĩnh cho **4P+ Coffee** — 120 Trung Kính, phường Yên Hoà, quận Cầu Giấy, Hà Nội. Phong cách vintage ấm cúng, tối ưu SEO, không cần build, mở bằng trình duyệt là chạy.

## Thông tin quán

- **Địa chỉ:** 120 Trung Kính, phường Yên Hoà, quận Cầu Giấy, Hà Nội
- **Điện thoại:** 096 6195 000
- **Giờ mở cửa:** 07:00 — 23:00 (tất cả các ngày)
- **Facebook:** <https://www.facebook.com/profile.php?id=61587287768345>
- **TikTok:** [@4Pcoffeexinchao](https://www.tiktok.com/@4Pcoffeexinchao)

## Cấu trúc file

```text
4P+ Coffee/
├── index.html          # Trang chính — SEO meta tags + JSON-LD đầy đủ
├── styles.css          # Stylesheet (theme vintage: nâu cà phê – kem – vàng đồng)
├── script.js           # Mobile menu, smooth scroll, reveal animation, scroll spy
├── robots.txt          # Cho phép search engine crawl
├── sitemap.xml         # Sitemap cho SEO
├── images/             # Ảnh quán (lấy từ Facebook)
│   ├── fb-01.jpg       # Hero — phối cảnh quán có logo "4P+ Coffee"
│   ├── fb-02 → fb-30.jpg  # Ảnh không gian, đồ uống, sự kiện
│   └── manifest.json   # Metadata các ảnh đã tải
├── scrape-fb.mjs       # Script Playwright tải ảnh từ FB (có thể xóa nếu không cần)
├── upgrade-images.mjs  # Script thử nâng cấp thumbnail → full size (đã không dùng)
└── README.md           # File này
```

## Xem thử

Mở trực tiếp `index.html` bằng trình duyệt, hoặc khuyến nghị chạy local server để Google Maps embed + cache hoạt động tốt:

```powershell
# Python (có sẵn trên Win/Mac/Linux)
python -m http.server 8000

# Hoặc Node.js
npx serve .
```

Truy cập: `http://localhost:8000`

## Việc còn lại bạn nên làm

### 1. Domain & deploy

- [ ] Mua/kết nối domain thật. Sau đó tìm-thay `https://4pcoffee.vn/` (đang là placeholder) trong 3 file: `index.html`, `sitemap.xml`, `robots.txt`.
- [ ] Deploy lên một trong các nền tảng free dưới đây.

### 2. Kiểm tra & cập nhật chi tiết

- [ ] **Giá menu** — đang dùng giá tham khảo (25k – 55k). Cập nhật theo bảng giá thật của quán trong `index.html`, tìm các `<span class="price">XX.000đ</span>`.
- [ ] **Email liên hệ** — chưa có, đã bỏ khỏi UI. Nếu có email chính thức, thêm vào contact section.
- [ ] **Google Maps embed** — hiện đang dùng query string đến địa chỉ "120 Trung Kính". Để có embed đẹp hơn với marker cố định:
  1. Vào Google Maps → tìm "4P+ Coffee" hoặc "120 Trung Kính"
  2. Share → Embed a map → copy `<iframe src="...">`
  3. Dán đè vào section `.contact__map` trong `index.html`
- [ ] **Ảnh hero (`images/fb-01.jpg`)** — đang dùng phối cảnh 3D có logo. Nếu muốn dùng ảnh thật của quán làm hero, thay ảnh này (hoặc edit `.hero__bg` trong `styles.css` để trỏ đến ảnh khác).
- [ ] **Open Graph image** — meta `og:image` đang trỏ `images/fb-01.jpg` đường dẫn tương đối. Khi deploy lên domain, đổi sang URL tuyệt đối: `https://4pcoffee.vn/images/fb-01.jpg`.

### 3. SEO checklist

- [ ] Submit `sitemap.xml` cho **Google Search Console**.
- [ ] Tạo/cập nhật **Google Business Profile** (Google Maps) — quan trọng nhất cho quán cafe, nguồn khách hàng địa phương.
- [ ] Đăng ký Bing Webmaster Tools (nếu muốn).
- [ ] Cài Google Analytics / GA4 nếu cần đo traffic.

## Deploy miễn phí

| Nền tảng | Cách nhanh nhất |
| --- | --- |
| **Netlify** | Kéo thả thư mục vào <https://app.netlify.com/drop> |
| **Vercel** | `npm i -g vercel` → `vercel` trong thư mục dự án |
| **GitHub Pages** | Push lên GitHub repo → Settings → Pages → Source: `main` |
| **Cloudflare Pages** | Connect repo, build command để trống, output folder = `/` |

Tất cả đều **free**, hỗ trợ **HTTPS** + **custom domain** miễn phí.

## Ảnh từ Facebook

Đã tải 30 ảnh full-size từ Facebook public của quán bằng Playwright. Xem `images/manifest.json` để biết URL gốc của từng ảnh.

Ảnh đang dùng trong landing page:

- **Hero**: `fb-01.jpg` (phối cảnh 3D có logo 4P+ Coffee)
- **About**: `fb-28.jpg` (sân ngoài + bảng menu chalkboard)
- **Gallery (6 ảnh):**
  - `fb-29.jpg` — góc không gian ấm
  - `fb-02.jpg` — khách trong quán
  - `fb-14.jpg` — đèn lồng đỏ Hội An
  - `fb-10.jpg` — cửa kính "Welcome to 4P+ Coffee"
  - `fb-19.jpg` — poster đồ uống mùa hè
  - `fb-22.jpg` — tường báo + cờ đỏ vintage

24 ảnh còn lại trong `images/` có thể dùng để swap nếu muốn. Bạn vào thư mục `images/`, xem qua các file `fb-XX.jpg` và thay vào HTML tuỳ ý.

## Tuỳ biến nhanh

- **Đổi màu chủ đạo:** sửa các biến `--color-*` ở đầu `styles.css`.
- **Đổi font:** thay link `<link href="https://fonts.googleapis.com/...">` trong `index.html` và biến `--font-display` / `--font-body` trong `styles.css`.
- **Bỏ section:** xoá nguyên block `<section ...>` tương ứng trong `index.html`, đồng thời xoá link trong `<nav>` và footer.

## Dọn dẹp (tuỳ chọn)

Nếu không cần chạy lại scrape, có thể xoá an toàn:

- `scrape-fb.mjs`, `upgrade-images.mjs`
- `package.json`, `package-lock.json`
- `node_modules/`
- `images/_debug-*.html` (nếu có)

Các file landing page (`index.html`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml`, `images/*.jpg`) hoàn toàn standalone, không phụ thuộc Node.

---

Made with ☕ in Hà Nội.
