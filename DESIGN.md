# DESIGN.md — Infinity Pillow Tema Tasarım Dokümanı

> **Güncel tasarım kaynağı:** `prompts/referans/Anasayfa.dc.html` (Claude Design çıktısı) ve
> `prompts/referans/SearchMinimal.dc.html`. Bunlar **hedef görsellerdir** — `sc-if` / `{{ }}` şablon
> sözdizimi içerdikleri için kodları ikas'a taşınmaz, yalnızca görsel dil, ölçü ve etkileşim referansı
> olarak okunur.
>
> **Tarihçe:** Bu dokümanın ilk sürümü `https://infinitypillow.co/` sitesinin Playwright analizinden
> üretilmişti. Marka kimliği (lacivert/sarı ikilisi, yumuşak köşeler, seyahat teması) oradan gelmeye
> devam ediyor; ancak **tipografi, nötr renk skalası ve ana sayfa bölüm dizilimi** artık
> `Anasayfa.dc.html` referansından geliyor. Bölüm 5'teki eski URL listesi arşiv niteliğindedir.
>
> **Uygulanan gerçek:** Canlı tema token'ları için tek doğru kaynak `prompts/TOKENS.md`'dir
> (`list_theme_globals` çıktısından okunur). Bu dokümandaki ham hex/px değerleri tasarım niyetini
> anlatır; **koda hardcode edilmez**, token üzerinden bağlanır. Teknik sınırlar için
> [IKAS.md](file:///root/yigit-theme/IKAS.md), token kurulumu için [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md).
> Merchant içerikleri (metinler, görseller, ürün fiyatları) editable prop olarak kurgulanır.

---

## 1. Genel Tasarım Dili

### Karakter ve Estetik Yaklaşım
Infinity Pillow tasarımı; modern, ferah, seyahat ve konfor odaklı, premium bir e-ticaret estetiğine sahiptir. Tasarım dili yumuşatılmış köşeler (2rem/32px radius kartlar ve medya blokları), editoryal tipografi karşıtlığı (başlıklarda geometrik `Onest`, gövdede `Roboto Flex`, etiket/rozette `Roboto Mono`), derin lacivert ve canlı limon sarısı accent renk ikilisi ile dinamik mikro-etkileşimler üzerine kuruludur.

### Renk Paleti

#### Marka Renkleri — canlı tema token'ı olarak kurulu
Bu 10 renk ikas temasında `kind: color` token'ı olarak mevcuttur. Bileşenlerde **birebir `cssVar`
değeriyle** kullanılır; hex değeri koda yazılmaz. Canlı `id`/`cssVar` listesi: `prompts/TOKENS.md`.

| Renk Tanımı | Hex / RGBA | Canlı `cssVar` | Kullanım Alanı |
| :--- | :--- | :--- | :--- |
| **Ana Lacivert** | `#37435B` | `var(--pxNuSoudLn)` | Ana metinler, birincil butonlar, koyu zeminli bölümler, başlıklar |
| **Accent Sarı** | `#E3E045` | `var(--sy8ZnXZdoG)` | Öne çıkan butonlar, sepet butonu, rozet ve vurgu alanları |
| **Açık Gri Mavi** | `#C8CFD0` | `var(--cdFDkBbKkc)` | İkincil zeminler, kart arka planları, bölücüler |
| **Yıldız Sarısı** | `#E3E062` | `var(--cGupQGnbYq)` | Değerlendirme yıldızları |
| **Saf Beyaz** | `#FFFFFF` | `var(--24KlcgGmm9)` | Sayfa zemini, kart içi, koyu zeminde metin |
| **Saf Siyah** | `#000000` | `var(--vluFeuIeFs)` | Yüksek kontrastlı metin ve vurgular |
| **Overlay Siyah** | `rgba(55, 67, 91, 0.75)` | `var(--fRUyppFgyp)` | Drawer/modal arkası karartma katmanı |
| **Sticky Header Çizgisi** | `rgba(0, 0, 0, 0.08)` | `var(--gzj8Nhz1Gb)` | Scroll'da beliren header alt çizgisi |
| **Kargo İlerleme Çubuğu** | `#E3E045` | `var(--ap8FzMh9VN)` | Sepet ücretsiz kargo ilerleme çubuğu |
| **Koyu Zemin Çizgisi** | `rgba(255, 255, 255, 0.12)` | `var(--pFqY0XGdSq)` | Koyu bölümlerdeki ince ayraçlar |

#### Nötr Skala — `Anasayfa.dc.html` referansından türetilen canlı token'lar
Referans tasarımın editoryal grileri. Ana sayfa section'larında ham hex kullanılmaz; her biri
aşağıdaki `cssVar` üzerinden okunur.

| Hex | Token | `cssVar` | Rol |
| :--- | :--- | :--- | :--- |
| `#101418` | `Nötr / Mürekkep` | `var(--fcAwzuFj9W)` | Neredeyse siyah — editoryal başlık kontrastı |
| `#6E7A8C` | `Nötr / Gövde Metni` | `var(--xGFwg5Zqpf)` | Orta gri-mavi — gövde/açıklama metni |
| `#8C97A5` | `Nötr / Meta Metin` | `var(--p6EMJiXye1)` | Soft gri-mavi — mono etiket, pasif metin, ikon |
| `#AEB8C6` | `Nötr / Sessiz Başlık` | `var(--u9HctrBrDd)` | Sessizleştirilmiş başlık kelimeleri |
| `#DCE0E1` | `Nötr / Çizgi Güçlü` | `var(--0RbHz765Hw)` | Açık gri — kenarlık |
| `#E4E7E8` | `Nötr / Çizgi` | `var(--8ARbeTYsmD)` | Çok açık gri — ayraç çizgisi, input kenarlığı |
| `#EDEFF0` | `Nötr / Yüzey Yumuşak` | `var(--jQs026VIpf)` | Kolon ayraçları, çok hafif zeminler |
| `#F4F5F5` | `Nötr / Yüzey` | `var(--wElEhJwjYh)` | Bölüm zemin gri tonu |

Referansta geçen `#5A6472` kodda hiç kullanılmadığı için token açılmadı; gerekirse skalaya
`Nötr / Mürekkep` ile `Nötr / Gövde Metni` arasına eklenir.

#### Metin Seçimi (Text Selection Highlight)
Referans `Anasayfa.dc.html` L23: `::selection { background:#E3E045; color:#101418 }`.
Site-wide brand selection; merchant Header → Metin Seçimi props ile ayarlar
(`enableTextSelectionHighlight`, `selectionBackgroundColor`, `selectionTextColor`).
Theme Settings fallback: `Seçim / Etkin`, `Seçim / Arka Plan`, `Seçim / Metin`.
Tek çift (lime + mürekkep) hem açık hem lacivert zeminlerde okunur. `forced-colors` altında
OS Highlight’a bırakılır. Detay: `GLOBALS.md` § B8, `src/utils/textSelection.ts`.

#### Color Scheme Yapısı — **uygulanmadı**
İlk tasarımda 6 şemalı bir `colorScheme` yapısı öngörülmüştü. Canlı temada
`colorSchemes.schemes` ve `colorSchemes.values` **boştur**; bölüm zeminleri bunun yerine her
section'ın kendi `backgroundColor` COLOR prop'u ile yönetilir. Şema sistemine geçilecekse bu
ayrı bir iş kalemidir.

---

### Tipografi Sistemi — 3 Fontlu Editoryal Karşıtlık

Tek font ailesi yerine üç aileli bir sistem kullanılır. Fontlar `src/global.css` içinde Google Fonts
ile yüklenir ve `--font-heading` / `--font-body` / `--font-mono` değişkenlerine bağlanır. Üçü de
`latin-ext` alt kümesini içerdiğinden Türkçe karakterleri (İ, ı, Ş, Ğ, Ç, Ö, Ü) tam destekler.

| Aile | Değişken | Rol |
| :--- | :--- | :--- |
| **Onest** | `--font-heading` | Tüm başlıklar (Display → H4) ve kart başlıkları |
| **Roboto Flex** | `--font-body` | Gövde metni, açıklamalar, form ve input metinleri |
| **Roboto Mono** | `--font-mono` | Bölüm etiketleri (`01 · ÖNE ÇIKANLAR`), rozetler, duyuru bandı, fiyat/mono UI |

#### Type Scale — canlı tipografi token'ları
Bileşenlerde ölçü/ağırlık elle yazılmaz; ilgili token'ın `className`'i eklenir
(örn. `<h2 className="ikas-x__title _sKAMD8d1LA">`).

| Token | `className` | Aile | Ölçü / Ağırlık / Satır Yüksekliği | Kullanım |
| :--- | :--- | :--- | :--- | :--- |
| Display Hero | `_78XkSXv7w4` | Onest | 54px / 600 / 64.8px | Hero ana slogan |
| Başlık H1 | `_DusX6I08Pv` | Onest | 48px / 600 / 62.5px | Sayfa H1 |
| Başlık H2 | `_sKAMD8d1LA` | Onest | 36px / 600 / 46.8px | Bölüm başlıkları |
| Başlık H3 | `_AHnMWYqzuI` | Onest | 30.2px / 500 / 39.3px | Alt bölüm başlıkları |
| Başlık H4 | `_f7x3iMRFDx` | Onest | 27px / 500 / 35.1px | Akordiyon, modal başlığı |
| Kart ve Alt Başlık (lg) | `_AZR1yL8GrK` | Onest | 24px / 500 / 31.2px | Kart başlığı, fiyat |
| Gövde Metni (base) | `_VcfI5D07Nt` | Roboto Flex | 18px / 400 / 25.2px | Paragraf, açıklama |
| İkincil Metin (sm) | `_C0OZ8W7vYS` | Roboto Flex | 16px / 400 / 22.4px | Alt açıklama, footer linki |
| Etiket ve Rozet (xs) | `_eZyocyyd0F` | Roboto Mono | 13.5px / 400 / 18.9px | Mono etiket, rozet, meta |
| Mobil Duyuru Metni | `_8BUF3YKi2n` | Roboto Mono | 12px / 400 / 16.8px | Duyuru bandı (mobil) |

> **Uyarı:** `Roboto Flex` token'ları yalnızca `400` ağırlığını destekler
> (`supportedFontWeights: [400]`). Bu iki token'a başka bir ağırlık yazmak reddedilir.
>
> **Türkçe büyük harf:** Mono etiketler `toLocaleUpperCase("tr-TR")` ile büyütülür ve kök elemanda
> `lang="tr"` bulunur; aksi hâlde `i → I` dönüşümü yanlış olur.

---

### Spacing (Boşluk) Ritmi
- **Site Container Maksimum Genişliği (`--max-site-width`):** canlı token değeri `1560px`
  (`getThemeSetting("_l6CcMRzdeZ")`), `Anasayfa.dc.html` referansıyla birebir. Token tüm
  sayfa tiplerini (ana sayfa, ürün, koleksiyon, sepet, arama) besler; genişlik tek yerden
  değiştirilir.
- **Yatay Nefes Payı (`--site-gutter`):** `clamp(20px, 5vw, 64px)`, `src/global.css` içinde
  tanımlı.
  > **Kapsayıcı kuralı:** `--max-site-width` ve `--site-gutter` **aynı** elemana uygulanır —
  > kutu genişlikte sınırlanır, gutter içeride kalır (`box-sizing: border-box`). İkisi farklı
  > elemanlara dağıtılırsa section'lar geniş ekranlarda birbirinden kayar: bu daha önce
  > gerçekleşmiş ve içerik kenarları 1905px'te 64px ile 107px arasında ayrışmıştı.
- **Yatay Bölüm Padding (`--section-x-padding`):** `1.25rem` (`20px`) [Mobil: `16px`]
- **Dikey Bölüm Aralığı (`--section-vertical-spacing`):** `2rem` (`32px`) [Masaüstü: `48px` - `64px`]
- **Grid Gap (`--grid-gap`):** `1.25rem` (`20px`)

---

### Radius (Köşe Yuvarlama) ve Gölge Dili
- **Kart Radius (`--card-border-radius`):** `2rem` (`32px`) — Yuvarlatılmış organik kart yapısı
- **Medya/Görsel Radius (`--media-border-radius`):** `2rem` (`32px`)
- **Buton Radius (`--button-border-radius`):** `0.5rem` (`8px`)
- **Input / Form Radius (`--input-border-width` / radius):** `0.5rem` (`8px`)
- **Gölge Dili:** Soft drop-shadow ve solid offset gölgeler. Buton hover durumlarında `translateY(-1px)` ve hafif renk yumuşaması.

---

### Animasyon Dili
- **Varsayılan Transition:** `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- **Drawer / Modal Geçişi:** `transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)` (Slide-in/out)
- **Görsel Hover Scale:** `transform 0.5s ease-out` (`scale(1.05)` veya `scale(1.08)`)
- **Marquee / Continuous Ticker:** `linear infinite 25s`

---

## 2. Bileşen Envanteri (Component Inventory)

### 1. Announcement Bar (`<announcement-bar>`)
- **Amaç:** Ücretsiz kargo veya promosyon duyurularını sayfanın en üstünde gösterir.
- **Yapı:** Esnek merkezlenmiş flex container. İsteğe bağlı sağ/sol ok navigasyonu veya döner carousel.
- **Stil Değerleri:** Arka plan `#37435B`, Yükseklik `36px` - `40px`, Yazan metin renk `#FFFFFF`, Font boyutu `14px`, `font-weight: 500`.
- **ikas Karşılığı:** ikas `isHeader: true` section, `TEXT` / `RICH_TEXT` prop tipi.
- **Durumlar & Animasyonlar:** Otomatik metin geçişinde `opacity 0.3s ease-in-out` fade.
- **Responsive:** Mobil breakpoint'te metin boyutu `12px` - `13px` olarak küçülür.

