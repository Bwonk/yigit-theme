# PROMPT: Ortak Bileşen — Product Card (`prompts/ortak/product-card.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır.
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — dinamik ikas `PRODUCT` verisi veya `PRODUCT_LIST` kullanılır.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"ProductCard"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; bileşeni yazmaya başlamadan önce `list_theme_globals` aracını çağır ve `cssVar` TAM değerini kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir. Dizi ve `IkasProduct` tipleri [IKAS.md](file:///root/yigit-theme/IKAS.md)'deki gerçek alan adlarıyla kullanılır (`name`, `variants`, `stars`, `averageRating`, `reviewCount`).
- **ikas Tipleri:** `IkasImage` üzerinde `.url` veya `.src` alanı YOKTUR; ürün resmi için `@ikas/bp-storefront`'tan `getSrc(product.mainImage, 400)` veya `getDefaultSrc` kullan.
- **İzinli Paketler:** Yalnızca [IKAS.md](file:///root/yigit-theme/IKAS.md)'deki izin verilen npm paketlerinden import yapılabilir (`preact`, `mobx`, `@ikas/bp-storefront`, `@ikas/bp-storefront-models`, `@ikas/component-utils`).

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Ürün bilgilerini (görsel, başlık, yıldız puanı, fiyat, indirim rozeti, hızlı ekle) kart formatında sergilemek.
- **Konum:** Ana sayfa öne çıkan koleksiyonlar, koleksiyon listesi, PDP ilişkili ürünler ve arama sonuçlarında tekrar eden temel bileşendir.

### 2. İç Yapı ve Düzen
1. Görsel Konteyneri: `aspect-ratio: 1/1`, `border-radius: 32px` (`2rem`), `overflow: hidden`.
2. Sol Üst Rozet: İndirim yüzdesi / Badge (`#E3E045` zemin, `#37435B` metin, `font-size: 13.5px`).
3. Yıldız Değerlendirmesi: `#E3E062` yıldız ikonu + `averageRating` (örn. `4.9`) + parantez içinde `reviewCount`.
4. Ürün Başlığı: `Jost`, `18px`, `font-weight: 500`, `#37435B`.
5. Fiyat Ekranı: `18px`, `font-weight: 600`. İndirimli fiyat yan yana eski fiyat (üzeri çizili).
6. Hızlı Varyant / Sepete Ekle Butonu: Buton hover'da renk değiştirir.

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `product_card_group` (Adı: `"Ürün Kartı Ayarları"`)
  1. `product` (displayName: `"Ürün"`, description: `"Kartta gösterilecek ikas ürünü"`, type: `"PRODUCT"`).
  2. `showRating` (displayName: `"Yıldız Puanını Göster"`, description: `"Ürünün değerlendirme puanını kartta göster"`, type: `"BOOLEAN"`, defaultValue: `true`).
  3. `showQuickAdd` (displayName: `"Hızlı Sepete Ekle Butonu"`, description: `"Kart üzerinde hızlı ekle butonunu aktif et"`, type: `"BOOLEAN"`, defaultValue: `true`).

### 4. Token Bağlantıları
- **Renkler:** `Renkler / Ana Lacivert` (`#37435B` - Başlık & Fiyat), `Renkler / Accent Sarı` (`#E3E045` - Rozet), `Renkler / İndirim Rozet Metni` (`#37435B`), `Renkler / Yıldız Sarısı` (`#E3E062` - Yıldızlar).
- **Tipografi:** `Tipografi / Gövde Metni (base)` (18px/500 - Başlık), `Tipografi / Etiket ve Rozet (xs)` (13.5px/500 - Rozet).
- **Global Variables:** `Radius / Kart` (`2rem` / `32px`), `Boşluk / Grid Gap` (`1.25rem` / `20px`), `Animasyon / Görsel Scale Hover` (`transform 0.5s ease-out`), `Gölge / Kart Soft Shadow`.

### 5. Animasyonlar ve Mikro-Etkileşimler
- Hover Durumu: Kart üstüne gelindiğinde ürün ana görseli `scale(1.05)` büyür, ikinci görsel varsa `opacity: 1` ile görünür (`transition: transform 0.5s ease-out, opacity 0.4s ease`).
- Hızlı Ekle Tıklama: Tıklandığında sepet ikonunda yüklenme çarkı (spinner) belirir.

### 6. Responsive Davranış
- **1440px:** 4 Sütunlu Grid (`gap: 20px`).
- **768px:** 2 Sütunlu Grid (`gap: 16px`).
- **375px:** 1 veya 2 Sütunlu Grid (`gap: 12px`).

### 7. Durumlar ve A11y
- **Stoksuz Durum:** Ürün stoğu yoksa görsel üzerinde "Tükendi" etiketi görünür.
- **A11y:** Görsel `altText` kullanımı, kart linki üzerinde `aria-label="${product.name} detaylarını incele"`.
