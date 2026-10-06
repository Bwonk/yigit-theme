# PROMPT: Ana Sayfa — Video Demo Section (`prompts/ana-sayfa/07-video-demo-section.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md), [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır.
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` / `VIDEO` / `IMAGE` prop'ları ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"VideoDemoSection"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) dosyasındaki canlı `cssVar`, `className` ve `variableName` değerlerini birebir kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir.
- **Video Kontrolü:** Autoplay/Muted seçeneği veya merkezde büyük Oynat (Play) butonu ile interaktif diyalog modal video oynatıcısı.

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Ürünün nasıl katlandığını, çantaya nasıl yerleştiğini ve boyuna nasıl takıldığını anlatan yüksek çözünürlüklü video gösterim alanı sunmak.
- **Konum:** Testimonials Carousel bölümünün altında, Newsletter Section'ın üstünde 7. sırada yer alır. ikas `type: "section"` türündedir.

### 2. İç Yapı ve Düzen
- Tam genişlikte veya kavisli kapak alanı (`Radius / Medya` - `_YFQAxlLvZl` - 2rem / 32px).
- Karartma Overlay Katmanı: `var(--fRUyppFgyp)` (`Renkler / Overlay Siyah` - `rgba(55, 67, 91, 0.75)`).
- Orta Eylem Butonu:
  - Dairesel Sarı Oynat Butonu (`width: 80px`, `height: 80px`, `background: var(--sy8ZnXZdoG)`).
  - Hover Esnasında Büyüme Efekti (`transform: scale(1.1)`).
- Tipografi:
  - H2 Başlık: `_sKAMD8d1LA` (`Tipografi / Başlık H2` - 36px / Beyaz Metin).
  - Alt Metin: `_VcfI5D07Nt` (`Tipografi / Gövde Metni (base)` - 18px).

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `video_demo_group` (Adı: `"Video Tanıtım Ayarları"`)
  1. `title` (displayName: `"Bölüm Başlığı"`, description: `"Video alanı başlığı"`, type: `"TEXT"`, defaultValue: `"Infinity Pillow Nasıl Kullanılır?"`).
  2. `subtitle` (displayName: `"Alt Açıklama"`, description: `"Video alt açıklama metni"`, type: `"TEXT"`, defaultValue: `"Saniyeler içinde katlayın, çantanıza koyun ve konforun tadını çıkarın."`).
  3. `video` (displayName: `"Tanıtım Videosu"`, description: `"Gösterilecek video kaynağı"`, type: `"VIDEO"`).
  4. `coverImage` (displayName: `"Kapak Görseli"`, description: `"Video oynatılmadan önce görünecek kapak fotoğrafı"`, type: `"IMAGE"`).
  5. `autoplay` (displayName: `"Otomatik Oynat"`, description: `"Sayfa açıldığında sessiz otomatik oynat"`, type: `"BOOLEAN"`, defaultValue: false).

### 4. Token Bağlantıları
- **Renkler:** `var(--24KlcgGmm9)` (#FFFFFF), `var(--sy8ZnXZdoG)` (#E3E045 Accent Sarı), `var(--fRUyppFgyp)` (Overlay Siyah).
- **Tipografi:** `_sKAMD8d1LA` (`Tipografi / Başlık H2`), `_VcfI5D07Nt` (`Tipografi / Gövde Metni base`).
- **Global Variables:** `_YFQAxlLvZl` (`Radius / Medya` - 32px), `_Kl0my3VVMA` (`Boşluk / Masaüstü Dikey Spacing`).

### 5. Responsive Davranış
- **1440px / 768px / 375px:** 16:9 Oranında tüm ekranlarda oranını korur; mobilde play butonu `60px` boyutuna ölçeklenir.