### 2. Header & Main Navigation Bar (`<site-header>`)
- **Amaç:** Marka logosu, ana sayfa navigasyon menüsü, arama, hesap ve sepet butonlarını barındırır.
- **Yapı:** 3 Kolonlu Flex Layout (`Logo Sol/Orta`, `Menü Orta/Sol`, `Icons Sağ`). Sabit Yükseklik `--header-height: 60px`.
- **Stil Değerleri:** Background `#FFFFFF` (scroll edildiğinde `sticky` ve alt çizgi `1px solid rgba(0,0,0,0.08)`). Menü linkleri `Roboto Flex` (`_C0OZ8W7vYS`), `16px`, `var(--pxNuSoudLn)`.
- **ikas Karşılığı:** ikas `IMAGE` prop (Logo) + `@ikas/bp-storefront` `getDefaultSrc`, `LINK` / `LIST_OF_LINK` prop tipleri.
- **Hover/Active:** Menü linki hover'da `color: #E3E045` veya alt çizgi `scaleX(1)` animasyonu (`transition: transform 0.25s ease`).
- **Responsive Davranışı (375px / 768px / 1440px):**
  - **1440px:** Yatay menü açık.
  - **768px / 375px:** Menü gizlenir, sol tarafa Hamburger İkonu (`<svg>`) yerleşir. Hamburger tıklanınca soldan açılan Slide-out Drawer tetiklenir (`width: 320px`, `transition: transform 0.35s ease`).

