# GLOBALS.md — Tema Global Token Kurulum Dokümanı

## Amaç
Bu dosya, ikas MCP ile hangi global'in hangi değerle, hangi araçla oluşturulacağını ve bileşenlerde nasıl entegre edileceğini tarif eden tek kaynaktır. [DESIGN.md](file:///root/yigit-theme/DESIGN.md)'deki analizden türetilmiştir; prompts/ klasöründeki tüm bileşen prompt'ları bu dosyadaki token adlarını ve değerlerini birebir referans alır.

## Durum — **kurulum tamamlandı**

Aşağıdaki tabloların tamamı ikas temasında **canlı olarak kuruludur**
(`list_theme_globals` ile doğrulanmıştır): 10 renk, 10 tipografi, 15 boşluk, 7 radius, 4 gölge,
9 animasyon token'ı.

> **Bileşen kodlarken bu dosyayı değil `prompts/TOKENS.md`'yi referans alın.** Bu doküman token'ların
> *niyetini ve değerini* anlatır; canlı `id` / `cssVar` / `className` / `variableName` eşleşmelerinin
> tek doğru kaynağı `prompts/TOKENS.md`'dir (doğrudan `list_theme_globals` çıktısından yazılmıştır).

`prompts/00-globals.md` kurulum runbook'u **çalıştırılmış ve tüketilmiştir**; yeniden çalıştırmak
mevcut token'ları kopyalar.

## Bilinen Boşluklar

1. **`breakpoints`, `keyframes` ve `colorSchemes` boş.** Responsive kırılımlar tema token'ı değil,
   bileşen CSS'lerinde `clamp()` ve `@media (max-width: 767px)` ile yönetiliyor. `DESIGN.md`'de
   öngörülen 6 şemalı `colorScheme` yapısı kurulmadı; bölüm zeminleri section başına
   `backgroundColor` COLOR prop'u ile yönetiliyor.
2. **Hata kırmızıları hâlâ dağınık.** Newsletter (`#FF5A5A` / `#FF7B7B`), sepet ve filtre
   (`#EF4444`) farklı ham hex kullanıyor — tek bir `Durum / Hata` token'ına indirilmeli.

### Kapatılan boşluklar

- **Nötr gri skalası token'a çevrildi.** Referansın editoryal grileri sekiz token'a bağlandı
  (`Nötr / Mürekkep` → `Nötr / Yüzey`); ana sayfa section'larındaki 35 ham hex temizlendi.
  Tam liste ve koyudan açığa sıralama için `prompts/TOKENS.md`.
- **Container çelişkisi çözüldü.** `Boşluk / Site Maksimum Genişliği` referansa uyacak şekilde
  `1560px`'e çekildi; genişlik + gutter artık aynı kutuya uygulanıyor (bkz. DESIGN.md →
  Spacing Ritmi).
- **Kullanılmayan eski sayfa bileşenleri silindi.** `PageHeader`, `PageContentWrapper` ve
  `NotFoundContainer` (ve onlarla gelen `#0A192F` / `#333333` ham renkleri) kaldırıldı.

## Temel İlkeler
1. **Global-first:** Her renk, tipografi, boşluk, radius, gölge ve animasyon bir global token'dır. Bileşenler asla ham değer kullanmaz — renk `var(--<id>)`, tipografi `className="_<id>"`, globalVariable'lar `getThemeSetting` ile okunup inline CSS değişkenine aktarılır (`style={{ "--token": setting.value }}`).
2. **Türkçe zorunluluğu:** Token adları Türkçe ve `/` ile gruplu. Prop `displayName`/`description`/grup adları Türkçe.
3. **Uppercase & Türkçe Harf Uyumu:** Metin büyük veya küçük harf serbestçe kullanılabilir; ANCAK Türkçe i/İ/ı/I harflerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR. Tipografi token'larında `text-transform` tanımlanmaz.
4. **Fontlar — 3 aileli sistem:** başlıklarda `Onest`, gövdede `Roboto Flex`, etiket/rozet ve mono
   UI'da `Roboto Mono`. Üçü de Google Fonts üzerinden `latin-ext` alt kümesiyle yüklenir ve Türkçe
   karakterleri (İ, ı, Ş, Ğ, Ç, Ö, Ü) tam destekler; `src/global.css` içinde `--font-heading`,
   `--font-body`, `--font-mono` değişkenlerine bağlıdır. **`Roboto Flex` yalnızca `400` ağırlığını
   destekler** (`supportedFontWeights: [400]`) — başka bir ağırlık yazmak reddedilir.
5. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce; editörde görünen her şey Türkçe.
6. **cssVar Kuralı:** Renklerde `id` ile `cssVar` farklı büyük/küçük harf kullanabilir; bileşenler `list_theme_globals` çıktısındaki `cssVar` TAM değerini kullanır, id'den elle türetmez.

---

## Token Grupları

### B1. Renkler — `kind: color` (10 Token · canlı)
> **Bağlama Kuralı:** Bileşenlerde CSS rengi olarak `var(--<cssVar>)` şeklinde tüketilir. `list_theme_globals` çıktısındaki tam `cssVar` adı kullanılacaktır. `kind: color` çağrılarında `value` olarak somut Hex/RGBA string'i verilir (`var(...)` referansı verilemez).

| Ad | Değer | Kullanım |
| :--- | :--- | :--- |
| `Renkler / Ana Lacivert` | `#37435B` | Ana metinler, birincil butonlar, koyu arka plan bölümleri (Scheme 3/4), başlıklar, PDP fiyatı, kart başlıkları, indirim rozet metni, seçili swatch ring |
| `Renkler / Accent Sarı` | `#E3E045` | Öne çıkan butonlar, indirim/promosyon rozetleri, vurgu alanları (Scheme 4), menü hover, buton hover arka planı |
| `Renkler / Açık Gri Mavi` | `#C8CFD0` | İkincil arka planlar (Scheme 2), kart zeminleri, böleçler, input ve adet seçici kenarlıkları |
| `Renkler / Yıldız Sarısı` | `#E3E062` | Ürün kartları ve PDP değerlendirme yıldızları (`--jdgm-star-color`) |
| `Renkler / Saf Beyaz` | `#FFFFFF` | Ana sayfa varsayılan arka planı (Scheme 1), kart içerikleri, buton yazı renkleri, header zemin rengi |
| `Renkler / Saf Siyah` | `#000000` | Yüksek kontrastlı metinler, alt çizgi vurguları, ikincil durumlar, Scheme 5 siyah zemin |
| `Renkler / Overlay Siyah` | `rgba(55, 67, 91, 0.75)` | Drawer ve modal arkasındaki karartma katmanı (backdrop overlay) |
| `Renkler / Sticky Header Çizgisi` | `rgba(0, 0, 0, 0.08)` | Sayfa kaydırıldığında sabit duran header alt ayırıcı çizgisi |
| `Renkler / Kargo İlerleme Çubuğu` | `#E3E045` | Cart drawer içindeki ücretsiz kargo kalan tutar ilerleme çubuğu dolgu rengi |
| `Renkler / Koyu Zemin Çizgisi` | `rgba(255, 255, 255, 0.12)` | Footer ve koyu zeminli bölümler için beyaz transparan ayırıcı çizgi |
| `Renkler / Link Alt Çizgi` | `#E3E045` | TextLink / accent-bar underline rengi (Accent’ten bağımsız değiştirilebilir) |

*Not: CSS `transparent` kelimesi ve mükerrer `#37435B` semantik token'ları (İndirim Rozet Metni, Swatch Ring) kaldırılmış; Link Alt Çizgi ile birlikte renk token sayısı güncellenmiştir.*

---

### B2. Tipografi — `kind: typography` (10 Token · canlı)
> **Bağlama Kuralı:** Bileşenlerde ikas framework tarafında oluşturulan `className="_<id>"` stil sınıfı doğrudan elemana uygulanır. `font_weight` sayısal değerdir. Aşağıdaki değerler **canlı durumdur**.

