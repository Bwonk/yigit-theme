# PROMPT: Ortak Bileşen — Button (`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır (teknik `name` hariç).
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` prop'u ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"Button"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; bileşeni yazmaya başlamadan önce `list_theme_globals` aracını çağır ve `cssVar` TAM değerini kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir.
- **İzinli Paketler:** Yalnızca [IKAS.md](file:///root/yigit-theme/IKAS.md)'deki izin verilen npm paketlerinden import yapılabilir (`preact`, `mobx`, `@ikas/bp-storefront`, `@ikas/bp-storefront-models`, `@ikas/component-utils`).
- **Tekil Tanım:** Tüm temadaki butonlar (Hero CTA, Ürün Kartı Hızlı Ekle, Satın Al, Bülten Kayıt, 404 Yönlendirme vb.) bu ortak bileşen/stil katmanı üzerinden yönetilir. Her bileşen kendi buton stilini sıfırdan yazmaz.

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Tema genelinde birincil (Primary) ve ikincil (Secondary) aksiyon butonlarını tutarlı stil, animasyon ve etkileşimlerle sunmak.
- **Konum:** Hero banner, ürün detay satın alma alanı, sepet ödeme butonu, bülten aboneliği, 404 yönlendirmesi ve tüm form aksiyonlarında kullanılır.

### 2. İç Yapı ve Boyutlar
- **Yükseklik:** `48px` (`Boşluk / Buton Yüksekliği`). Sepet ve ödeme butonlarında `52px` (`Boşluk / Checkout Buton Yüksekliği`).
- **Köşe Yuvarlama:** `8px` (`0.5rem` - `Radius / Buton`).
- **Metin Düzeni:** Ortalı flex düzen, `Jost`, `18px`, `font-weight: 500`, `text-transform: uppercase`, `letter-spacing: normal`.

### 3. Prop Listesi (`ikas.config.json` veya Alt Bileşen Prop'ları)
- **Prop Grubu:** `button_group` (Adı: `"Buton Ayarları"`)
  1. `text` (displayName: `"Buton Metni"`, description: `"Buton üzerinde görünecek metin"`, type: `"TEXT"`, defaultValue: `"İncele"`).
  2. `variant` (displayName: `"Buton Varyantı"`, description: `"Butonun görsel stili"`, type: `"ENUM"`, options: `["PRIMARY", "SECONDARY", "ACCENT"]`, defaultValue: `"PRIMARY"`).
  3. `link` (displayName: `"Buton Bağlantısı"`, description: `"Tıklandığında yönlendirilecek sayfa linki"`, type: `"LINK"`).
  4. `fullWidth` (displayName: `"Tam Genişlik"`, description: `"Buton kapsayıcısının tüm genişliğini kaplasın"`, type: `"BOOLEAN"`, defaultValue: `false`).

### 4. Varyantlar ve Stil Değerleri
- **Primary Variant (`PRIMARY`):**
  - Arka Plan: `#37435B` (`Renkler / Ana Lacivert`).
  - Yazı Rengi: `#FFFFFF` (`Renkler / Saf Beyaz`).
  - Kenarlık: Yok (`0px`).
- **Accent Variant (`ACCENT`):**
  - Arka Plan: `#E3E045` (`Renkler / Accent Sarı`).
  - Yazı Rengi: `#37435B` (`Renkler / Ana Lacivert`).
- **Secondary Variant (`SECONDARY`):**
  - Arka Plan: `transparent` (`Renkler / Şeffaf`).
  - Yazı Rengi: `#37435B` (`Renkler / Ana Lacivert`).
  - Kenarlık: `1px solid #C8CFD0` (`Renkler / Açık Gri Mavi`).

### 5. Tüm Durumlar (States) ve Animasyonlar
- **Hover Durumu:**
  - Arka plan `#E3E045` (Primary için) veya `#37435B` (Secondary için) rengine yumuşakça döner.
  - `transform: translateY(-1px)` yükselme efekti.
  - Gölge: `Gölge / Buton Drop Shadow` (`box-shadow: 0 -1px 1px rgba(227, 224, 69, 0.5)`).
  - Süre & Easing: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (`Animasyon / Buton ve Hover`).
- **Active / Pressed Durumu:** `transform: translateY(0)` veya `scale(0.98)` basılma efekti.
- **Focus-Visible Durumu:** `outline: 2px solid #E3E045`, `outline-offset: 2px` erişilebilirlik halkası.
- **Disabled Durumu:** `opacity: 0.5`, `cursor: not-allowed`, `pointer-events: none`.
- **Loading Durumu:** Yüklenme çarkı (spinner) belirir, buton metni gizlenir veya transparan olur, `aria-busy="true"`.

### 6. Responsive Davranış
- **1440px / 768px:** Buton yüksekliği 48px, padding `0 24px`.
- **375px:** Mobil ekranlarda `fullWidth: true` opsiyonu ile tam genişlik kaplama.

### 7. A11y (Erişilebilirlik)
- `<button>` veya `<a role="button">` semantik HTML kullanımı.
- Dokunma hedefi yüksekliği minimum `48px` (WCAG 44px kuralına uygun).
- Yüksek renk kontrastı (`#37435B` üzeri `#FFFFFF` ve `#E3E045` üzeri `#37435B`).