### 3. Hero Banner Section (`<hero-banner>`)
- **Amaç:** Ana sayfada ürünü öne çıkaran görsel/video alanı ve ana aksiyon butonu (CTA).
- **Yapı:** Split layout (Sol metin & CTA, Sağ büyük ürün görseli/videosu) veya arkası medya kaplı overlay düzeni.
- **Stil Değerleri:** Arka plan `Scheme 1 (#FFFFFF)` veya `Scheme 3 (#37435B)`. H1 Başlık `48px` (`line-height: 62.5px`), Alt paragraf `18px`.
- **Buton Yapısı:** Primary Button (`bg: #37435B`, `text: #FFFFFF`, `height: 48px`, `border-radius: 8px`, `text-transform: uppercase`).
- **ikas Karşılığı:** ikas `IMAGE` / `VIDEO` prop tipi, `TEXT` başlık prop'ları.
- **Hover Etkisi:** Butona gelindiğinde `background: #E3E045`, `color: #37435B`, `transform: translateY(-2px)` (`transition: all 0.3s ease`).

### 4. Product Card (`<product-card>`)
- **Amaç:** Koleksiyon ve ızgara listelerinde ürünü sergilemek.
- **Yapı:** 
  1. Görsel Konteyneri (`border-radius: 32px`, `overflow: hidden`, `aspect-ratio: 1/1`)
  2. İndirim / Badge Rozeti (Sol Üst: `#E3E045`, `text: #37435B`, `font-size: 12px`, `padding: 4px 8px`)
  3. Yıldız Puanı (Star Rating: `#E3E062` yıldızlar + sayısal yorum sayısı)
  4. Ürün Başlığı (`18px`, `font-weight: 500`, `#37435B`)
  5. Fiyat (`18px`, `font-weight: 600`, indirimli fiyat yanında üzeri çizili eski fiyat)
  6. Variant Quick Swatch & "Add to Cart" Hızlı Ekle Butonu