| Ad | `className` | Aile | Size / Weight / Line-Height | Kullanım |
| :--- | :--- | :--- | :--- | :--- |
| `Tipografi / Display Hero` | `_78XkSXv7w4` | Onest | `54px` / `600` / `64.8px` | Masaüstü büyük sloganlar (Hero ana başlığı) |
| `Tipografi / Başlık H1` | `_DusX6I08Pv` | Onest | `48px` / `600` / `62.5px` | Sayfa ve bölüm ana başlıkları |
| `Tipografi / Başlık H2` | `_sKAMD8d1LA` | Onest | `36px` / `600` / `46.8px` | Bölüm başlıkları, PDP ürün başlığı |
| `Tipografi / Başlık H3` | `_AHnMWYqzuI` | Onest | `30.2px` / `500` / `39.3px` | Akordiyon başlıkları, mobil modal başlıkları |
| `Tipografi / Başlık H4` | `_f7x3iMRFDx` | Onest | `27px` / `500` / `35.1px` | Öne çıkan bölüm alt başlıkları |
| `Tipografi / Kart ve Alt Başlık (lg)` | `_AZR1yL8GrK` | Onest | `24px` / `500` / `31.2px` | Kart başlıkları, PDP fiyat etiketi |
| `Tipografi / Gövde Metni (base)` | `_VcfI5D07Nt` | Roboto Flex | `18px` / `400` / `25.2px` | Paragraf ve gövde metinleri |
| `Tipografi / İkincil Metin (sm)` | `_C0OZ8W7vYS` | Roboto Flex | `16px` / `400` / `22.4px` | İkincil açıklamalar, input metinleri, footer bağlantıları |
| `Tipografi / Etiket ve Rozet (xs)` | `_eZyocyyd0F` | Roboto Mono | `13.5px` / `400` / `18.9px` | Mono bölüm etiketleri, rozetler, meta satırları |
| `Tipografi / Mobil Duyuru Metni` | `_8BUF3YKi2n` | Roboto Mono | `12px` / `400` / `16.8px` | Mobil breakpoint duyuru bandı metni |

---

### B3. Boşluklar / Spacing — `globalVariable` · `TEXT` (15 Token · canlı)
> **Bağlama Kuralı:** Bileşenlerde `getThemeSetting` ile okunup konteynırlara `style={{ "--section-x-padding": setting.value }}` veya inline padding/gap CSS değişkeni şeklinde aktarılır.

| Ad | Değer | Kullanım |
| :--- | :--- | :--- |
| `Boşluk / Site Maksimum Genişliği` | `1560px` | Site container maksimum genişlik sınırı (`--max-site-width`) |
| `Boşluk / Yatay Bölüm Padding` | `1.25rem` (`20px`) | Masaüstü/Tablet yatay bölüm padding değeri (`--section-x-padding`) |
| `Boşluk / Mobil Yatay Padding` | `16px` | Mobil cihazlar için yatay bölüm padding değeri |
| `Boşluk / Dikey Bölüm Spacing` | `2rem` (`32px`) | Mobil/Tablet dikey bölüm aralığı (`--section-vertical-spacing`) |
| `Boşluk / Masaüstü Dikey Spacing` | `48px` | Masaüstü cihazlar için dikey bölüm aralığı |
| `Boşluk / Grid Gap` | `1.25rem` (`20px`) | Masaüstü ızgara ve kartlar arası boşluk (`--grid-gap`) |
| `Boşluk / Mobil Grid Gap` | `12px` | Mobil ürün kartı ızgarası aralığı |
| `Boşluk / Tablet Grid Gap` | `16px` | Tablet ürün kartı ızgarası aralığı |
| `Boşluk / Header Yüksekliği` | `60px` | Sabit header yüksekliği (`--header-height`) |
| `Boşluk / Announcement Bar Yüksekliği` | `38px` | Üst duyuru bandı yüksekliği |
| `Boşluk / Buton Yüksekliği` | `48px` | Primary ve secondary buton yüksekliği |
| `Boşluk / Checkout Buton Yüksekliği` | `52px` | Cart drawer ve sepet ödeme butonu yüksekliği |
| `Boşluk / Sticky Cart Bar Yüksekliği` | `64px` | PDP scroll tetiklemeli sabit alt bar yüksekliği |
| `Boşluk / Cart Drawer Genişliği` | `420px` | Masaüstü slide-out cart drawer genişliği |
| `Boşluk / Mobile Drawer Genişliği` | `320px` | Mobil navigasyon slide-out drawer genişliği |

