# PROMPT: Ana Sayfa — Testimonials Carousel (`prompts/ana-sayfa/06-testimonials-carousel.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md), [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır.
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` prop'ları ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"TestimonialsCarousel"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) dosyasındaki canlı `cssVar`, `className` ve `variableName` değerlerini birebir kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir.

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Doğrulanmış müşteri değerlendirmelerini, 5 yıldızlı puanları ve kullanıcı yorumlarını kaydırmalı kartlar (carousel) halinde sunarak güven oluşturmak.
- **Konum:** Product Features Icons bölümünün altında 6. sırada yer alır. ikas `type: "section"` türündedir.

### 2. İç Yapı ve Düzen
- Başlık Alanı: H2 Başlık (`_sKAMD8d1LA` - 36px) + Alt Açıklama (`_VcfI5D07Nt` - 18px).
- Yorum Kartları Carousel Düzeni:
  - Kart Zemin Rengi: `var(--24KlcgGmm9)` (Beyaz) veya `var(--cdFDkBbKkc)` (Açık Gri Mavi %20).
  - Kart Radius: `_WyFUVwOpPk` (`Radius / Kart` - 2rem / 32px), `_yyUleMlhR4` (`Gölge / Kart Soft Shadow`).
  - Yıldız Puanlama: 5 Adet Sarı Yıldız İkonu (`var(--cGupQGnbYq)` - `Yıldız Sarısı` #E3E062).
  - Müşteri Yorum Metni: `_VcfI5D07Nt` (`Tipografi / Gövde Metni (base)`).
  - Müşteri Adı & Unvanı: `_eZyocyyd0F` (`Tipografi / Etiket ve Rozet (xs)`).

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `testimonials_group` (Adı: `"Müşteri Yorumları Ayarları"`)
  1. `title` (displayName: `"Bölüm Başlığı"`, description: `"Müşteri yorumları başlığı"`, type: `"TEXT"`, defaultValue: `"Kullanıcılarımızın Deneyimleri"`).
  2. `subtitle` (displayName: `"Alt Açıklama"`, description: `"Bölüm alt metni"`, type: `"TEXT"`, defaultValue: `"Binlerce mutlu gezginin seyahat deneyimleri hakkındaki görüşleri."`).
  3. `testimonial1Text` (displayName: `"1. Yorum Metni"`, description: `"İlk müşteri yorumu"`, type: `"TEXT"`, defaultValue: `"12 saatlik uçak yolculuğunda ilk defa boyun ağrısı çekmeden uyudum. Harika bir tasarım!"`).
  4. `testimonial1Author` (displayName: `"1. Yorum Yapan"`, description: `"Müşteri adı"`, type: `"TEXT"`, defaultValue: `"Zeynep A. — Doğrulanmış Alıcı"`).
  5. `testimonial2Text` (displayName: `"2. Yorum Metni"`, description: `"İkinci müşteri yorumu"`, type: `"TEXT"`, defaultValue: `"Kumaş kalitesi ve katlanabilir olması çok pratik. Çantamdan hiç ayırmıyorum."`).
  6. `testimonial2Author` (displayName: `"2. Yorum Yapan"`, description: `"Müşteri adı"`, type: `"TEXT"`, defaultValue: `"Caner T. — Sık Seyahat Eden"`).

### 4. Token Bağlantıları
- **Renkler:** `var(--pxNuSoudLn)` (#37435B), `var(--cGupQGnbYq)` (#E3E062 Yıldız Sarısı), `var(--24KlcgGmm9)` (#FFFFFF).
- **Tipografi:** `_sKAMD8d1LA` (`Tipografi / Başlık H2`), `_VcfI5D07Nt` (`Tipografi / Gövde Metni base`), `_eZyocyyd0F` (`Tipografi / Etiket ve Rozet xs`).
- **Global Variables:** `_WyFUVwOpPk` (`Radius / Kart` - 32px), `_yyUleMlhR4` (`Gölge / Kart Soft Shadow`).

### 5. Responsive Davranış
- **1440px / 768px:** 3 veya 2 Kart yan yana kaydırmalı düzen (Prev/Next ok butonları ile).
- **375px:** Tek kart dokunmatik kaydırmalı (touch swipe) mobil görünüm.
