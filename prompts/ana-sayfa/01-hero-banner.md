# PROMPT: Ana Sayfa — Hero Banner Section (`prompts/ana-sayfa/01-hero-banner.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md), [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır.
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` / `RICH_TEXT` / `IMAGE` prop'ları ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"HeroBanner"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) dosyasındaki canlı `cssVar`, `className` ve `variableName` değerlerini birebir kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir.
- **Ortak Bileşen Bağımlılığı:** Buton alanı için [prompts/ortak/button.md](file:///root/yigit-theme/prompts/ortak/button.md) ortak `Button` bileşenini kullan (`import { Button } from "../Button"`).

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Ana sayfanın en üstünde markanın ana değer önerisini, seyahat ve konfor sloganını yüksek görsel kalitede sunmak ve kullanıcıyı ürün incelemeye yönlendirmek.
- **Konum:** Ana Sayfa'da Header'ın hemen altında ilk sırada yer alır. ikas `type: "section"` türündedir.

### 2. İç Yapı ve Düzen
- Tam genişlik kapsayıcı (`width: 100%`) veya site genişliğine sınırlı layout seçeneği.
- Sol Kolon / Ortalı Tipografi:
  - Hero Ana Başlığı: `_78XkSXv7w4` (`Tipografi / Display Hero` - 54px / 500) veya `_DusX6I08Pv` (`Tipografi / Başlık H1` - 48px / 500).
  - Hero Alt Açıklama: `_VcfI5D07Nt` (`Tipografi / Gövde Metni (base)` - 18px / 400).
  - 2 Adet Eylem Butonu (Primary "Şimdi Keşfet" & Secondary "Videoyu İzle").
- Sağ Kolon / Arka Plan Görseli:
  - Yüksek çözünürlüklü marka yaşam tarzı görseli (ikas `IMAGE` prop tipi) veya opsiyonel video banner (`VIDEO` prop tipi).
  - Görsel üzerinde organik köşe yumuşatması (`_YFQAxlLvZl` -> `Radius / Medya` - 2rem / 32px).

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `hero_group` (Adı: `"Hero Banner Ayarları"`)
  1. `title` (displayName: `"Hero Başlığı"`, description: `"Ana sayfa en üst büyük slogan başlığı"`, type: `"TEXT"`, defaultValue: `"Her Yerde Kusursuz Uyku ve Seyahat Konforu"`).
  2. `subtitle` (displayName: `"Alt Açıklama"`, description: `"Başlık altındaki açıklama paragrafı"`, type: `"TEXT"`, defaultValue: `"Patentli ergonomik tasarımı ile boynunuzu destekler, seyahatlerinizi keyfe dönüştürür."`).
  3. `primaryButtonText` (displayName: `"Birincil Buton Metni"`, description: `"Ana eylem butonu yazısı"`, type: `"TEXT"`, defaultValue: `"Şimdi Keşfet"`).
  4. `primaryButtonLink` (displayName: `"Birincil Buton Linki"`, description: `"Ana buton yönlendirme bağlantısı"`, type: `"LINK"`).
  5. `secondaryButtonText` (displayName: `"İkincil Buton Metni"`, description: `"İkinci eylem butonu yazısı"`, type: `"TEXT"`, defaultValue: `"Ürünü İncele"`).
  6. `secondaryButtonLink` (displayName: `"İkincil Buton Linki"`, description: `"İkinci buton yönlendirme bağlantısı"`, type: `"LINK"`).
  7. `image` (displayName: `"Hero Görseli"`, description: `"Hero alanında gösterilecek ana görsel"`, type: `"IMAGE"`).
  8. `backgroundColor` (displayName: `"Arka Plan Rengi"`, description: `"Bölüm zemin rengi"`, type: `"COLOR"`).

### 4. Token Bağlantıları
- **Renkler:** `var(--pxNuSoudLn)` (#37435B Ana Lacivert), `var(--sy8ZnXZdoG)` (#E3E045 Accent Sarı), `var(--24KlcgGmm9)` (#FFFFFF Saf Beyaz).
- **Tipografi:** `_78XkSXv7w4` (`Tipografi / Display Hero` - 54px), `_DusX6I08Pv` (`Tipografi / Başlık H1` - 48px), `_VcfI5D07Nt` (`Tipografi / Gövde Metni (base)` - 18px).
- **Global Variables:** `_Kl0my3VVMA` (`Boşluk / Masaüstü Dikey Spacing`), `_5Fdl1j6UHQ` (`Boşluk / Dikey Bölüm Spacing`), `_Nd1XnRyZlx` (`Boşluk / Yatay Bölüm Padding`), `_YFQAxlLvZl` (`Radius / Medya`).

### 5. Responsive Davranış
- **1440px:** 2 Kolonlu yan yana esnek grid düzeni.
- **768px / 375px:** Dikey alt alta sıralama, metinler ortalı, butonlar tam genişlik kaplayabilir.