---

### B4. Radius — `globalVariable` · `TEXT` (7 Token · canlı)
> **Bağlama Kuralı:** Bileşenlerde `getThemeSetting` ile okunup elemanlara `style={{ borderRadius: setting.value }}` şeklinde aktarılır.

| Ad | Değer | Kullanım |
| :--- | :--- | :--- |
| `Radius / Kart` | `2rem` (`32px`) | Yuvarlatılmış organik ürün kartı ve medya kapsayıcı radius'u (`--card-border-radius`) |
| `Radius / Medya` | `2rem` (`32px`) | Görsel ve video blokları köşe yuvarlama radius'u (`--media-border-radius`) |
| `Radius / Buton` | `0.5rem` (`8px`) | Primary, secondary ve CTA buton radius'u (`--button-border-radius`) |
| `Radius / Input ve Form` | `0.5rem` (`8px`) | Form girdileri, textarea ve adet seçici radius'u (`--textarea-border-radius`) |
| `Radius / Sepet İtem Görseli` | `12px` | Cart drawer ürün görseli köşe yuvarlama radius'u |
| `Radius / Swatch Dairesel` | `50%` | PDP renk / varyant swatch dairesel buton radius'u |
| `Radius / Kargo İlerleme Çubuğu` | `4px` | Free shipping bar köşe yuvarlama radius'u |

---

### B5. Gölge / Shadow — `globalVariable` · `SHADOW` (4 Token · canlı)
> **Bağlama Kuralı:** Bileşenlerde `getThemeSetting` ile okunup `boxShadow` özelliğine aktarılır. Değerler ikas `SHADOW` JSON obje şemasına göredir (`x`, `y`, `blur`, `spread`, `color`, `position`).

| Ad | Değer (JSON Obje) | Kullanım |
| :--- | :--- | :--- |
| `Gölge / Buton Drop Shadow` | `{"x":0, "y":-1, "blur":1, "spread":0, "color":"rgba(227, 224, 69, 0.5)", "position":"outside"}` | Buton hover ve drop-shadow efekti (`--button-drop-shadow`) |
| `Gölge / Kart Soft Shadow` | `{"x":0, "y":4, "blur":20, "spread":0, "color":"rgba(55, 67, 91, 0.08)", "position":"outside"}` | Ürün kartı ve modal yumuşak gölgesi |
| `Gölge / Sticky Header Shadow` | `{"x":0, "y":2, "blur":8, "spread":0, "color":"rgba(0, 0, 0, 0.05)", "position":"outside"}` | Kaydırılan sticky header alt gölgesi |
| `Gölge / Swatch Odak Gölgesi` | `{"x":0, "y":0, "blur":0, "spread":2, "color":"rgba(55, 67, 91, 1)", "position":"outside"}` | PDP seçili varyant swatch etrafındaki 2px dış halka gölgesi |

---

### B6. Animasyon — `globalVariable` · `TEXT` (9 Token · canlı)
> **Bağlama Kuralı:** Bileşenlerde `transition` CSS özelliğine veya `style={{ transition: setting.value }}` şeklinde uygulanır.

