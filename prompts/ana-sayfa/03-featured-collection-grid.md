# PROMPT: Ana Sayfa — Featured Collection Grid (`prompts/ana-sayfa/03-featured-collection-grid.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md), [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır.
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` / `PRODUCT_LIST` prop'ları ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"FeaturedCollectionGrid"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) dosyasındaki canlı `cssVar`, `className` ve `variableName` değerlerini birebir kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir.
- **Ortak Bileşen Bağımlılığı:** Her bir ürün kartı için [prompts/ortak/product-card.md](file:///root/yigit-theme/prompts/ortak/product-card.md) ortak `ProductCard` bileşenini alt çocuk olarak render et (`import { ProductCard } from "../ProductCard"`).

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Mağazanın en çok satan, öne çıkan veya yeni seyahat yastığı koleksiyon ürünlerini ızgara (grid) düzeninde sergilemek.
- **Konum:** Press Logo Ticker bölümünün altında 3. sırada yer alır. ikas `type: "section"` türündedir.

### 2. İç Yapı ve Düzen
- Üst Bölüm: H2 Başlık (`_sKAMD8d1LA` - 36px / 500) + Alt Açıklama (`_VcfI5D07Nt` - 18px).
- Izgara Alanı:
  - Masaüstü (1440px): 4 Kolonlu ızgara (`gap: var(--grid-gap, 20px)`).
  - Tablet (768px): 2 veya 3 Kolonlu ızgara (`gap: var(--tablet-grid-gap, 16px)`).
  - Mobil (375px): 2 Kolonlu sıkışık ızgara (`gap: var(--mobile-grid-gap, 12px)`).
- Alt Bölüm: "Tüm Koleksiyonu İncele" CTA butonu ([prompts/ortak/button.md](file:///root/yigit-theme/prompts/ortak/button.md) entegrasyonu).

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `featured_collection_group` (Adı: `"Öne Çıkan Koleksiyon Ayarları"`)
  1. `title` (displayName: `"Bölüm Başlığı"`, description: `"Koleksiyon alanı ana başlığı"`, type: `"TEXT"`, defaultValue: `"En Çok Tercih Edilen Ürünlerimiz"`).
  2. `subtitle` (displayName: `"Alt Açıklama"`, description: `"Koleksiyon alanı alt açıklama metni"`, type: `"TEXT"`, defaultValue: `"Seyahatlerinizde maksimum boyun desteği sağlayan patentli modellerimiz."`).
  3. `products` (displayName: `"Ürün Listesi"`, description: `"Izgarada gösterilecek ikas ürünleri"`, type: `"PRODUCT_LIST"`).
  4. `itemCount` (displayName: `"Gösterilecek Ürün Sayısı"`, description: `"Maksimum ürün adedi"`, type: `"NUMBER"`, defaultValue: 4).
  5. `showViewAllButton` (displayName: `"Tümünü Gör Butonunu Göster"`, description: `"Alt eylem butonunu görünür yap"`, type: `"BOOLEAN"`, defaultValue: true).
  6. `viewAllButtonText` (displayName: `"Buton Metni"`, description: `"Tüm koleksiyonu incele buton metni"`, type: `"TEXT"`, defaultValue: `"Tüm Modelleri İncele"`).

### 4. Token Bağlantıları
- **Renkler:** `var(--pxNuSoudLn)` (#37435B), `var(--24KlcgGmm9)` (#FFFFFF).
- **Tipografi:** `_sKAMD8d1LA` (`Tipografi / Başlık H2` - 36px / 500), `_VcfI5D07Nt` (`Tipografi / Gövde Metni (base)` - 18px).
- **Global Variables:** `_4Ud47RIVna` (`Boşluk / Grid Gap` - 20px), `_dBvnJWALXD` (`Boşluk / Mobil Grid Gap` - 12px), `_mfIn0YsoTT` (`Boşluk / Tablet Grid Gap` - 16px), `_Kl0my3VVMA` (`Boşluk / Masaüstü Dikey Spacing` - 48px).

### 5. Responsive Davranış
- **1440px:** 4 Sütun `grid-template-columns: repeat(4, 1fr)`.
- **768px:** 2 Sütun `grid-template-columns: repeat(2, 1fr)`.
- **375px:** 2 Sütun mobil dikey kart yerleşimi.