- **ikas Karşılığı:** ikas `PRODUCT` veya `PRODUCT_LIST` prop tipleri + `IkasProduct` objesi.
- **Hover Davranışı:** Kart üstüne gelindiğinde ikincil ürün görseli yumuşakça belirir (`opacity: 1`, `transition: opacity 0.4s ease`). Görsel `scale(1.04)` büyür.
- **Responsive:**
  - 1440px: 3 veya 4 sütunlu ızgara (`gap: 20px`).
  - 768px: 2 sütunlu ızgara (`gap: 16px`).
  - 375px: 1 veya 2 sütunlu kaydırılabilir carousel/grid (`gap: 12px`).

### 5. Product Detail Page (PDP) Layout
- **Amaç:** Tekil ürün satışı ve varyant seçimi.
- **Bileşen İç Yapısı:**
  - **Medya Galerisi (Sol):** Ana büyük görsel (`border-radius: 32px`) + Altta thumbnail slider (`gap: 12px`). Thumbnail seçildiğinde yumuşak fade geçişi.
  - **Satın Alma Bloğu (Sağ):**
    - Ürün Başlığı (H1, `36px`)
    - Yıldız Değerlendirmesi & Yorum Bağlantısı
    - Fiyat Ekranı (`24px`, `#37435B`)
    - Renk / Varyant Swatch'ları: Yuvarlak butonlar (`width: 36px`, `height: 36px`, `border-radius: 50%`). Seçili swatch etrafında `#37435B` ring (`border: 2px solid #37435B`).
    - Adet Seçici (Quantity Picker): `-` ve `+` butonları, ortada sayı girdisi (`height: 48px`, `border: 1px solid #C8CFD0`, `border-radius: 8px`).
    - CTA Butonları: "Add to Cart" (Primary Navy `#37435B`) ve "Buy It Now" (Accent Yellow `#E3E045`).
    - **Sticky Add to Cart Bar:** Sayfa aşağı kaydırıldığında ekrandan çıkan satın alma alanının yerine ekranın en altında beliren sabit bar (`position: fixed`, `bottom: 0`, `height: 64px`, `bg: #FFFFFF`, `z-index: 90`).
    - Ürün Özellik Akordiyonları (Collapsible Tabs): Başlık, sağda `+`/`-` veya ok ikonu. Tıklanınca yumuşak yükseklik animasyonu (`max-height 0.35s ease-in-out`).