| Ad | Değer | Kullanım |
| :--- | :--- | :--- |
| `Animasyon / Buton ve Hover` | `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` | Primary buton hover, background renk değişimi ve `translateY(-1px)` yükselme efekti |
| `Animasyon / Drawer ve Modal` | `transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)` | Cart drawer ve mobil menü drawer soldan/sağdan kayarak açılış/kapanış geçişi |
| `Animasyon / Görsel Scale Hover` | `transform 0.5s ease-out` | Ürün kartı görsel hover `scale(1.05)` büyüme geçişi |
| `Animasyon / Menü Alt Çizgi` | `transform 0.25s ease` | Header menü linkleri hover alt çizgi (`scaleX(1)`) genişleme geçişi |
| `Animasyon / Akordiyon Açılış` | `max-height 0.35s ease-in-out` | PDP collapsible tabs ve akordiyon içerik açılış yüksekliği geçişi |
| `Animasyon / Sticky Bar Belirme` | `transform 0.3s ease, opacity 0.3s ease` | PDP scroll edildiğinde sabit alt barın alttan belirmesi geçişi |
| `Animasyon / Fade Yumuşak` | `opacity 0.3s ease-in-out` | Announcement bar metin değişimi ve thumbnail switch yumuşak görünürlük geçişi |
| `Animasyon / Marquee Ticker` | `transform 25s linear infinite` | Press ticker kayan marka logoları bandı sonsuz kaydırma geçişi |
| `Animasyon / Adet Stepper` | `transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)` | QuantityStepper değer bump (`scale(1.3)`) ve buton press transition |

---

### B7. Link / Alt Çizgi — `color` + `globalVariable · TEXT` (canlı)
> **Bağlama Kuralı:** `sub-components/TextLink` `getThemeSetting` ile kalınlık/offset okur; çizgi rengi CSS’te `var(--zyuxTzvMuY)`.

| Ad | Değer | Kullanım |
| :--- | :--- | :--- |
| `Renkler / Link Alt Çizgi` | `#E3E045` (`var(--zyuxTzvMuY)`) | Site-wide TextLink accent-bar underline rengi |
| `Link / Alt Çizgi Kalınlığı` | `2px` (`_mKSzZQXicb`) | border-bottom kalınlığı |
| `Link / Alt Çizgi Offset` | `2px` (`_yVBERhD1nQ`) | Metin–çizgi padding-bottom boşluğu |

#### Sürekli Keyframe Animasyonları
- **`Animasyon / Marquee Ticker`**: `transform 25s linear infinite`
  - **Bileşen Notu:** `<press-ticker>` medya logoları bandında `@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-100%); } }` biçiminde CSS utility veya inline style ile canlı token olarak ele alınacaktır.

---

### B8. Metin Seçimi / Text Selection — `globalVariable` (canlı)

> **Bağlama Kuralı:** Header (`isHeader`) props birincil merchant yüzeyi. Theme Settings, prop boşken
> fallback. Runtime: `document.documentElement` CSS vars + unscoped `<style id="ikas-text-selection">`
> (`src/utils/textSelection.ts`). Baseline: `src/global.css` `::selection` kuralları.
> Öncelik: Header prop → Theme Setting (`getThemeSetting` key) → `#E3E045` / `#101418` / enabled.

| Ad | Tip | Default | `variableName` | Kullanım |
| :--- | :--- | :--- | :--- | :--- |
| `Seçim / Etkin` | BOOLEAN | `true` | `_Nj7fGnZidb` | Custom selection boyasını aç/kapa |
| `Seçim / Arka Plan` | COLOR | `#E3E045` | `_U2NDSSNjOC` | `::selection` background (Accent) |
| `Seçim / Metin` | COLOR | `#101418` | `_v71Mf9bk7q` | `::selection` color (`Nötr / Mürekkep`) |

**Header props (Metin Seçimi grubu):** `enableTextSelectionHighlight`, `selectionBackgroundColor`, `selectionTextColor`.

Kod sabitleri: `SELECTION_ENABLED_SETTING` / `SELECTION_BG_SETTING` / `SELECTION_FG_SETTING`
(`src/utils/textSelection.ts`). Canlı eşleşme: `prompts/TOKENS.md` §8.

**Platform notları:** `forced-colors: active` altında custom selection uygulanmaz. iOS Safari /
bazı WebView’lerde `::selection` kısmen veya hiç uygulanmayabilir (bilinen limit).

---

## Kapsama Kontrolü (Coverage Audit)

