# PROMPT: Ortak Bileşen — Header & Main Navigation Bar (`prompts/ortak/header.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır.
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` / `IMAGE` / `LINK` prop'ları ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"Header"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; bileşeni yazmaya başlamadan önce `list_theme_globals` aracını çağır ve `cssVar` TAM değerini kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir; dizi tipleri açık (`X[]`) tanımlanmalıdır.
- **ikas Tipleri:** `IkasImage` vb. veri yapılarını TAHMİN ETME — [IKAS.md](file:///root/yigit-theme/IKAS.md)'deki doğrulanmış şemayı kullan. `IkasImage` üzerinde `.url` veya `.src` alanı YOKTUR; logo görsel URL'i için `@ikas/bp-storefront`'tan `getDefaultSrc(logoImage)` kullan.
- **İzinli Paketler:** Yalnızca [IKAS.md](file:///root/yigit-theme/IKAS.md)'deki izin verilen npm paketlerinden import yapılabilir (`preact`, `mobx`, `@ikas/bp-storefront`, `@ikas/bp-storefront-models`, `@ikas/component-utils`, `animejs`).

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Marka logosunu, ana navigasyon menüsünü, arama, hesap girişi ve sepet butonlarını tüm sayfalarda tutarlı biçimde sunmak.
- **Konum:** Sayfanın üst alanında (Announcement Bar altında). ikas `isHeader: true` section türündedir.

### 2. İç Yapı ve Düzen
- 3 Kolonlu Flex Layout:
  - Sol: Marka Logosu (veya Mobil Hamburger Menü İkonu)
  - Orta: Navigasyon Linkleri (`LIST_OF_LINK`)
  - Sağ: Arama, Hesap ve Sepet Butonları/Sayaçları
- Yükseklik: `60px` sabit yükseklik (`position: sticky`, `top: 0`, `z-index: 100`).

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `header_group` (Adı: `"Header ve Navigasyon Ayarları"`)
  1. `logo` (displayName: `"Marka Logosu"`, description: `"Header alanında görünecek logo görseli"`, type: `"IMAGE"`).
  2. `logoWidth` (displayName: `"Logo Genişliği (px)"`, description: `"Logonun genişlik boyutu"`, type: `"NUMBER"`, defaultValue: `160`).
  3. `navigation` (displayName: `"Ana Menü Bağlantıları"`, description: `"Header navigasyon menüsü bağlantıları"`, type: `"LIST_OF_LINK"`).
  4. `stickyHeader` (displayName: `"Sabit Header"`, description: `"Sayfa kaydırıldığında header üstte sabit kalsın"`, type: `"BOOLEAN"`, defaultValue: `true`).

### 4. Token Bağlantıları
- **Renkler:** `Renkler / Saf Beyaz` (`#FFFFFF` - Arka plan), `Renkler / Ana Lacivert` (`#37435B` - Menü yazıları & ikonlar), `Renkler / Accent Sarı` (`#E3E045` - Hover vurgu rengi), `Renkler / Sticky Header Çizgisi` (`rgba(0,0,0,0.08)` - Alt ayırıcı çizgi).
- **Tipografi:** `Tipografi / İkincil Metin (sm)` (16px/500 - Menü linkleri).
- **Global Variables:** `Boşluk / Header Yüksekliği` (`60px`), `Boşluk / Mobile Drawer Genişliği` (`320px`), `Animasyon / Menü Alt Çizgi` (`transform 0.25s ease`), `Animasyon / Drawer ve Modal` (`transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`), `Gölge / Sticky Header Shadow`.

### 5. Animasyonlar ve Mikro-Etkileşimler
- Menü Link Hover: Yazar metin rengi `#E3E045` olur, alttan çıkan çizgi `scaleX(1)` ile genişler (`transition: transform 0.25s ease`).
- Mobil Hamburger Tıklama: Soldan kayarak açılan mobil drawer (`width: 320px`, `transition: transform 0.35s ease-in-out`).

### 6. Responsive Davranış
- **1440px:** Masaüstü yatay menü görünür, hamburger gizlenir.
- **768px / 375px:** Masaüstü menü gizlenir, sol tarafa Hamburger ikonu eklenir.

### 7. Durumlar ve A11y
- **Cart Count:** Sepette ürün varsa sepet ikonunun yanında rozet biçiminde adet sayısı görünür.
- **A11y:** `<header>`, `<nav aria-label="Ana Menü">`, hamburger butonunda `aria-expanded` ve `aria-controls` kullanımı.