- **ikas Karşılığı:** ikas `IkasProduct.variantTypes` + `IkasVariantValue` (`isColorVariantValue`), `COMPONENT_LIST` ile akordiyon içerikleri.

### 6. Slide-Out Cart Drawer & Cart Page (`<cart-drawer>`)
- **Amaç:** Sepetteki ürünleri göstermek, AOV artırmak (upsell + kupon) ve hızlı ödemeye yönlendirmek.
- **Yapı:** Sağdan kayarak açılan panel (`width: min(440px, 100vw)`). Desktop (`≥768px`): kenardan `16px` inset floating panel + `border-radius: 24px` + soft panel shadow. Mobil: full-bleed.
- **Motion:** `0.42s cubic-bezier(0.32, 0.72, 0, 1)` + backdrop opacity; `prefers-reduced-motion` destekli.
- **Bileşenler:**
  - **Header:** Başlık + bordered icon-chip kapat butonu (`CloseButton`, 34px; hover’da details-icon motion: rotate 135° + accent fill).
  - **Shipping Notice Chip:** Progress bar yerine ortalanmış notice (`border-radius: 16px`, soft surface). Ücretsiz kargo kazanıldı / kalan tutar (`{amount}` placeholder).
  - **Sepet İtem Listesi:** Grid `88px | 1fr | auto` — görsel link, ürün adı, final + çizili eski fiyat, pill stepper (qty→0 siler; çöp ikonu yok).
  - **Upsell Carousel:** Header’da 4 ayrı `PRODUCT` prop (`cartUpsellProduct1`…`4`) → yatay `scroll-snap` kartlar + “Ekle”.
  - **Promosyon Kodu:** `getCouponCodeForm` / `submitCouponCodeForm` / `removeCouponCodeForm`.
  - **Footer:** İndirim chip (varsa) → Toplam → vergi/kargo notu → full-width checkout pill.
- **Boş Sepet:** Sola hizalı mesaj + CTA (büyük ikon yok).
- **ikas Karşılığı:** `@ikas/bp-storefront` `cartStore` + coupon form helpers + `addItemToCart`.