[DESIGN.md](file:///root/yigit-theme/DESIGN.md)'deki Bileşen Envanteri'nde yer alan tüm bileşenlerin kullandığı token'lar eşleştirilmiştir:

- **`<announcement-bar>`** → Kullanılan token'lar: `Renkler / Ana Lacivert`, `Renkler / Saf Beyaz`, `Tipografi / Mobil Duyuru Metni`, `Boşluk / Announcement Bar Yüksekliği`, `Animasyon / Fade Yumuşak`
- **`<site-header>`** → Kullanılan token'lar: `Renkler / Saf Beyaz`, `Renkler / Ana Lacivert`, `Renkler / Accent Sarı`, `Renkler / Sticky Header Çizgisi`, `Tipografi / İkincil Metin (sm)`, `Boşluk / Header Yüksekliği`, `Boşluk / Mobile Drawer Genişliği`, `Animasyon / Menü Alt Çizgi`, `Animasyon / Drawer ve Modal`, `Gölge / Sticky Header Shadow`, `Seçim / Etkin|Arka Plan|Metin` (Text Selection — Header props + Theme Settings)
- **`<hero-banner>`** → Kullanılan token'lar: `Renkler / Saf Beyaz`, `Renkler / Ana Lacivert`, `Renkler / Accent Sarı`, `Tipografi / Display Hero`, `Tipografi / Başlık H1`, `Tipografi / Gövde Metni (base)`, `Radius / Buton`, `Boşluk / Buton Yüksekliği`, `Animasyon / Buton ve Hover`
- **`<product-card>`** → Kullanılan token'lar: `Radius / Kart`, `Renkler / Accent Sarı`, `Renkler / Ana Lacivert`, `Renkler / Yıldız Sarısı`, `Tipografi / Gövde Metni (base)`, `Tipografi / Etiket ve Rozet (xs)`, `Boşluk / Grid Gap`, `Animasyon / Görsel Scale Hover`, `Gölge / Kart Soft Shadow`
- **`<product-detail-page>` (PDP)** → Kullanılan token'lar: `Tipografi / Başlık H2`, `Tipografi / Kart ve Alt Başlık (lg)`, `Renkler / Ana Lacivert`, `Renkler / Accent Sarı`, `Radius / Swatch Dairesel`, `Radius / Medya`, `Boşluk / Buton Yüksekliği`, `Boşluk / Sticky Cart Bar Yüksekliği`, `Animasyon / Sticky Bar Belirme`, `Animasyon / Akordiyon Açılış`, `Animasyon / Adet Stepper`, `Gölge / Swatch Odak Gölgesi`
- **`<cart-drawer>`** → Kullanılan token'lar: `Boşluk / Cart Drawer Genişliği`, `Renkler / Kargo İlerleme Çubuğu`, `Radius / Kargo İlerleme Çubuğu`, `Radius / Sepet İtem Görseli`, `Boşluk / Checkout Buton Yüksekliği`, `Renkler / Overlay Siyah`, `Animasyon / Drawer ve Modal`, `Animasyon / Adet Stepper`
- **`<customer-account-login>`** → Kullanılan token'lar: `Renkler / Açık Gri Mavi`, `Renkler / Ana Lacivert`, `Radius / Input ve Form`, `Boşluk / Buton Yüksekliği`, `Tipografi / İkincil Metin (sm)`, `Gölge / Swatch Odak Gölgesi`
- **`<site-footer>`** → Kullanılan token'lar: `Renkler / Ana Lacivert`, `Renkler / Saf Beyaz`, `Renkler / Açık Gri Mavi`, `Tipografi / İkincil Metin (sm)`, `Radius / Input ve Form`, `Boşluk / Yatay Bölüm Padding`
- **`<press-ticker>`** → Kullanılan token'lar: `Animasyon / Marquee Ticker`, `Boşluk / Yatay Bölüm Padding`
- **`<search-and-404-pages>`** → Kullanılan token'lar: `Tipografi / Başlık H2`, `Tipografi / Gövde Metni (base)`, `Renkler / Ana Lacivert`, `Radius / Buton`

---
*GLOBALS.md dosyası renk + spacing + selection token'larıyla güncellenmiştir.*
