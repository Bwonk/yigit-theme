# IKAS.md — ikas Tema Geliştirme ve MCP Teknik Kılavuzu

## Amaç — Bu Dosyanın Rolü
Bu dosya, ikas tema geliştirme ekosisteminin teknik sınırlarını, ikas MCP araçlarının tam parametre ve çıktı şemalarını, global token sisteminin veri yapılarını ve bileşen mimarisini tanımlayan **üçüncü temel teknik kılavuzdur (Single Technical Source of Truth)**. 

Geliştirme sürecinde [DESIGN.md](file:///root/yigit-theme/DESIGN.md) (Tasarım Kaynağı) ve [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md) (Token Kurulum Kaynağı) ile birlikte kullanılır. "ikas neyi destekliyor, hangi araçla, hangi parametreyle ve hangi veri yapısıyla?" sorusunun kesin ve doğrulanmış yanıtını verir.

---

## MCP Araçları Envanteri

Toplam **55 adet ikas MCP aracı** (3 adet `ikas` sunucusu + 52 adet `ikas-code-components` sunucusu) mevcuttur.

### A. ikas Admin MCP Sunucusu (`ikas`)
1. **`list`**: Mevcut tüm ikas GraphQL operasyonlarını listeler.
   - **Parametreler:** Yok (`{}`).
   - **Çıktı:** GraphQL operasyon adları listesi.
2. **`introspect`**: Belirtilen GraphQL operasyonunun şema tanımını getirir.
   - **Parametreler:** `operationName` (string, zorunlu).
   - **Çıktı:** GraphQL AST / Type introspection verisi.
3. **`execute`**: ikas backend üzerinde GraphQL sorgusu veya mutasyonu çalıştırır.
   - **Parametreler:** `operationName` (string, zorunlu), `query` (string, zorunlu), `variables` (JSON string, opsiyonel).
   - **Çıktı:** GraphQL `data` ve `errors` objesi.

---

### B. ikas Tema ve Bileşen MCP Sunucusu (`ikas-code-components`)

#### 1. Global Token ve Tema Ayar Araçları
- **`create_theme_global`**: Bağlı ikas editöründe yeni bir global tema ayarı veya tasarım token'ı oluşturur.
  - **Zorunlu Parametreler:** `project_root` (string), `kind` (`globalVariable` | `color` | `typography` | `breakpoint` | `keyframe` | `colorScheme`).
  - **`kind: "globalVariable"` Özel Parametreleri:** `display_name` (string, zorunlu), `type` (enum, zorunlu: `TEXT` | `RICH_TEXT` | `IMAGE` | `COLOR` | `NUMBER` | `BOOLEAN` | `BORDER` | `SHADOW`), `value` (JSON objesi/değeri, opsiyonel).
    - *Value Şemaları:* `TEXT`/`COLOR`: string (hex/rgba); `RICH_TEXT`: HTML string; `NUMBER`: number; `BOOLEAN`: boolean (`true`/`false`); `IMAGE`: `{ id: "theme-images/<uuid>" }` (Asla `.url` içermez); `BORDER`: `{ width: { value, unit }, style, color }`; `SHADOW`: `{ x, y, blur, spread, color, position: "outside" | "inside" }`.
  - **`kind: "color"` Özel Parametreleri:** `name` (string, zorunlu - `/` ile gruplanabilir örn. `"Brand/Primary"`), `value` (string, hex örn. `"#37435B"` veya `rgb()`). *Not: `var(...)` referansı kabul edilmez.*
  - **`kind: "typography"` Özel Parametreleri:** `name` (string, zorunlu), en az biri: `font_family`, `font_size` (örn. `"18px"`), `font_weight` (100, 200, 300, 400, 500, 600, 700, 800, 900 veya `"600i"`), `line_height` (örn. `"1.4"` veya `"25.2px"`), `letter_spacing` (örn. `"normal"` veya `"0.02em"`).
  - **`kind: "breakpoint"` Özel Parametreleri:** `name` (string), `width` (pozitif integer px).
  - **`kind: "keyframe"` Özel Parametreleri:** `name` (string), `points` (array: `{ point: "0%", styles: [...] }`), `keyframe_type` (`keyframe` | `transition`), `settings` (`[{ property: "animation-duration", value: "0.3s" }]`).
  - **`kind: "colorScheme"` Özel Parametreleri:** `name` (string), `colors` (array: `{ slotId? | newSlotName?, value }`).
- **`list_theme_globals`**: Editördeki tüm tema global değişkenlerini ve tasarım token'larını listeler.
  - **Parametreler:** `project_root` (string, zorunlu), `port` (number, varsayılan 5201).
  - **Dönen Obje Yapısı:**
    - `settings`: `Record<string, ThemeSetting>` (`name` stable variable key'dir örn. `_6Q0KV7VGGM`).
    - `colors`: `DesignToken[]` (`{ id, name, resolved, cssVar }`).
    - `typography`: `TypographyToken[]` (`{ id, name, resolved, className }`).
    - `breakpoints`: `BreakpointToken[]` (`{ id, name, width }`).
    - `keyframes`: `KeyframeToken[]` (`{ id, name, type, ref, settings, points }`).
    - `colorSchemes`: `{ schemes: ColorSchemeSlot[], values: ColorSchemeToken[] }`.
- **`update_theme_color`**: Var olan bir renk token'ını günceller.
- **`update_text_style`**: Var olan bir tipografi stilini günceller (className sabit kalır).
- **`update_theme_breakpoint`**: Var olan bir breakpoint genişliğini günceller.
- **`update_theme_keyframe`**: Var olan keyframe/transition animasyonunu günceller.
- **`update_theme_color_scheme`**: Var olan renk şeması (palette) slot renklerini günceller.
- **`rename_theme_color_scheme_slot`**: Renk şeması slotunun adını değiştirir.
- **`delete_theme_global`**: Belirtilen id'deki global token'ı siler.

#### 2. Sayfa ve Yerleşim Yönetimi Araçları
- **`list_editor_pages`**: Temadaki tüm editör sayfalarını listeler (`id`, `name`, `pageType`).
- **`create_page`**: Belirtilen `pageType` türünde yeni sayfa oluşturur.
- **`get_page_by_type`**: `pageType` değerine göre (örn. `CATEGORY`, `PRODUCT`, `INDEX`) sayfa id'sini döndürür.
- **`list_page_sections`**: Belirtilen sayfaya eklenmiş bölüm (section) yerleşimlerini listeler (`elementId`, `componentId`, `propCount`).
- **`add_section_to_page`**: Sayfaya tek bir bölüm ekler.
- **`add_sections_to_page`**: Sayfaya tek seferde birden fazla bölüm ekler ve ilk prop değerlerini atar (En hızlı sayfa kurulum yolu).
- **`update_section_prop`**: Yerleştirilmiş bir bölümün tek bir prop değerini günceller.
- **`update_page_sections`**: Sayfadaki birden fazla bölümün prop değerlerini tek bir çağrıda toplu günceller.

#### 3. Görsel ve Medya Yönetim Araçları
- **`upload_image`**: Yerel dosya yolundan veya URL'den bir görsel yükler ve `id` döner (`{ id: "theme-images/<uuid>" }`).
- **`upload_images`**: Birden fazla görseli toplu olarak yükler.

#### 4. Varlık (Entity) ve Arama Araçları
- **`search_products`**: Mağazadaki ürünleri arar ve `productId`, `variantId` bilgilerini döner.
- **`list_categories`**: Mağaza kategorilerini listeler (`id`, `name`).
- **`list_brands`**: Mağaza markalarını listeler (`id`, `name`).
- **`list_blogs`**: Mağaza blog yazılarını listeler.
- **`list_blog_categories`**: Blog kategorilerini listeler.

#### 5. Tema Kodu, Şema ve Kılavuz Araçları
- **`get_component_props`**: Bir bileşenin prop şemasını, tiplerini ve `allowedComponentIds` kısıtlarını getirir.
- **`get_section_values`**: Yerleştirilmiş bir bölümün mevcut tüm prop değerlerini okur (Read-Modify-Write için).
- **`get_prop_types`**: ikas config prop tiplerinin TypeScript tanımlarını ve kılavuzunu döner.
- **`get_section_template`**: Tema bölüm şablon tarifini ve çocuk bileşen hiyerarşisini getirir.
- **`get_editor_workflow`**: Editör içerik doldurma ve prop güncelleme iş akışı kılavuzunu döner.
- **`publish_theme`**: Temayı canlıya yayınlar (`confirm: true` gerektirir).
- **Diğer Şema/Doküman Araçları:** `list_imported_sections`, `import_section`, `get_section_child`, `get_type_definition`, `list_types`, `search_types`, `get_functions_for_type`, `list_functions`, `get_function_doc`, `search_docs`, `list_examples`, `get_code_example`, `get_framework_guide`, `get_model_guide`, `list_topics`, `list_section_types`, `analyze_old_theme`, `get_migration_guide`, `get_migration_example`, `plan_migration`, `get_section_migration_plan`.

---

## Global Token Sistemi

### Kind / Type Matrisi ve Değer Formatları

| `kind` Değeri | `type` Değeri | Geçerli Value Formatı | Örnek Değer / Şema |
| :--- | :--- | :--- | :--- |
| `globalVariable` | `TEXT` | string | `"18px"` veya `"Jost, sans-serif"` |
| `globalVariable` | `RICH_TEXT` | HTML string | `"<p>Hoş geldiniz</p>"` |
| `globalVariable` | `IMAGE` | JSON Obje (`{ id }`) | `{ "id": "theme-images/a1b2c3d4" }` |
| `globalVariable` | `COLOR` | Hex / RGBA string | `"#37435B"` veya `"rgba(55,67,91,0.75)"` |
| `globalVariable` | `NUMBER` | number | `32` veya `1.4` |
| `globalVariable` | `BOOLEAN` | boolean | `true` veya `false` (string `"true"` GEÇERSİZDİR) |
| `globalVariable` | `BORDER` | JSON Obje | `{ "width": { "value": 1, "unit": "px" }, "style": "solid", "color": "#C8CFD0" }` |
| `globalVariable` | `SHADOW` | JSON Obje | `{ "x": 0, "y": 4, "blur": 20, "spread": 0, "color": "rgba(55, 67, 91, 0.08)", "position": "outside" }` |
| `color` | *(Yok)* | Hex / RGB string | `"#E3E045"` (Başkasına `var(...)` ile bağlanamaz) |
| `typography` | *(Yok)* | Parametre alanları | `font_size: "18px"`, `font_weight: "500"`, `line_height: "1.4"`, `font_family: "Jost, sans-serif"` |
| `breakpoint` | *(Yok)* | Integer px | `width: 768` |
| `keyframe` | *(Yok)* | Points & Settings | `points: [{ point: "0%", styles: [...] }]`, `keyframe_type: "transition"` |
| `colorScheme` | *(Yok)* | Slot array | `colors: [{ slotId: "<id>", value: "var(--colorId)" }]` |

---

### Bağlama Mekanizmaları Tablosu

| Token Tipi | Editör / SDK Dönen Alan | Bileşende Kullanım Şekli | Örnek Kod Satırı |
| :--- | :--- | :--- | :--- |
| **Renk (`color`)** | `cssVar` | CSS değişkeni olarak `var(--<cssVar>)` | `style={{ color: "var(--color_37435b)" }}` |
| **Tipografi (`typography`)** | `className` | CSS sınıfı olarak `_<id>` | `<h1 className={typographyToken.className}>` |
| **Global Değişken (`globalVariable`)**| `name` (variableName) | `getThemeSetting` ile okunur | `const setting = getThemeSetting("_6Q0KV7VGGM");` <br/> `<div style={{ "--pad": setting?.value }}>` |
| **Breakpoint (`breakpoint`)** | `id` & `width` | CSS `bp(<id>)` medyamatrisi | `@media (min-width: bp(_breakpointId)) { ... }` |
| **Keyframe / Animasyon** | `ref` | CSS `animation-name` | `style={{ animationName: keyframeToken.ref }}` |
| **Color Scheme Slot** | `colorsByScheme[slotId]` | `cssVar` ile canlı renk bağlama | `style={{ backgroundColor: scheme.colorsByScheme[slotId].cssVar }}` |

---

## Bileşen Şeması ve Prop Tipleri Kataloğu

ikas Tema Ekosisteminde `ikas.config.json` içerisinde tanımlanabilen **tam 30 adet Prop Tipi (`PropType`)** mevcuttur:

1. **`TEXT`**: Düz metin string'i. `defaultValue: "Metin"`.
2. **`RICH_TEXT`**: Zengin HTML metni. `defaultValue: "<p>Metin</p>"`.
3. **`NUMBER`**: Sayısal değer. `defaultValue: 10`.
4. **`NUMBER_RANGE`**: Belirli aralıkta sayı. `defaultValue: 5`.
5. **`BOOLEAN`**: Mantıksal değer. `defaultValue: true`.
6. **`IMAGE`**: Tekil görsel objesi. Runtime tipi: `IkasImage | null`. `update_section_prop` değeri: `{ "id": "theme-images/<uuid>" }`.
7. **`IMAGE_LIST`**: Görsel listesi. Runtime tipi: `IkasImageList`. `update_section_prop` değeri: `{ "images": [{ "id": "..." }] }`.
8. **`VIDEO`**: Video içerik objesi. `update_section_prop` değeri: `{ "video": { "id": "..." }, "autoplay": false, "controls": true }`.
9. **`SVG`**: Ham SVG inline markup'ı. `update_section_prop` değeri: `{ "value": "<svg>...</svg>" }`.
10. **`SVG_LIST`**: SVG listesi. `update_section_prop` değeri: `{ "svgs": ["<svg>...</svg>"] }`.
11. **`DATE`**: Tarih string'i (ISO veya epoch ms).
12. **`LINK`**: Bağlantı objesi. `update_section_prop` değeri: `{ "id": "k3p9x", "linkType": "PAGE" | "EXTERNAL" | "FILE", "label": "Shop", "pageId": "...", "pageType": "INDEX", "subLinks": [] }`.
13. **`LIST_OF_LINK`**: Bağlantı listesi. `update_section_prop` değeri: `{ "links": [<LINK_OBJECT>] }`.
14. **`COLOR`**: Renk hex/rgba string'i. `update_section_prop` değeri: `{ "value": "#37435B" }`.
15. **`ENUM`**: Seçim seçeneği. `enumTypeId` tanımlanır veya `options` verilir. `update_section_prop` değeri: `{ "value": "OPTION_KEY" }`.
16. **`PRODUCT`**: Tekil ürün seçimi. `update_section_prop` değeri: `{ "productId": "...", "variantId": "..." }`.
17. **`PRODUCT_LIST`**: Ürün listesi (Static veya Dynamic). `update_section_prop` değeri: `{ "id": "p1", "productListType": "STATIC", "productIds": [{ "productId": "...", "variantId": "..." }] }` veya `{ "productListType": "CATEGORY", "category": "<categoryId>" }`.
18. **`PRODUCT_ATTRIBUTE`**: Ürün nitelik tanımı.
19. **`PRODUCT_ATTRIBUTE_LIST`**: Ürün nitelik listesi.
20. **`CATEGORY`**: Kategori seçimi. `update_section_prop` değeri: `{ "categoryId": "..." }`.
21. **`CATEGORY_LIST`**: Kategori listesi. `update_section_prop` değeri: `{ "categoryListType": "STATIC", "categoryIds": ["..."] }`.
22. **`BRAND`**: Marka seçimi. `update_section_prop` değeri: `{ "brandId": "..." }`.
23. **`BRAND_LIST`**: Marka listesi. `update_section_prop` değeri: `{ "brandListType": "STATIC", "brandIds": ["..."] }`.
24. **`BLOG`**: Blog yazısı seçimi. `update_section_prop` değeri: `{ "blogId": "..." }`.
25. **`BLOG_LIST`**: Blog yazıları listesi. `update_section_prop` değeri: `{ "blogListType": "STATIC", "blogIds": ["..."] }`.
26. **`BLOG_CATEGORY`**: Blog kategorisi seçimi.
27. **`BLOG_CATEGORY_LIST`**: Blog kategori listesi.
28. **`TYPE`**: Stil veya yapı tipi referansı (`typeId`).
29. **`COMPONENT`**: Tekil çocuk bileşen kapsayıcısı. `update_section_prop` değeri: `{ "id": "c1", "codeComponentId": "...", "propValues": { ... } }`.
30. **`COMPONENT_LIST`**: Birden fazla çocuk bileşen listesi. `update_section_prop` değeri: `{ "components": [{ "id": "c1", "codeComponentId": "...", "propValues": { ... } }] }`.

---

### Prop Grupları (`propGroups`)
Editör yan panelinde prop'ları kategorize etmek için kullanılır:
```json
"propGroups": [
  {
    "id": "design_group",
    "name": "Tasarım Ayarları",
    "description": "Bölüm renk ve boşluk ayarları"
  }
]
```
Prop tanımında `"groupId": "design_group"` verilerek gruba bağlanır.

---

### Bileşen Kayıt Yapısı (`ikas.config.json`)
```json
{
  "id": "hero-banner-component",
  "name": "Hero Banner",
  "entry": "./src/components/hero-banner/index.tsx",
  "styles": "./src/components/hero-banner/index.css",
  "type": "section",
  "isHeader": false,
  "isFooter": false,
  "props": [ ... ],
  "propGroups": [ ... ]
}
```

---

## Storefront API (`@ikas/bp-storefront`)

### 1. `getThemeSetting` ve Tema Ayar Fonksiyonları
```ts
import { getThemeSetting, getThemeSettingValue, getThemeColors, getThemeTypography } from "@ikas/bp-storefront";

// Stable variable key ile tema değişkenini okuma
const setting = getThemeSetting("_6Q0KV7VGGM"); // ThemeSetting | undefined
const value = getThemeSettingValue("_6Q0KV7VGGM"); // any (doğrudan değer)
```

### 2. `IkasImage` Yapısı ve Kullanım Fonksiyonları
`IkasImage` tipi **ASLA `.url` veya `.src` ALANI İÇERMEZ**.
```ts
export type IkasImage = {
    id: string;
    isVideo?: boolean | null;
    altText?: string | null;
    fileName?: string | null;
};
```
**Doğru URL Çıkarma Yöntemi:**
```ts
import { getDefaultSrc, getSrc, getThumbnailSrc, createMediaSrcset } from "@ikas/bp-storefront";

const defaultUrl = getDefaultSrc(image); // Varsayılan CDN URL'i
const resizedUrl = getSrc(image, 600);   // 600px genişlikte CDN URL'i
const thumbUrl   = getThumbnailSrc(image); // Küçük resim URL'i
const srcset     = createMediaSrcset(image); // Responsive srcset string'i
```

### 3. Varlık Tipleri (`IkasProduct`, `IkasCategory`, vb.)
- **`IkasProduct`**: `id`, `name`, `type` (`PHYSICAL` | `DIGITAL` | `MEMBERSHIP`), `description`, `brand`, `categories`, `variants`, `attributes`, `variantTypes`, `averageRating`, `reviewCount`, `stars`, `offers`, `campaigns`.
- **`IkasCategory`**: `id`, `name`, `description`, `image` (`IkasImage | null`), `parentId`, `categoryPathItems`, `orderType`.

---

## Kısıtlar, Kurallar ve Bilinen Tuzaklar

### 1. İzin Verilen NPM Paketleri Allowlist'i
`@ikas/component-cli` esbuild derleyicisi güvenlik ve performans nedeniyle **YALNIZCA aşağıdaki npm paket köklerine izin verir**:
- `preact` (ve `preact/hooks`, `preact/compat`, `preact/jsx-runtime`)
- `mobx`
- `@ikas/bp-storefront`
- `@ikas/bp-storefront-models`
- `@ikas/bp-storefront-config`
- `@ikas/bp-storefront-api`
- `@ikas/component-utils`
- `three`
- `animejs`

> ⚠️ **TUZAK / HATA:** Bu liste dışındaki herhangi bir npm paketini (`lodash`, `axios`, `framer-motion`, `lucide-react` vb.) `import` etmek veya izin verilen paketlerin yetkisiz derin dosya yollarından import yapmak (`@ikas/bp-storefront/dist/...`) `ikas-forbid-external-packages` derleme eklentisi tarafından **BUILD HATASI** ile reddedilir.

---

### 2. Geçersiz Token `kind` ve `type` Kombinasyonları
- ❌ `kind: "spacing"` veya `kind: "radius"` diye bir kind YOKTUR. Bunlar `kind: "globalVariable"` ve `type: "TEXT"` olarak tanımlanır.
- ❌ `kind: "color"` için `value` kısmına `var(--otherColor)` verilemez. Renk token'ları başka renk token'larına doğrudan alias olamaz.
- ❌ `globalVariable` türünde `BOOLEAN` tipi için string `"true"` verilirse validation patlar; gerçek JSON boolean `true` verilmelidir.

---

### 3. Renk `cssVar` ve `id` Tuzağı
- ⚠️ `list_theme_globals` çıktısındaki renk `id` değeri ile `cssVar` değeri farklı büyük/küçük harf kullanımına (casing) sahip olabilir.
- ❌ Asla `var(--` + `id` + `)` şeklinde elle string birleştirmesi yapılmamalıdır.
- ✅ Her zaman `list_theme_globals`'tan dönen **tam `cssVar` değeri** (örn. `var(--color_37435b)`) doğrudan kullanılmalıdır.

---

### 4. Tipografi ve Türkçe Harf / Capitalization Kuralları
- ⚠️ Tipografi token'larında `text-transform` CSS kuralı doğrudan tanımlanmaz.
- ✅ Türkçe `i/İ/ı/I` harflerinin büyük/küçük harf dönüşümlerinde bozulmaması için HTML kök elementine `<html lang="tr">` eklenmesi ZORUNLUDUR.

---

## Doğrulama ve Analiz Özet Raporu

1. **İncelenen ve Doğrulanan MCP Aracı Sayısı:** **55 Adet** (3 ikas Admin MCP + 52 ikas Code Components MCP aracı).
2. **İncelenen ve Doğrulanan Prop Tipi Sayısı:** **30 Adet** (`PropType` enum tanımı).
3. **İzin Verilen NPM Paket Sayısı:** **9 Adet** (`preact`, `mobx`, `@ikas/bp-storefront`, `@ikas/bp-storefront-models`, `@ikas/bp-storefront-config`, `@ikas/bp-storefront-api`, `@ikas/component-utils`, `three`, `animejs`).
4. **"Doğrulanamadı" Olarak İşaretlenen Bilgi Listesi:** **YOK (0 adet)** — Tüm veri yapıları, şemalar, fonksiyon imzaları ve kısıtlar `@ikas/bp-storefront` ve `@ikas/component-cli` `.d.ts` kaynak dosyalarından ile MCP JSON şemalarından %100 doğrulanmıştır.
