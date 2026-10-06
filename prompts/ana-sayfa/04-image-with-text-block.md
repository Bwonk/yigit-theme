# PROMPT: Ana Sayfa — Image With Text Block (`prompts/ana-sayfa/04-image-with-text-block.md`)

## A) 7 TEMEL KURAL (ZORUNLU)
1. **Referans Dosyalar:** [DESIGN.md](file:///root/yigit-theme/DESIGN.md), [GLOBALS.md](file:///root/yigit-theme/GLOBALS.md), [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) ve [IKAS.md](file:///root/yigit-theme/IKAS.md) dosyalarını baştan sona referans al.
2. **Global-First:** Ham renk, font, boşluk veya animasyon yazma; renk `var(--<cssVar>)`, tipografi `className="_<id>"`, globalVariable'lar (`getThemeSetting` ile okunur) `style={{ "--token": setting?.value }}` şeklinde inline CSS değişkenine aktarılır.
3. **Türkçe Editör Metinleri:** `displayName`, `description`, prop grup adları ve görünen tüm editör metinleri Türkçe yazılmalıdır.
4. **Türkçe Description:** Her prop için ne işe yaradığını anlatan açıklayıcı Türkçe `description` ekle.
5. **Default Value:** Her prop'a anlamlı Türkçe `defaultValue` ver. Statik metin kopyalama yasağı vardır — görünen tüm metinler `TEXT` / `IMAGE` prop'ları ve `defaultValue` ile yönetilir.
6. **Uppercase & Türkçe Harf Uyumu:** Büyük/küçük harf serbesttir; ANCAK Türkçe i/İ/ı/I karakterlerinin doğru dönüşmesi için HTML kök elementinde `lang="tr"` ZORUNLUDUR.
7. **Kod İngilizce / Editör Türkçe:** Kod tanımlayıcıları İngilizce (CSS class, JS/TS adları, prop teknik `name`); editör metinleri Türkçe; bileşenin `name` alanı İngilizce olmalıdır (`"ImageWithTextBlock"`).

---

## B) TEKNİK GÜVENLİK KURALLARI
- **cssVar Kuralı:** `id`'den elle `var(--id)` türetmek YASAKTIR; [prompts/TOKENS.md](file:///root/yigit-theme/prompts/TOKENS.md) dosyasındaki canlı `cssVar`, `className` ve `variableName` değerlerini birebir kullan.
- **Tipler:** Tüm prop tipleri `types.ts` dosyasında eksiksiz tanımlanıp export edilir.
- **Ortak Bileşen Bağımlılığı:** Buton alanı için [prompts/ortak/button.md](file:///root/yigit-theme/prompts/ortak/button.md) ortak `Button` bileşenini kullan.

---

## C) BİLEŞEN DETAYI

### 1. Amaç ve Konum
- **Amaç:** Ürünün benzersiz tasarım hikayesini, ergonomik yapısını veya malzeme kalitesini sol/sağ karşılıklı görsel ve metin düzeniyle hikayeleştirerek anlatmak.
- **Konum:** Featured Collection Grid bölümünün altında 4. sırada yer alır. ikas `type: "section"` türündedir.

### 2. İç Yapı ve Düzen
- 2 Kolonlu Staggered Layout (Çapraz veya Yan Yana):
  - Sol/Sağ Görsel Alanı: İnce işçilik ve detay odaklı yaşam tarzı fotoğrafı (`Radius / Medya` - `_YFQAxlLvZl` - 2rem / 32px köşe yumuşatması).
  - Karşı Kolon Metin Alanı:
    - Küçük Etiket: `_eZyocyyd0F` (`Tipografi / Etiket ve Rozet (xs)` - `"ERGONOMİK MÜKEMMELLİK"`).
    - H2 Başlık: `_sKAMD8d1LA` (`Tipografi / Başlık H2` - 36px / 500).
    - Paragraf Açıklaması: `_VcfI5D07Nt` (`Tipografi / Gövde Metni (base)` - 18px).
    - CTA Butonu: [prompts/ortak/button.md](file:///root/yigit-theme/prompts/ortak/button.md) (`variant="PRIMARY"`).

### 3. Prop Listesi (`ikas.config.json`)
- **Prop Grubu:** `image_with_text_group` (Adı: `"Görsel ve Metin Bloğu Ayarları"`)
  1. `badgeText` (displayName: `"Üst Rozet Metni"`, description: `"Başlık üzerindeki küçük etiket"`, type: `"TEXT"`, defaultValue: `"ERGONOMİK MÜKEMMELLİK"`).
  2. `title` (displayName: `"Bölüm Başlığı"`, description: `"Hikaye bloğu ana başlığı"`, type: `"TEXT"`, defaultValue: `"360° Boyun Desteği İle Seyahat Rahatlığı"`).
  3. `description` (displayName: `"Açıklama Metni"`, description: `"Detaylı ürün ve hikaye anlatım metni"`, type: `"TEXT"`, defaultValue: `"Özel hafızalı sünger yapısı sayesinde baş ve boyun bölgenize tam uyum sağlar. Uçak, tren veya araba seyahatlerinde omurga duruşunuzu korur."`).
  4. `buttonText` (displayName: `"Buton Metni"`, description: `"Eyleme çağrı buton yazısı"`, type: `"TEXT"`, defaultValue: `"Tasarım Hikayesini Keşfet"`).
  5. `buttonLink` (displayName: `"Buton Linki"`, description: `"Yönlendirme bağlantısı"`, type: `"LINK"`).
  6. `image` (displayName: `"Görsel"`, description: `"Bloğun yanında gösterilecek detay görseli"`, type: `"IMAGE"`).
  7. `imagePosition` (displayName: `"Görsel Konumu"`, description: `"Görselin solda mı sağda mı yer alacağı"`, type: `"ENUM"`, options: ["LEFT", "RIGHT"], defaultValue: "LEFT").

### 4. Token Bağlantıları
- **Renkler:** `var(--pxNuSoudLn)` (#37435B), `var(--24KlcgGmm9)` (#FFFFFF), `var(--sy8ZnXZdoG)` (#E3E045).
- **Tipografi:** `_sKAMD8d1LA` (`Tipografi / Başlık H2`), `_VcfI5D07Nt` (`Tipografi / Gövde Metni base`), `_eZyocyyd0F` (`Tipografi / Etiket ve Rozet xs`).
- **Global Variables:** `_YFQAxlLvZl` (`Radius / Medya` - 32px), `_Kl0my3VVMA` (`Boşluk / Masaüstü Dikey Spacing` - 48px).

### 5. Responsive Davranış
- **1440px:** 2 Kolon yan yana (%50-%50 esnek grid).
- **768px / 375px:** Görsel üstte, metin bloğu altta dikey sıralanır.
