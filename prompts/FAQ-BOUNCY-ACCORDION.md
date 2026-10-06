# FAQ Bouncy Accordion — Plan & Rapor

Compact kayıt: kurulum planı + canlı düzeltmeler + test içeriği.  
Canlı referans: [dev-flowventory.ikas.shop](https://dev-flowventory.ikas.shop/)

---

## 1. Hedef UX

Single-open accordion · ikon satırları · weighted spring açılış · `prefers-reduced-motion` güvenli · Yigit token dili (solid yüzey, accent chip, gradient yok).

---

## 2. Mimari

```
FaqBouncyAccordion (section)
  └─ IkasComponentRenderer [items]
       └─ FaqAccordionItem (component)
            └─ BouncyAccordionRow (sub)
                 └─ faqAccordionGroup.ts (single-open bus)
```

| Parça | Path | Tip |
|--------|------|-----|
| Parent | `src/components/FaqBouncyAccordion/` | section |
| Child | `src/components/FaqAccordionItem/` | component |
| Row UI | `src/sub-components/BouncyAccordionRow/` | internal |
| Bus | `src/utils/faqAccordionGroup.ts` | util |
| Toggle | `AccordionToggleIcon` (mevcut) | reuse |

**COMPONENT_LIST:** ikon + soru + cevap (≥3 alan), dinamik sayı.  
**Bus:** parent child prop okuyamaz → `data-faq-group` + subscribe/toggle; çoklu FAQ section bağımsız.

---

## 3. CLI Setup (sıra zorunlu)

1. `add-component FaqAccordionItem` (SVG / TEXT / RICH_TEXT) → `componentId` yakala  
2. `add-component FaqBouncyAccordion` (section: tag, title, subtitle, backgroundColor, items, emptyStateText)  
3. `update-prop items --filteredComponentIds '[childId]'`  
4. Prop groups: `content` · `texts` · `appearance`  

`types.ts` / `ikas.config.json` / `index.ts` — sadece CLI.

**Child id:** `e1iohf8g-dXdCatm0dJ` · **Section id:** `e1iohf8g-QFHGqGfTuN`

---

## 4. Props

**Section:** `tag`, `title`, `subtitle`, `backgroundColor` (`#ffffff`), `items` (COMPONENT_LIST), `emptyStateText`  
**Item:** `icon` (SVG), `question` (TEXT), `answer` (RICH_TEXT)  
SVG: `normalizeSvg(..., { color: "currentColor" })` · cevap: `dangerouslySetInnerHTML`

---

## 5. Motion / a11y

- Panel: `grid-template-rows: 0fr → 1fr`  
- Spring: `--faq-spring` ← `ThemeSetting.qtyStepper` (`cubic-bezier(0.34, 1.56, 0.64, 1)`)  
- Open weight: surfaceSoft + sol accent bar (negatif margin yok)  
- Reduced-motion: transition off, anında open  
- Button: `aria-expanded` / `aria-controls` · panel: `role="region"`

---

## 6. Canlı bug’lar → fix (P0/P1)

| Bulgu | Fix |
|--------|-----|
| `useId` her renderer root’ta `P0-0` → tüm satırlar birlikte açılıyor | Modül sayacı `nextFaqRowUid` → unique `itemKey` / aria id |
| Head/list sol hizalı | `align-items: center` + `text-align: center` + list `margin-inline: auto` (max 720px) |
| Tipografi CSS clamp vs ThemeType | `label` / `h2` / `h3` / `bodySm`; CSS’te font-size ezme yok |
| Radius 12px hardcode | `--faq-radius` ← `cartItemImgRadius` |
| `:last-child` / `+` sibling kırık (wrapper) | List `border-bottom` + her row `border-top` |
| Placement CTA altı (eski) | Güncel: CurvedMarquee → **FAQ** → Newsletter → Footer — taşıma gerekmedi |

Doğrulama: `npx ikas-component check --json` + `build` (30 component OK).

---

## 7. Test SSS içeriği (Home)

Editör Home · FAQ `items` (Yigit / Infinity Pillow dili):

1. Yigit nasıl kullanılır?  
2. Malzeme ve ölçüler neler?  
3. Nasıl yıkanır ve bakımı yapılır?  
4. Kargo ne kadar sürer, ücretsiz mi?  
5. İade ve değişim koşulları neler?  
6. Garanti kapsamı nedir?  

Her satırda çizgi SVG ikon. Yeniden yerleştirmede `items` boşalırsa `update_page_sections` ile aynı set tekrar yazılır.

---

## 8. Kapsam dışı

- `publish_theme` (istemeden yayın yok)  
- Framer Motion / multi-open ENUM  
- Placement taşıma (canlıda CTA üstünde)

---

## 9. Sonuç

FAQ production-ready: ortalı, single-open, token’lı, tema SSS’li, reduced-motion güvenli. Canlıda son kod fix’leri için editör önizleme veya açık publish gerekir.
