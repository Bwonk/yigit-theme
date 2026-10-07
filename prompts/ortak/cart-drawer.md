# PROMPT: Ortak Bileşen — Slide-Out Cart Drawer (`prompts/ortak/cart-drawer.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır.
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` prop'ları ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"CartDrawer"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; bileşeni yazmaya başlamadan önce `list_theme_globals` aracını çağır ve `cssVar` TAM değerini kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir.
- **ikas Storefront API:** Sepet verileri ve işlemleri için `@ikas/bp-storefront`'tan `cartStore` (`getCart()`, `changeCartItemQuantity()`, `removeItem()`) ve `customerStore` kullanılmalıdır.
- **İzinli Paketler:** Yalnızca [IKAS.md](file:///root/yigit-theme/IKAS.md)'deki izin verilen npm paketlerinden import yapılabilir (`preact`, `mobx`, `@ikas/bp-storefront`, `@ikas/bp-storefront-models`, `@ikas/component-utils`).

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Kullanıcı sepete ürün eklediğinde veya sepet ikonuna tıkladığında sağdan kayarak açılan hızlı sepet yönetim paneli.
- **Konum:** Tüm sayfalarda en üst katmanda (`z-index: 1000`), ekranın sağ tarafında sabitlenmiş drawer paneli (`position: fixed`, `right: 0`, `top: 0`, `height: 100vh`).

### 2. İç Yapı ve Düzen
1. Backdrop Overlay: `rgba(55, 67, 91, 0.75)` karartma katmanı.
2. Drawer Header: "Sepetiniz" Başlığı, Ürün Adedi ve Kapat (`X`) Butonu.
3. Free Shipping Bar: Ücretsiz kargo için kalan tutarı gösteren dinamik ilerleme çubuğu (`height: 8px`, `border-radius: 4px`, dolgu rengi: `#E3E045`).
4. Sepet İtem Listesi: Ürün Görseli (`80x80px`, `radius: 12px`), Ürün Adı, Seçili Varyant, Miktar Butonları (`-`/`+`), Fiyat ve Sil Butonu.
5. Sipariş Notu (Order Note): Tıklanınca açılan metin kutusu.
6. Footer & Checkout: Ara Toplam Fiyatı, "Ödemeye Geç" CTA Butonu (`height: 52px`, `#37435B` zemin, `#FFFFFF` metin, `uppercase`).

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `cart_drawer_group` (Adı: `"Sepet Çekmecesi Ayarları"`)
  1. `freeShippingThreshold` (displayName: `"Ücretsiz Kargo Limiti (TL)"`, description: `"Ücretsiz kargo barı için hedef tutar"`, type: `"NUMBER"`, defaultValue: `500`).
  2. `emptyCartTitle` (displayName: `"Boş Sepet Başlığı"`, description: `"Sepet boşken gösterilecek başlık"`, type: `"TEXT"`, defaultValue: `"Sepetiniz Şu Anda Boş"`).
  3. `emptyCartButtonText` (displayName: `"Alışverişe Devam Et Metni"`, description: `"Boş sepet buton metni"`, type: `"TEXT"`, defaultValue: `"Alışverişe Başla"`).

### 4. Token Bağlantıları
- **Renkler:** `Renkler / Saf Beyaz` (`#FFFFFF` - Arka plan), `Renkler / Ana Lacivert` (`#37435B` - Başlık & Buton), `Renkler / Kargo İlerleme Çubuğu` (`#E3E045`), `Renkler / Overlay Siyah` (`rgba(55,67,91,0.75)`).
- **Tipografi:** `Tipografi / Başlık H3` (30.2px/500 - Drawer başlığı), `Tipografi / Gövde Metni (base)` (18px/400 - Ürün adı).
- **Global Variables:** `Boşluk / Cart Drawer Genişliği` (`420px`), `Boşluk / Checkout Buton Yüksekliği` (`52px`), `Radius / Sepet İtem Görseli` (`12px`), `Radius / Kargo İlerleme Çubuğu` (`4px`), `Animasyon / Drawer ve Modal` (`transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`).

### 5. Animasyonlar ve Mikro-Etkileşimler
- Açılış/Kapanış: Panelin sağ dışarıdan ekran içine kayması (`transform: translateX(0)` vs `transform: translateX(100%)`, `transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`). Overlay `opacity: 0` -> `opacity: 1`.

### 6. Responsive Davranış
- **1440px / 768px:** Genişlik `420px`.
- **375px:** Genişlik `%100` (Tam ekran mobil çekmece).

### 7. Durumlar ve A11y
- **Boş Sepet Durumu:** Sepette ürün olmadığında boş sepet ikonu, `emptyCartTitle` ve "Alışverişe Başla" CTA butonu gösterilir.
- **A11y:** `role="dialog"`, `aria-modal="true"`, `aria-label="Alışveriş Sepeti"`, klavye `ESC` tuşu ile kapanma desteği.
