# PROMPT: Ana Sayfa — Product Features Icons (`prompts/ana-sayfa/05-product-features-icons.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md), [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır.
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` prop'ları ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"ProductFeaturesIcons"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) dosyasındaki canlı `cssVar`, `className` me `variableName` değerlerini birebir kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir.

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Ürünün en güçlü 3 temel özelliğini (Ergonomik Destek, Nefes Alabilir Kumaş, Ücretsiz Kargo & İade) ikonlu şık kartlar halinde öne çıkarmak.
- **Konum:** Image With Text Block bölümünün altında 5. sırada yer alır. ikas `type: "section"` türündedir.

### 2. İç Yapı ve Düzen
- 3 Kolonlu Izgara Yapısı (`grid-template-columns: repeat(3, 1fr)`).
- Her Özellik Kartı:
  - SVG İkon Kapsayıcısı (`width: 56px`, `height: 56px`, `background: var(--sy8ZnXZdoG)`, `border-radius: 50%`).
  - Kart Başlığı: `_AZR1yL8GrK` (`Tipografi / Kart ve Alt Başlık (lg)` - 24px / 500).
  - Kart Açıklaması: `_C0OZ8W7vYS` (`Tipografi / İkincil Metin (sm)` - 16px).
  - Kart Yüzeyi: Organik köşe yumuşatması (`Radius / Kart` - `_WyFUVwOpPk` - 2rem / 32px), `Gölge / Kart Soft Shadow` (`_yyUleMlhR4`).

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `product_features_group` (Adı: `"Özellik İkonları Ayarları"`)
  1. `feature1Title` (displayName: `"1. Özellik Başlığı"`, description: `"İlk özellik kartının başlığı"`, type: `"TEXT"`, defaultValue: `"Ergonomik Destek"`).
  2. `feature1Desc` (displayName: `"1. Özellik Açıklaması"`, description: `"İlk özellik kartının açıklama metni"`, type: `"TEXT"`, defaultValue: `"Patentli form yapısı ile omurga duruşunuzu destekler."`).
  3. `feature2Title` (displayName: `"2. Özellik Başlığı"`, description: `"İkinci özellik kartının başlığı"`, type: `"TEXT"`, defaultValue: `"Nefes Alabilir Kumaş"`).
  4. `feature2Desc` (displayName: `"2. Özellik Açıklaması"`, description: `"İkinci özellik kartının açıklama metni"`, type: `"TEXT"`, defaultValue: `"Terletmeyen kılıf yapısı ile her mevsim ferah kullanım."`).
  5. `feature3Title` (displayName: `"3. Özellik Başlığı"`, description: `"Üçüncü özellik kartının başlığı"`, type: `"TEXT"`, defaultValue: `"Hızlı & Ücretsiz Kargo"`).
  6. `feature3Desc` (displayName: `"3. Özellik Açıklaması"`, description: `"Üçüncü özellik kartının açıklama metni"`, type: `"TEXT"`, defaultValue: `"500 TL üzeri siparişlerde aynı gün kargo avantajı."`).

### 4. Token Bağlantıları
- **Renkler:** `var(--pxNuSoudLn)` (#37435B), `var(--sy8ZnXZdoG)` (#E3E045 Accent Sarı), `var(--24KlcgGmm9)` (#FFFFFF).
- **Tipografi:** `_AZR1yL8GrK` (`Tipografi / Kart ve Alt Başlık lg` - 24px), `_C0OZ8W7vYS` (`Tipografi / İkincil Metin sm` - 16px).
- **Global Variables:** `_WyFUVwOpPk` (`Radius / Kart` - 32px), `_yyUleMlhR4` (`Gölge / Kart Soft Shadow`), `_4Ud47RIVna` (`Boşluk / Grid Gap` - 20px).

### 5. Responsive Davranış
- **1440px:** 3 Kolon yatay sıralama.
- **768px:** 3 Kolon veya 2 Kolon sarmalı düzen.
- **375px:** Tek kolon dikey alt alta sıralama (`gap: 16px`).
