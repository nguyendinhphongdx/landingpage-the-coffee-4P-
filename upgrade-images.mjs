// Đọc manifest.json, strip tham số 'stp' để xin ảnh full size từ FB CDN.
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = './images';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

function stripStp(url) {
    // Remove '&stp=...' or '?stp=...' (đến dấu & tiếp theo hoặc cuối chuỗi)
    let u = url.replace(/([?&])stp=[^&]+&?/g, '$1');
    // Dọn dấu ? trailing hoặc && liên tiếp
    u = u.replace(/[?&]$/, '').replace(/&&+/g, '&').replace(/\?&/, '?');
    return u;
}

(async () => {
    const manifestPath = join(OUT_DIR, 'manifest.json');
    if (!existsSync(manifestPath)) {
        console.log('❌ Không thấy manifest.json. Chạy scrape-fb.mjs trước.');
        process.exit(1);
    }

    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    console.log(`📋 ${manifest.length} ảnh trong manifest. Thử nâng cấp lên full size...\n`);

    const results = [];
    let upgraded = 0, kept = 0, failed = 0;

    for (let i = 0; i < manifest.length; i++) {
        const item = manifest[i];
        const tag = `${i + 1}/${manifest.length} ${item.file}`;
        const fullUrl = stripStp(item.url);

        try {
            const res = await fetch(fullUrl, {
                headers: { 'User-Agent': UA, 'Accept': 'image/*,*/*;q=0.8' },
            });
            if (!res.ok) {
                console.log(`   ⚠️ ${tag}: HTTP ${res.status} - giữ thumbnail`);
                results.push(item); kept++;
                continue;
            }
            const buf = Buffer.from(await res.arrayBuffer());
            if (buf.length <= item.size * 1.2) {
                console.log(`   ⏸️ ${tag}: full size không lớn hơn (${Math.round(buf.length / 1024)}KB)`);
                results.push(item); kept++;
                continue;
            }
            await writeFile(join(OUT_DIR, item.file), buf);
            console.log(`   ✅ ${tag}: ${Math.round(item.size / 1024)}KB → ${Math.round(buf.length / 1024)}KB`);
            results.push({ ...item, size: buf.length, url: fullUrl });
            upgraded++;
        } catch (e) {
            console.log(`   ❌ ${tag}: ${e.message}`);
            results.push(item); failed++;
        }
    }

    await writeFile(manifestPath, JSON.stringify(results, null, 2));
    console.log(`\n🎉 Xong: ${upgraded} nâng cấp, ${kept} giữ nguyên, ${failed} lỗi`);
})();