### 7. Customer Account / Login Bileşenleri
- **Amaç:** Kullanıcı girişi, sipariş geçmişi ve profil yönetimi.
- **Giriş Formu:** Email girdisi (`input[type="email"]`, `height: 48px`, `border-radius: 8px`, `border: 1px solid #C8CFD0`) + OTP 6 Haneli Doğrulama Kodu Girdisi (`inputmode="numeric"`, `maxlength="6"`).
- **Profil & Sipariş Sayfası:** Sol/Üst sekme navigasyonu ("Orders", "Profile"). Boş sipariş durumunda "Ready to shop?" mesajı ve "Shop Now" butonu.
- **ikas Karşılığı:** `@ikas/bp-storefront` `customerStore` + Form validator'lar (`initAccountInfoForm`, `initAddressForm`).

### 8. Footer (`<site-footer>`)
- **Amaç:** Alt gezinti, bülten aboneliği, sosyal medya ve ödeme ikonları.
- **Stil Değerleri:** Arka plan `Scheme 3 (#37435B)`, Metin ve link renkleri `#FFFFFF` veya `#C8CFD0`.
- **Bölümler:**
  1. Newsletter Form (Email Input + Arrow Submit Button)
  2. Quick Links Kolonları (About, Reviews, Shipping, Terms)
  3. Social Media Linkleri (Instagram, Facebook, Pinterest vb.)
  4. Copyright & Ödeme İkonları (Visa, Mastercard, Amex, Apple Pay)
- **ikas Karşılığı:** ikas `isFooter: true` section, `LIST_OF_LINK` prop tipleri.

---

## 3. Sayfa Şablonları (Page Templates)

### 1. Ana Sayfa (Homepage Template) — **uygulanan gerçek dizilim**

`Anasayfa.dc.html` referansına göre kurulan ve ikas editöründe Home sayfasına yerleştirilmiş
11 section, yukarıdan aşağıya:

| # | Section (ikas adı) | Rolü |
| :-- | :--- | :--- |
| 1 | Announcement Bar | Sticky duyuru bandı (3 mesaj, mono tipografi) |
| 2 | Header | Sağa hizalı floating pill navbar; CartDrawer + SearchOverlay gömülü |
| 3 | Hero Banner | 2 kolonlu hero, kelime kelime reveal + görsel parallax, sosyal kanıt kartı |
| 4 | Editorial Bridge | Hero ile devamı arasında ince çizgi + slogan/künye köprüsü |
| 5 | Product Features Icons | 4 kolonlu özellik bandı (çizgi ikon + mono etiket + başlık) |
| 6 | Featured Collection Grid | Mono etiket + H2 + 4'lü ürün ızgarası, hover'da "Sepete Ekle" |
| 7 | Story Section | Marka hikâyesi, scroll ile aydınlanan metin, 4 sayaç, hız duyarlı kayan bant |
| 8 | Testimonials Carousel | Organik yerleşimli 4 yorum kartı + avatar kümesi |
| 9 | Curved Marquee | SVG `textPath` üzerinde kavisli akan kampanya metni |
| 10 | Newsletter Section | Footer'a gömülü duran koyu CTA kartı + e-posta formu |
| 11 | Footer | 4 kolonlu footer, mobilde akordeon, sosyal + ödeme rozetleri |

> **Kapsam dışı:** İlk plandaki `<press-ticker>`, `<image-with-text-block>`,
> `<video-demo-section>` ve `<customer-reviews-section>` bileşenleri kodda mevcut ve
> `ikas.config.json`'a kayıtlı olsalar da **yeni referans tasarımda yer almadıkları için ana sayfaya
> yerleştirilmemişlerdir.** Kaldırılmaları ayrı bir temizlik kalemidir.
>
> **Kasıtlı binişme:** Newsletter kartı Footer'a gömülü görünür. Ofset tek bir değişkenden gelir:
> `--newsletter-footer-overlap` (masaüstü `56px`, ≤767px `40px`).

### 2. Koleksiyon Sayfası (Collection / Shop All Template)
1. `<site-header>`
2. `<collection-hero>` (Koleksiyon Başlığı, Kısa Açıklama, Arka Plan Banner)
3. `<filter-and-sort-bar>` (Filtreleme & Sıralama Dropdown Menüsü: "Sort by: Featured, Price Low-High, etc.")
4. `<product-grid>` (ProductCard Izgarası — Masaüstü: 4 Kolon, Mobil: 2 Kolon)
5. `<pagination-or-load-more>` ("Load More" Butonu veya Sayfalama Numaraları)
6. `<site-footer>`

