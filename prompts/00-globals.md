# PROMPT: Tema Global Token'larının Canlı Kurulumu (`prompts/00-globals.md`)

> **Talimat:** Bu prompt çalıştırıldığında, [GLOBALS.md](file:///root/geeny/GLOBALS.md) dosyasındaki 52 adet global tasarım token'ını ikas editörü üzerinde canlı olarak `create_theme_global` aracıyla oluşturacaksın. Kod yazma ve bileşen düzenleme yapma.

---

## 1. Hazırlık ve Mevcut Durum Okuma
1. `list_theme_globals` MCP aracını `project_root: "/root/geeny"` parametresi ile çağırarak editördeki mevcut tasarım token'larını ve global değişkenleri oku.
2. [GLOBALS.md](file:///root/geeny/GLOBALS.md) dosyasındaki **52 token'lık liste** ile mevcut token'ları karşılaştır.
3. Kullanıcıya kurulacak 52 token'ın özet listesini göster ve **KULLANICI ONAYI BEKLE**.

---

## 2. Token Kurulum Adımları (`create_theme_global`)

Kullanıcı onay verdikten sonra [GLOBALS.md](file:///root/geeny/GLOBALS.md) ve [IKAS.md](file:///root/geeny/IKAS.md) kurallarına göre `create_theme_global` aracını çalıştır:

### A. Renkler — `kind: "color"` (9 Token)
Aşağıdaki 9 renk token'ını sırayla oluştur:
- `name: "Renkler / Ana Lacivert"`, `value: "#37435B"`
- `name: "Renkler / Accent Sarı"`, `value: "#E3E045"`
- `name: "Renkler / Açık Gri Mavi"`, `value: "#C8CFD0"`
- `name: "Renkler / Yıldız Sarısı"`, `value: "#E3E062"`
- `name: "Renkler / Saf Beyaz"`, `value: "#FFFFFF"`
- `name: "Renkler / Saf Siyah"`, `value: "#000000"`
- `name: "Renkler / Overlay Siyah"`, `value: "rgba(55, 67, 91, 0.75)"`
- `name: "Renkler / Sticky Header Çizgisi"`, `value: "rgba(0, 0, 0, 0.08)"`
- `name: "Renkler / Kargo İlerleme Çubuğu"`, `value: "#E3E045"`

### B. Tipografi — `kind: "typography"` (10 Token)
Aşağıdaki 10 tipografi stilini sırayla oluştur:
- `name: "Tipografi / Display Hero"`, `font_family: "Onest"`, `font_size: "54px"`, `font_weight: "600"`, `line_height: "64.8px"`
- `name: "Tipografi / Başlık H1"`, `font_family: "Onest"`, `font_size: "48px"`, `font_weight: "600"`, `line_height: "62.5px"`
- `name: "Tipografi / Başlık H2"`, `font_family: "Onest"`, `font_size: "36px"`, `font_weight: "600"`, `line_height: "46.8px"`
- `name: "Tipografi / Başlık H3"`, `font_family: "Onest"`, `font_size: "30.2px"`, `font_weight: "500"`, `line_height: "39.3px"`
- `name: "Tipografi / Başlık H4"`, `font_family: "Onest"`, `font_size: "27px"`, `font_weight: "500"`, `line_height: "35.1px"`
- `name: "Tipografi / Kart ve Alt Başlık (lg)"`, `font_family: "Onest"`, `font_size: "24px"`, `font_weight: "500"`, `line_height: "31.2px"`
- `name: "Tipografi / Gövde Metni (base)"`, `font_family: "Roboto Flex"`, `font_size: "18px"`, `font_weight: "400"`, `line_height: "25.2px"`
- `name: "Tipografi / İkincil Metin (sm)"`, `font_family: "Roboto Flex"`, `font_size: "16px"`, `font_weight: "400"`, `line_height: "22.4px"`
- `name: "Tipografi / Etiket ve Rozet (xs)"`, `font_family: "Roboto Mono"`, `font_size: "13.5px"`, `font_weight: "400"`, `line_height: "18.9px"`
- `name: "Tipografi / Mobil Duyuru Metni"`, `font_family: "Roboto Mono"`, `font_size: "12px"`, `font_weight: "400"`, `line_height: "16.8px"`

### C. Boşluklar / Spacing — `kind: "globalVariable"`, `type: "TEXT"` (15 Token)
Aşağıdaki 15 boşluk değişkenini oluştur:
- `display_name: "Boşluk / Site Maksimum Genişliği"`, `type: "TEXT"`, `value: "1820px"`
- `display_name: "Boşluk / Yatay Bölüm Padding"`, `type: "TEXT"`, `value: "1.25rem"`
- `display_name: "Boşluk / Mobil Yatay Padding"`, `type: "TEXT"`, `value: "16px"`
- `display_name: "Boşluk / Dikey Bölüm Spacing"`, `type: "TEXT"`, `value: "2rem"`
- `display_name: "Boşluk / Masaüstü Dikey Spacing"`, `type: "TEXT"`, `value: "48px"`
- `display_name: "Boşluk / Grid Gap"`, `type: "TEXT"`, `value: "1.25rem"`
- `display_name: "Boşluk / Mobil Grid Gap"`, `type: "TEXT"`, `value: "12px"`
- `display_name: "Boşluk / Tablet Grid Gap"`, `type: "TEXT"`, `value: "16px"`
- `display_name: "Boşluk / Header Yüksekliği"`, `type: "TEXT"`, `value: "60px"`
- `display_name: "Boşluk / Announcement Bar Yüksekliği"`, `type: "TEXT"`, `value: "38px"`
- `display_name: "Boşluk / Buton Yüksekliği"`, `type: "TEXT"`, `value: "48px"`
- `display_name: "Boşluk / Checkout Buton Yüksekliği"`, `type: "TEXT"`, `value: "52px"`
- `display_name: "Boşluk / Sticky Cart Bar Yüksekliği"`, `type: "TEXT"`, `value: "64px"`
- `display_name: "Boşluk / Cart Drawer Genişliği"`, `type: "TEXT"`, `value: "420px"`
- `display_name: "Boşluk / Mobile Drawer Genişliği"`, `type: "TEXT"`, `value: "320px"`

### D. Radius — `kind: "globalVariable"`, `type: "TEXT"` (7 Token)
Aşağıdaki 7 radius değişkenini oluştur:
- `display_name: "Radius / Kart"`, `type: "TEXT"`, `value: "2rem"`
- `display_name: "Radius / Medya"`, `type: "TEXT"`, `value: "2rem"`
- `display_name: "Radius / Buton"`, `type: "TEXT"`, `value: "0.5rem"`
- `display_name: "Radius / Input ve Form"`, `type: "TEXT"`, `value: "0.5rem"`
- `display_name: "Radius / Sepet İtem Görseli"`, `type: "TEXT"`, `value: "12px"`
- `display_name: "Radius / Swatch Dairesel"`, `type: "TEXT"`, `value: "50%"`
- `display_name: "Radius / Kargo İlerleme Çubuğu"`, `type: "TEXT"`, `value: "4px"`

### E. Gölge / Shadow — `kind: "globalVariable"`, `type: "SHADOW"` (4 Token)
Aşağıdaki 4 shadow değişkenini JSON obje formatında oluştur:
- `display_name: "Gölge / Buton Drop Shadow"`, `type: "SHADOW"`, `value: { "x": 0, "y": -1, "blur": 1, "spread": 0, "color": "rgba(227, 224, 69, 0.5)", "position": "outside" }`
- `display_name: "Gölge / Kart Soft Shadow"`, `type: "SHADOW"`, `value: { "x": 0, "y": 4, "blur": 20, "spread": 0, "color": "rgba(55, 67, 91, 0.08)", "position": "outside" }`
- `display_name: "Gölge / Sticky Header Shadow"`, `type: "SHADOW"`, `value: { "x": 0, "y": 2, "blur": 8, "spread": 0, "color": "rgba(0, 0, 0, 0.05)", "position": "outside" }`
- `display_name: "Gölge / Swatch Odak Gölgesi"`, `type: "SHADOW"`, `value: { "x": 0, "y": 0, "blur": 0, "spread": 2, "color": "rgba(55, 67, 91, 1)", "position": "outside" }`

### F. Animasyon — `kind: "globalVariable"`, `type: "TEXT"` (7 Token)
Aşağıdaki 7 animasyon transition değişkenini oluştur:
- `display_name: "Animasyon / Buton ve Hover"`, `type: "TEXT"`, `value: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"`
- `display_name: "Animasyon / Drawer ve Modal"`, `type: "TEXT"`, `value: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"`
- `display_name: "Animasyon / Görsel Scale Hover"`, `type: "TEXT"`, `value: "transform 0.5s ease-out"`
- `display_name: "Animasyon / Menü Alt Çizgi"`, `type: "TEXT"`, `value: "transform 0.25s ease"`
- `display_name: "Animasyon / Akordiyon Açılış"`, `type: "TEXT"`, `value: "max-height 0.35s ease-in-out"`
- `display_name: "Animasyon / Sticky Bar Belirme"`, `type: "TEXT"`, `value: "transform 0.3s ease, opacity 0.3s ease"`
- `display_name: "Animasyon / Fade Yumuşak"`, `type: "TEXT"`, `value: "opacity 0.3s ease-in-out"`

---

## 3. Doğrulama ve Özet Tablo
1. Kurulum bittikten sonra `list_theme_globals` MCP aracını tekrar çağır.
2. Oluşan tüm token'ların `id`, `cssVar`, `className` veya `variableName` değerlerini oku.
3. Kullanıcıya oluşturulan 52 token'ın doğrulama özet tablosunu sun.
