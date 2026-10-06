# PROMPT: Ortak Bileşen — Footer (`prompts/ortak/footer.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır.
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` / `LIST_OF_LINK` prop'ları ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"Footer"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; bileşeni yazmaya başlamadan önce `list_theme_globals` aracını çağır ve `cssVar` TAM değerini kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir.
- **İzinli Paketler:** Yalnızca [IKAS.md](file:///root/yigit-theme/IKAS.md)'deki izin verilen npm paketlerinden import yapılabilir (`preact`, `mobx`, `@ikas/bp-storefront`, `@ikas/bp-storefront-models`, `@ikas/component-utils`).

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Alt navigasyon bağlantılarını, kurumsal telif haklarını, sosyal medya ikonlarını ve kabul edilen ödeme sağlayıcı ikonlarını sunmak.
- **Konum:** Tüm sayfaların en altında yer alır. ikas `isFooter: true` section türündedir.

### 2. İç Yapı ve Düzen
- Arka Plan: Koyu Lacivert Zemin (`#37435B` - Scheme 3).
- 4 Kolonlu Izgara Yapısı:
  1. Kolon 1: Kurumsal Hakkında ve Logo
  2. Kolon 2: Hızlı Linkler (`LIST_OF_LINK`)
  3. Kolon 3: Müşteri Hizmetleri & Politikalar (`LIST_OF_LINK`)
  4. Kolon 4: Sosyal Medya İkonları
- Alt Telif Bandı (Bottom Bar): Telif Metni (Copyright) + Ödeme Yöntemi İkonları (Visa, Mastercard, Amex, Apple Pay).

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `footer_group` (Adı: `"Footer Ayarları"`)
  1. `copyrightText` (displayName: `"Telif Hakkı Metni"`, description: `"Footer en altındaki telif metni"`, type: `"TEXT"`, defaultValue: `"© 2026 Infinity Pillow. Tüm hakları saklıdır."`).
  2. `quickLinks` (displayName: `"Hızlı Linkler Menüsü"`, description: `"Footer hızlı erişim menü bağlantıları"`, type: `"LIST_OF_LINK"`).
  3. `customerServiceLinks` (displayName: `"Müşteri Hizmetleri Menüsü"`, description: `"Yardım ve politika bağlantıları"`, type: `"LIST_OF_LINK"`).
  4. `showPaymentIcons` (displayName: `"Ödeme İkonlarını Göster"`, description: `"Alt bantta ödeme kartı ikonlarını göster"`, type: `"BOOLEAN"`, defaultValue: `true`).

### 4. Token Bağlantıları
- **Renkler:** `Renkler / Ana Lacivert` (`#37435B` - Arka plan), `Renkler / Saf Beyaz` (`#FFFFFF` - Başlıklar & Metinler), `Renkler / Açık Gri Mavi` (`#C8CFD0` - İkincil yazılar), `Renkler / Accent Sarı` (`#E3E045` - Hover rengi).
- **Tipografi:** `Tipografi / İkincil Metin (sm)` (16px/400 - Footer linkleri), `Tipografi / Kart ve Alt Başlık (lg)` (24px/500 - Kolon başlıkları).
- **Global Variables:** `Boşluk / Yatay Bölüm Padding` (`1.25rem` / `20px`), `Boşluk / Masaüstü Dikey Spacing` (`48px`), `Animasyon / Menü Alt Çizgi`.

### 5. Animasyonlar ve Mikro-Etkileşimler
- Footer Link Hover: Yazar metin rengi `#E3E045` rengine döner (`transition: color 0.2s ease`).

### 6. Responsive Davranış
- **1440px:** 4 Kolonlu yatay düzen (`gap: 32px`).
- **768px:** 2 Kolonlu ızgara düzeni.
- **375px:** Kolonlar dikey tek sütun olarak sıralanır, başlıklar tıklanabilir akordiyona dönüşür (`0.35s ease-in-out`).

### 7. Durumlar ve A11y
- **A11y:** `<footer>`, `<nav aria-label="Footer Menüsü">`, ödeme ikonlarında açıklayıcı `alt` etiketleri.
