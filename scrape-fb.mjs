// Scrape ảnh full-size từ trang Facebook public.
// Chiến lược: vào grid photos → lấy link viewer của từng ảnh → vào viewer → ảnh full nằm trong <img>.
// Chạy: node scrape-fb.mjs
import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const PROFILE_ID = '61587287768345';
const GRID_URLS = [
    `https://www.facebook.com/profile.php?id=${PROFILE_ID}&sk=photos`,
    `https://www.facebook.com/profile.php?id=${PROFILE_ID}&sk=photos_by`,
    `https://mbasic.facebook.com/profile.php?id=${PROFILE_ID}&v=photos`,
];
const OUT_DIR = './images';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
const MAX_PHOTOS = 30;

async function ensureDir(dir) { if (!existsSync(dir)) await mkdir(dir, { recursive: true }); }

const dismissPopups = async (page) => {
    for (const sel of [
        'div[role="dialog"] [aria-label*="Close"]',
        'div[role="dialog"] [aria-label*="Đóng"]',
        '[aria-label="Close"]', '[aria-label="Đóng"]',
    ]) {
        const btn = page.locator(sel).first();
        if (await btn.isVisible().catch(() => false)) {
            await btn.click({ timeout: 1500 }).catch(() => {});
            await page.waitForTimeout(400);
        }
    }
};

async function findPhotoLinks(page) {
    return page.evaluate(() => {
        const links = new Set();
        document.querySelectorAll('a').forEach((a) => {
            const href = a.href;
            if (!href) return;
            // Photo viewer URLs có pattern /photo/?fbid= hoặc /photo.php?fbid=
            if (/\/photo(?:\.php)?\/?\?(?:fbid|set)=/.test(href) ||
                /\/[^/]+\/photos\/[^/?]+/.test(href)) {
                // chuẩn hoá: bỏ fragment
                links.add(href.split('#')[0]);
            }
        });
        return Array.from(links);
    });
}

async function findLargestImage(page) {
    return page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        let best = null;
        let bestArea = 0;
        for (const img of imgs) {
            if (!img.src || !img.src.includes('fbcdn.net')) continue;
            // Bỏ qua avatar/icon
            if (img.naturalWidth < 400 || img.naturalHeight < 400) continue;
            const area = img.naturalWidth * img.naturalHeight;
            if (area > bestArea) {
                bestArea = area;
                best = { src: img.src, w: img.naturalWidth, h: img.naturalHeight };
            }
        }
        return best;
    });
}

(async () => {
    await ensureDir(OUT_DIR);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: UA,
        viewport: { width: 1366, height: 900 },
        locale: 'vi-VN',
    });

    // Block ads/fonts/media để tăng tốc
    await context.route('**/*', (route) => {
        const t = route.request().resourceType();
        if (['font', 'media'].includes(t)) return route.abort();
        return route.continue();
    });

    const page = await context.newPage();

    // === Pha 1: gom danh sách link viewer ===
    let photoLinks = [];
    for (const gridUrl of GRID_URLS) {
        console.log(`\n🌐 Mở grid: ${gridUrl}`);
        try {
            await page.goto(gridUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        } catch (e) {
            console.log(`   ❌ ${e.message}`); continue;
        }
        await page.waitForTimeout(2500);
        await dismissPopups(page);
        await page.waitForTimeout(800);

        for (let i = 0; i < 6; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(900);
        }
        await dismissPopups(page);

        const links = await findPhotoLinks(page);
        console.log(`   🔗 Tìm thấy ${links.length} link viewer`);
        photoLinks.push(...links);
        if (photoLinks.length >= MAX_PHOTOS) break;
    }

    // Dedup theo fbid
    const seen = new Set();
    photoLinks = photoLinks.filter((u) => {
        const m = u.match(/fbid=(\d+)/) || u.match(/\/photos\/[^/]*\/(\d+)/);
        const key = m ? m[1] : u;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    }).slice(0, MAX_PHOTOS);

    console.log(`\n📋 ${photoLinks.length} link unique sẽ truy cập`);

    if (photoLinks.length === 0) {
        console.log('\n😞 Không tìm thấy link viewer nào. FB có thể chặn hoàn toàn anonymous.');
        await browser.close();
        process.exit(1);
    }

    // === Pha 2: vào từng viewer, lấy ảnh full ===
    const results = [];
    for (let i = 0; i < photoLinks.length; i++) {
        const link = photoLinks[i];
        const tag = `${i + 1}/${photoLinks.length}`;
        try {
            await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 25000 });
            await page.waitForTimeout(1800);
            await dismissPopups(page);
            await page.waitForTimeout(600);

            const big = await findLargestImage(page);
            if (!big) {
                console.log(`   ⏭️ ${tag}: không thấy ảnh đủ lớn`);
                continue;
            }

            const res = await fetch(big.src, { headers: { 'User-Agent': UA, 'Accept': 'image/*,*/*;q=0.8' } });
            if (!res.ok) {
                console.log(`   ⚠️ ${tag}: HTTP ${res.status}`);
                continue;
            }
            const buf = Buffer.from(await res.arrayBuffer());
            if (buf.length < 20000) {
                console.log(`   ⏭️ ${tag}: ảnh nhỏ (${Math.round(buf.length / 1024)}KB), bỏ`);
                continue;
            }
            const extMatch = big.src.match(/\.(jpg|jpeg|png|webp)/i);
            const ext = (extMatch ? extMatch[1] : 'jpg').toLowerCase();
            const fname = `fb-${String(i + 1).padStart(2, '0')}.${ext}`;
            await writeFile(join(OUT_DIR, fname), buf);
            console.log(`   ✅ ${tag}: ${fname} ${big.w}×${big.h} ${Math.round(buf.length / 1024)}KB`);
            results.push({ file: fname, size: buf.length, w: big.w, h: big.h, src: big.src, viewer: link });
        } catch (e) {
            console.log(`   ❌ ${tag}: ${e.message}`);
        }
    }

    await browser.close();
    await writeFile(join(OUT_DIR, 'manifest.json'), JSON.stringify(results, null, 2));
    console.log(`\n🎉 Xong: ${results.length}/${photoLinks.length} ảnh full size`);
})();
