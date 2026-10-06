# PROMPT: Ana Sayfa — Press Logo Ticker (`prompts/ana-sayfa/02-press-ticker.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md), [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır.
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` / `IMAGE_LIST` prop'ları ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"PressTicker"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) dosyasındaki canlı `cssVar`, `className` ve `variableName` değerlerini birebir kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir.
- **Kesintisiz Döngü (Marquee Loop):** Logoların akışında kesinti olmaması için marka logoları HTML içinde en az 2 set halinde duplike edilerek `@keyframes marquee` animasyonuna bağlanır.

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Forbes, Vogue, Bloomberg, GQ gibi uluslararası basın organlarının logolarını kayan bant (marquee ticker) formatında göstererek markaya sosyal kanıt ve güven kazandırmak.
- **Konum:** Hero Banner bölümünün hemen altında 2. sırada yer alır. ikas `type: "section"` türündedir.

### 2. İç Yapı ve Düzen
- Üst Alan: Küçük rozet/etiket metni (`_eZyocyyd0F` -> `Tipografi / Etiket ve Rozet (xs)` - `"BASINDA BİZ"`).
- Kayan Bant Alanı: Kesintisiz sonsuz marquee döngüsü (`animation: marquee var(--marquee-speed, 25s) linear infinite`).
- Logolar: Tek renk (monokrom) veya gri tonlamalı SVG/PNG görselleri (`opacity: 0.7`, hover esnasında `opacity: 1` ve renklenme).

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `press_ticker_group` (Adı: `"Basın Bandı Ayarları"`)
  1. `title` (displayName: `"Bölüm Etiketi"`, description: `"Basın bandı üzerindeki etiket metni"`, type: `"TEXT"`, defaultValue: `"BASINDA BİZ"`).
  2. `logos` (displayName: `"Basın Logoları"`, description: `"Bantta kayacak marka logo görselleri"`, type: `"IMAGE_LIST"`).
  3. `speed` (displayName: `"Kayış Hızı (saniye)"`, description: `"Döngünün bir tam tur süresi"`, type: `"NUMBER"`, defaultValue: 25).
  4. `backgroundColor` (displayName: `"Arka Plan Rengi"`, description: `"Bölüm zemin rengi"`, type: `"COLOR"`).

### 4. Token Bağlantıları
- **Renkler:** `var(--pxNuSoudLn)` (#37435B), `var(--cdFDkBbKkc)` (#C8CFD0), `var(--24KlcgGmm9)` (#FFFFFF).
- **Tipografi:** `_eZyocyyd0F` (`Tipografi / Etiket ve Rozet (xs)` - 13.5px / 500).
- **Global Variables:** `_NTIrquacoN` (`Animasyon / Marquee Ticker` - `transform 25s linear infinite`), `_5Fdl1j6UHQ` (`Boşluk / Dikey Bölüm Spacing` - 24px/32px).

### 5. Responsive Davranış
- **1440px / 768px / 375px:** Tüm ekran genişliklerinde kesintisiz kayan marquee animasyonu aktif kalır; mobilde logo yükseklikleri otomatik ölçeklenir (`height: 32px` -> `24px`).