### 3. Ürün Detay Sayfası (PDP Template)
1. `<site-header>`
2. `<breadcrumb-nav>` (Home / Products / Infinity Pillow)
3. `<product-main-section>` (Sol: Galeri Slider, Sağ: Varyant Seçimi, Adet, Sepete Ekle Butonları)
4. `<sticky-add-to-cart-bar>` (Scroll Tetiklemeli Sabit Alt Bar)
5. `<product-value-accordions>` (Features, Care Instructions, Shipping & Returns Akordiyonları)
6. `<customer-reviews-section>` (Judge.me Yıldız İstatistiği, Yorum Yaz Butonu ve Yorum Kartları Grid'i)
7. `<related-products-carousel>` ("You May Also Like" Ürün Kartları Carousel'i)
8. `<site-footer>`

### 4. Sepet Sayfası (Cart Page Template)
1. `<site-header>`
2. `<cart-page-container>` (Sepet Ürün Tablosu, Miktar Güncelleme, Sipariş Notu, Ödeme Özeti ve Checkout Butonu)
3. `<site-footer>`

### 5. Arama Sayfası (Search Template)
1. `<site-header>`
2. `<search-bar-input>` (Arama Girdisi Alanı ve Temizle Butonu)
3. **Durum 1 (Sonuç Var):** `<search-results-grid>` (Bulunan ürün kartları)
4. **Durum 2 (Boş Arama):** `<empty-search-state>` ("No results found for 'xyz'. Check your spelling or search for another term." + Popüler Arama Önerileri)
5. `<site-footer>`

### 6. Kurumsal & İçerik Sayfaları (About / Contact / Policies Template)
1. `<site-header>`
2. `<page-header>` (Sayfa Başlığı H1 - `36px`)
3. `<page-content-wrapper>` (Tipografik Zengin Metin Alanı / İletişim Formu)
4. `<site-footer>`

### 7. 404 Bulunamadı Sayfası (404 Template)
1. `<site-header>`
2. `<404-container>` (Görsel/İllüstrasyon, "404 - Page Not Found", "The page you are looking for does not exist", Primary Button: "Return to Home")
3. `<site-footer>`

### 8. Müşteri Hesabı (Account / Orders / Profile Template)
1. `<site-header>`
2. `<account-nav-tabs>` ("Orders" ve "Profile" Sekmeleri)
3. `<orders-section>` / `<profile-section>` (Kullanıcı İletişim Bilgileri, Adres Ekleme/Düzenleme Formları, Sipariş Geçmişi)
4. `<site-footer>`

---

## 4. Animasyon Kataloğu (Animation Catalog)

Sitedeki tüm animasyonlar ve mikro-etkileşimler DOM computed style okumalarıyla tek yerde listelenmiştir:

| Eleman | Tetikleyici (Trigger) | Süre & Easing | Değişen CSS Property'leri | Efekt / Davranış Açıklaması |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Butonlar** | Hover / Focus | `0.3s cubic-bezier(0.4, 0, 0.2, 1)` | `background-color`, `color`, `transform` | Arka plan sarıya/laciverte döner, buton `translateY(-1px)` hafifçe yükselir. |
| **Ürün Kartı Görseli**| Hover | `0.5s ease-out` | `transform`, `opacity` | Ana görsel `scale(1.05)` büyür, ikincil görsel `opacity: 1` ile görünür. |
| **Menü Linkleri** | Hover | `0.25s ease` | `color`, `border-bottom` / `scaleX` | Alt çizgi soldan sağa doğru uzayarak belirir (`transform-origin: left`). |
| **Cart Drawer** | Cart Butonu Tıklama | `0.42s cubic-bezier(0.32, 0.72, 0, 1)` | `transform: translateX(0)` | Floating inset panel (desktop) kayarak açılır. Backdrop opacity 1 olur. |
| **Mobil Nav Drawer** | Hamburger Tıklama | `0.35s ease-in-out` | `transform: translateX(0)` | Menü soldan kayarak açılır. |
| **Akordiyon (Collapsible)**| Tıklama | `0.35s ease-in-out` | `max-height`, `opacity`, `rotate` | İçerik alanı aşağı doğru esneyerek açılır, sağdaki `+` ikonu 45/180 derece döner. |
| **Sticky Add to Cart**| Page Scroll (PDP) | `0.3s ease` | `transform: translateY(0)`, `opacity` | Ana satın alma butonu görüş alanından çıktığında alttan yukarı yumuşakça kayar. |
| **Logo Ticker (Marquee)**| Otomatik (Continuous)| `25s linear infinite` | `transform: translateX(-100%)` | Basın/Medya logoları kesintisiz olarak soldan sağa akar. |
| **Thumbnail Switch** | Thumbnail Tıklama | `0.2s ease-in-out` | `opacity`, `border-color` | Seçilen küçük görsel etrafında belirgin çerçeve oluşur, ana görsel `opacity` ile güncellenir. |
| **OTP Code Input Focus**| Focus / Input | `0.2s ease` | `border-color`, `box-shadow` | Girdi kutusu etrafında lacivert odaklama halkası oluşur. |
| **PDP Gallery Crossfade** | Thumb / ok / story | `~0.55s cubic-bezier(0.22, 1, 0.36, 1)` | `opacity`, `translateX(±8px)` | Ana görsel yumuşak crossfade + hafif yön ipucu; mobilde snap (motion yok). |
| **PDP Swatch Select** | Varyant tıklama | `180ms ease` | `transform: scale(1.08)`, ring opacity | Seçili swatch hafif büyür; hover yalnızca fine pointer. |
| **PDP ATC Success** | Sepete ekle OK | `220ms` | chip `scale` + check ikon | CTA chip success feedback; metin prop’tan. |
| **PDP Trust Stagger** | Scroll (once) | `0.5s` + 70ms stagger | `opacity`, `translateY` | Trust satırları bir kez fade-up. |
| **PDP Size Guide** | Drawer aç/kapa | `0.42s cubic-bezier(0.32, 0.72, 0, 1)` | `translateY` | CartDrawer easing ailesi; focus return. |
| **PDP Sticky Bar** | CTA viewport dışı | `~0.3s` | `translateY` + `opacity` | Solid yüzey + safe-area; inert gizliyken. |
| **PDP Accordion** | Panel toggle | `~0.35s` | `grid-template-rows 0fr→1fr`, body fade | max-height yerine grid; ikon rotate AccordionToggleIcon. |
| **PDP Reviews Cards** | Scroll (once) | `~0.55s` + stagger | `opacity`, `translateY` | Yorum kartları bir kez reveal; skeleton loading. |
| **PDP Related Header** | Scroll (once) | `~0.55s` | `opacity`, `translateY` | Mono etiket + H2 fade-up; >4 üründe peek carousel. |
| **Quantity Stepper** | Qty +/- tıklama | `0.35s cubic-bezier(0.34, 1.56, 0.64, 1)` | `transform: scale` | Değer `scale(1.3)` bump; buton `:active scale(0.9)`; token `Animasyon / Adet Stepper`; `prefers-reduced-motion` kapalı. |

---

## 5. Ziyaret Edilen ve Keşfedilen URL'ler

### Başlangıç ve Keşfedilen Tüm URL Listesi

#### 1. Ana Sayfa
- `https://infinitypillow.co/`

#### 2. Koleksiyon Sayfaları
- `https://infinitypillow.co/collections/all`

#### 3. Ürün Detay Sayfaları (PDP)
- `https://infinitypillow.co/products/infinity-pillow`
- `https://infinitypillow.co/products/packable-blanket`
- `https://infinitypillow.co/products/packable-travel-bag`

#### 4. Kurumsal ve İçerik Sayfaları
- `https://infinitypillow.co/pages/about`
- `https://infinitypillow.co/pages/reviews`
- `https://infinitypillow.co/pages/contact`
- `https://infinitypillow.co/pages/affiliation`
- `https://infinitypillow.co/pages/wholesale`

#### 5. Yasal ve Politika Sayfaları
- `https://infinitypillow.co/policies/shipping-policy`
- `https://infinitypillow.co/policies/refund-policy`
- `https://infinitypillow.co/policies/terms-of-service`
- `https://infinitypillow.co/policies/contact-information`

#### 6. Arama Sayfaları (Arama & Boş Durum)
- `https://infinitypillow.co/search?q=pillow`
- `https://infinitypillow.co/search?q=xyz12345nonexistent`

#### 7. Sepet ve Drawer
- `https://infinitypillow.co/cart`

#### 8. Hata ve Sistem Durumları
- `https://infinitypillow.co/404`

#### 9. Kullanıcı Girişi ve Müşteri Hesabı (Doğrulanmış & Analiz Edilmiş)
- `https://infinitypillow.co/account/login` -> `https://account.infinitypillow.co/authentication/login`
- `https://account.infinitypillow.co/orders`
- `https://account.infinitypillow.co/profile`

---
*DESIGN.md dokümanı referans sitenin eksiksiz analizi ve IKAS.md teknik yetenekleri ile sıfırdan oluşturulmuştur.*
