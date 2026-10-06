# FLOW PROMPT: Ana Sayfa Geliştirme Akışı (`prompts/ana-sayfa.md`)

> **Talimat:** Bu flow prompt'u çalıştırıldığında ajan, Ana Sayfa'da yer alan her bileşen için `prompts/ana-sayfa/` alt klasöründe BİLEŞEN PROMPT ŞABLONU'na göre AYRI detaylı bileşen prompt dosyalarını sırayla üretecektir.

---

## 1. Sayfa Şablonu ve Amaç
- **Sayfa:** Ana Sayfa (`Homepage`)
- **Amaç:** Marka kimliğini, öne çıkan seyahat yastığı ürünlerini, basın medyasını, müşteri yorumlarını ve videoları yüksek estetikle sunarak kullanıcıyı alışverişe yönlendirmek.
- **Bölüm Sırası (Yukarıdan Aşağıya):**
  1. Announcement Bar *(Ortak)*
  2. Header & Navigasyon *(Ortak)*
  3. Button Bileşeni *(Ortak Referans)*
  4. Hero Banner Section
  5. Press Logo Ticker (As-Seen-In)
  6. Product Card *(Ortak Bağımlılık)*
  7. Featured Collection Grid
  8. Image With Text Block
  9. Product Features Icons
  10. Testimonials Carousel
  11. Video Demo Section
  12. Newsletter Section *(Ortak)*
  13. Slide-Out Cart Drawer *(Ortak)*
  14. Footer *(Ortak)*

---

## 2. FLOW SIRASI ve Bağımlılık Mantığı

Bileşenler sayfadaki görsel akış sırasına göre işlenir. Ancak bağımlı bileşenler (örneğin `Button` ve `Product Card`) önceden hazır bulunmalıdır:

1. `prompts/ortak/announcement-bar.md` — *(Ortak Referans)*
2. `prompts/ortak/header.md` — *(Ortak Referans)*
3. `prompts/ortak/button.md` — *(Ortak Referans - Buton bağımlılığı)*
4. `prompts/ana-sayfa/01-hero-banner.md` — Hero bölümü prompt'u
5. `prompts/ana-sayfa/02-press-ticker.md` — Marquee logo bandı prompt'u
6. `prompts/ortak/product-card.md` — *(Ortak Referans - Izgara bağımlılığı)*
7. `prompts/ana-sayfa/03-featured-collection-grid.md` — Öne çıkan koleksiyon ızgarası prompt'u
8. `prompts/ana-sayfa/04-image-with-text-block.md` — Görsel + Metin stagered blok prompt'u
9. `prompts/ana-sayfa/05-product-features-icons.md` — Özellik ikonları prompt'u
10. `prompts/ana-sayfa/06-testimonials-carousel.md` — Müşteri yorumları prompt'u
11. `prompts/ana-sayfa/07-video-demo-section.md` — Video demo bölümü prompt'u
12. `prompts/ortak/newsletter-section.md` — *(Ortak Referans)*
13. `prompts/ortak/cart-drawer.md` — *(Ortak Referans)*
14. `prompts/ortak/footer.md` — *(Ortak Referans)*

---

## 3. Üretim Talimatı

Bu prompt çalıştırıldığında ajan aşağıdaki adımları sırayla uygulayacaktır:

### Adım 1: Dosya Listesi Onayı
Önce `prompts/ana-sayfa/` klasöründe üretilecek bileşen prompt dosyalarının listesini göster ve **KULLANICI ONAYI BEKLE**.

### Adım 2: Bileşen Prompt Dosyalarını Oluşturma
Onay geldikten sonra aşağıdaki dosyaları `prompts/ana-sayfa/` dizininde tek tek oluştur:

1. **`prompts/ana-sayfa/01-hero-banner.md`**:
   - İçerik: BİLEŞEN PROMPT ŞABLONU yapısında. [DESIGN.md](file:///root/yigit-theme/DESIGN.md) Hero Banner analizi, [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md) `Display Hero` tipografisi, `#37435B` / `#E3E045` renkleri, `prompts/ortak/button.md` ve ikas `IMAGE` / `VIDEO` prop tipleri ile doldurulur.
2. **`prompts/ana-sayfa/02-press-ticker.md`**:
   - İçerik: As-Seen-In basın logoları marquee bandı (`25s linear infinite` keyframe animasyonu, `IMAGE_LIST` veya `COMPONENT_LIST`).
3. **`prompts/ana-sayfa/03-featured-collection-grid.md`**:
   - İçerik: Öne çıkan koleksiyon ürün ızgarası. `prompts/ortak/product-card.md` bileşenini alt çocuk olarak kullanır. ikas `PRODUCT_LIST` prop tipi.
4. **`prompts/ana-sayfa/04-image-with-text-block.md`**:
   - İçerik: Sol görsel, sağ metin/CTA karşılıklı düzen (Left/Right staggered layout).
5. **`prompts/ana-sayfa/05-product-features-icons.md`**:
   - İçerik: Ücretsiz Kargo, Hijyenik Kumaş, Ergonomik Destek 3'lü ikon ızgarası.
6. **`prompts/ana-sayfa/06-testimonials-carousel.md`**:
   - İçerik: Müşteri yorumları carousel'i (`#E3E062` yıldızlar, kart radius `2rem`).
7. **`prompts/ana-sayfa/07-video-demo-section.md`**:
   - İçerik: Ürün kullanım videosu autoplay banner alanı (ikas `VIDEO` prop tipi).

---

## 4. Sayfa Düzeyi Kurallar ve Token'lar
- **Container Genişliği:** `Boşluk / Site Maksimum Genişliği` (`1820px`).
- **Yatay Padding:** `Boşluk / Yatay Bölüm Padding` (Masaüstü: `20px`, Mobil: `16px`).
- **Dikey Spacing:** Section'lar arasında `Boşluk / Masaüstü Dikey Spacing` (`48px`) [Mobil: `32px`].
- **Ortak Bileşen Referansları:** Ortak bileşenler `prompts/ortak/` klasöründen okunur, yeniden tanımlanmaz.
