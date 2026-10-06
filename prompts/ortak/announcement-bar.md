# PROMPT: Ortak Bileşen — Announcement Bar (`prompts/ortak/announcement-bar.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır (teknik `name` hariç).
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` prop'u ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (ör. `"AnnouncementBar"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; bileşeni yazmaya başlamadan önce `list_theme_globals` aracını çağır ve `cssVar` TAM değerini kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir; dizi tipleri açık (`X[]`) tanımlanmalıdır.
- **ikas Tipleri:** `IkasImage` vb. veri yapılarını TAHMİN ETME — [IKAS.md](file:///root/yigit-theme/IKAS.md)'deki doğrulanmış şemayı kullan. `IkasImage` üzerinde `.url` veya `.src` alanı YOKTUR; CDN URL'i için `@ikas/bp-storefront`'tan `getDefaultSrc(image)` kullan.
- **İzinli Paketler:** Yalnızca [IKAS.md](file:///root/yigit-theme/IKAS.md)'deki izin verilen npm paketlerinden import yapılabilir (`preact`, `mobx`, `@ikas/bp-storefront`, `@ikas/bp-storefront-models`, `@ikas/component-utils`, `animejs`). Harici paket import'u build'i patlatır.

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Ücretsiz kargo, indirim veya kampanya duyurularını sayfanın en üstünde dikkat çekici şekilde sunmak.
- **Konum:** Tüm sayfaların en üstünde, `<site-header>` öncesinde yer alır. ikas `isHeader: true` section türündedir.

### 2. İç Yapı ve Düzen
- Flexbox merkezlenmiş dikey ve yatay düzen.
- Yükseklik: `38px` (Masaüstü/Tablet), `36px` (Mobil).
- Metin Hizalaması: Ortalı. Sol ve sağ tarafta opsiyonel ok butonları veya otomatik carousel.

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `announcement_group` (Adı: `"Duyuru Bandı Ayarları"`)
  1. `text` (displayName: `"Duyuru Metni"`, description: `"Sayfanın üstünde görünecek kampanya duyuru metni"`, type: `"TEXT"`, defaultValue: `"500 TL Üzeri Siparişlerde Ücretsiz Kargo"`).
  2. `link` (displayName: `"Duyuru Bağlantısı"`, description: `"Tıklandığında yönlendirilecek sayfa veya harici link"`, type: `"LINK"`).
  3. `autoRotate` (displayName: `"Otomatik Döndür"`, description: `"Birden fazla duyuru varsa otomatik geçiş yap"`, type: `"BOOLEAN"`, defaultValue: `true`).

### 4. Token Bağlantıları
- **Renkler:** `Renkler / Ana Lacivert` (`#37435B` - Arka plan), `Renkler / Saf Beyaz` (`#FFFFFF` - Metin rengi).
- **Tipografi:** `Tipografi / İkincil Metin (sm)` (Masaüstü: 16px/500), `Tipografi / Mobil Duyuru Metni` (Mobil: 12px/500).
- **Global Variables:** `Boşluk / Announcement Bar Yüksekliği` (`38px`), `Animasyon / Fade Yumuşak` (`opacity 0.3s ease-in-out`).

### 5. Animasyonlar ve Mikro-Etkileşimler
- Metin Otomatik Geçişi: `opacity 0.3s ease-in-out` fade animasyonu.
- Hover: Duyuru metni veya linki üzerine gelindiğinde `opacity: 0.85` hafif şeffaflık.

### 6. Responsive Davranış
- **1440px / 768px:** Metin boyutu 16px, padding `0 20px`.
- **375px:** Metin boyutu 12px, padding `0 12px`, 1 satıra sığmayan metinler `text-overflow: ellipsis` ile elenir.

### 7. Durumlar ve A11y
- **Edge Case:** Duyuru metni boş bırakılırsa band gizlenir.
- **A11y:** `<aside aria-label="Duyuru Bandı">` semantik HTML kullanımı, minimum 44px tıklama alanı (link için).
