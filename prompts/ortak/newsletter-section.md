# PROMPT: Ortak Bileşen — Newsletter Section (`prompts/ortak/newsletter-section.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır.
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` / `RICH_TEXT` prop'ları ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"NewsletterSection"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; bileşeni yazmaya başlamadan önce `list_theme_globals` aracını çağır ve `cssVar` TAM değerini kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir.
- **ikas Form Validator:** Bülten kayıt işlemi için `@ikas/bp-storefront`'tan `initNewsletterSubscriptionForm` ve `submitNewsletterSubscriptionForm` fonksiyonları kullanılmalıdır.
- **İzinli Paketler:** Yalnızca [IKAS.md](file:///root/yigit-theme/IKAS.md)'deki izin verilen npm paketlerinden import yapılabilir (`preact`, `mobx`, `@ikas/bp-storefront`, `@ikas/bp-storefront-models`, `@ikas/component-utils`).

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Müşterilerden e-posta bülten aboneliği toplamak.
- **Konum:** Ana sayfa, blog ve iletişim sayfalarının en alt bölümünde (Footer üstünde) yer alır.

### 2. İç Yapı ve Düzen
- Koyu Lacivert Zemin (`#37435B` - Scheme 3/4) veya Açık Zemin seçeneği.
- Ortalı Tipografi: H2 Başlık (`36px` - `48px`), Alt Açıklama (`18px`).
- E-posta Formu: Inline Input (`height: 48px`, `border-radius: 8px`) + Gönder Butonu (Ok ikonu veya "Abone Ol" butonu).

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `newsletter_group` (Adı: `"E-Bülten Form Ayarları"`)
  1. `title` (displayName: `"Bölüm Başlığı"`, description: `"Bülten kayıt alanı başlığı"`, type: `"TEXT"`, defaultValue: `"Yeniliklerden ve Fırsatlardan Haberdar Olun"`).
  2. `subtitle` (displayName: `"Alt Açıklama"`, description: `"Bülten kayıt alanı alt metni"`, type: `"TEXT"`, defaultValue: `"E-posta adresinizle kayıt olun, ilk siparişinizde %10 indirim kazanın."`).
  3. `placeholder` (displayName: `"Girdi İpucu Metni"`, description: `"E-posta kutusu içindeki ipucu metni"`, type: `"TEXT"`, defaultValue: `"E-posta adresinizi giriniz"`).
  4. `buttonText` (displayName: `"Buton Metni"`, description: `"Form gönderme butonu metni"`, type: `"TEXT"`, defaultValue: `"Abone Ol"`).

### 4. Token Bağlantıları
- **Renkler:** `Renkler / Ana Lacivert` (`#37435B`), `Renkler / Accent Sarı` (`#E3E045`), `Renkler / Saf Beyaz` (`#FFFFFF`), `Renkler / Açık Gri Mavi` (`#C8CFD0`).
- **Tipografi:** `Tipografi / Başlık H2` (48px/500), `Tipografi / Gövde Metni (base)` (18px/400).
- **Global Variables:** `Radius / Input ve Form` (`0.5rem` / `8px`), `Boşluk / Buton Yüksekliği` (`48px`), `Boşluk / Masaüstü Dikey Spacing` (`48px`), `Animasyon / Buton ve Hover`.

### 5. Animasyonlar ve Mikro-Etkileşimler
- Input Focus: E-posta kutusuna odaklanıldığında `#E3E045` (sarı) odaklama halkası oluşur (`transition: border-color 0.2s ease`).
- Form Gönderimi: Başarılı abonelikte yeşil/sarı onay mesajı belirir.

### 6. Responsive Davranış
- **1440px:** Yan yana veya ortalı geniş form düzeni.
- **375px:** Form girdisi ve buton alt alta dikey düzene geçer.

### 7. Durumlar ve A11y
- **Validasyon:** Geçersiz e-posta formatında kırmızı hata mesajı ("Lütfen geçerli bir e-posta adresi giriniz").
- **A11y:** `<form aria-label="E-Bülten Aboneliği">`, `<input type="email" required id="newsletter-email">`, `<label for="newsletter-email">`.
