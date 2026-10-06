import { useEffect, useRef, useState } from "preact/hooks";
import {
  getProductOptionSet,
  getDisplayedOptions,
  getDisplayedChildOptions,
  getProductOptionFormattedPrice,
  getTextValue,
  setTextValue,
  isChecked,
  setCheckboxValue,
  selectValue,
  setValues,
  clearValues,
  isProductOptionSelectValueSelected,
  isTextOption,
  isTextAreaOption,
  isCheckboxOption,
  isChoiceOption,
  isChoiceOptionSelectType,
  isChoiceOptionSwatchType,
  isColorPickerOption,
  isDatePickerOption,
  isFileOption,
  productOptionFileUpload,
  getSrc,
  IkasProduct,
  IkasProductOption,
  IkasProductOptionSelectValue,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import {
  optionFieldId,
  isOwnOptionInvalid,
  pruneHiddenChildOptions,
  SHOW_OPTION_ERRORS_EVENT,
  RESET_OPTION_STATE_EVENT,
} from "../../utils/productOptions";

/** Mağaza tarafındaki yükleme sınırı — istemci tarafında erken uyarı için. */
const MAX_FILE_SIZE_MB = 4;

interface Texts {
  requiredErrorText: string;
  selectPlaceholder: string;
  fileDropText: string;
  uploadingText: string;
  uploadFailedText: string;
  fileSizeErrorText: string;
  fileTypeErrorText: string;
  maxFilesErrorText: string;
  minLabelText: string;
  maxLabelText: string;
  removeFileLabel: string;
  optionalText: string;
}

export interface Props {
  product?: IkasProduct | null;
  requiredErrorText?: string;
  selectPlaceholder?: string;
  fileDropText?: string;
  uploadingText?: string;
  uploadFailedText?: string;
  fileSizeErrorText?: string;
  fileTypeErrorText?: string;
  maxFilesErrorText?: string;
  minLabelText?: string;
  maxLabelText?: string;
  removeFileLabel?: string;
  optionalText?: string;
  className?: string;
}

/* ─── yardımcılar ─────────────────────────────────────────────────────── */

/** Seçenek / seçim değeri ek fiyatı — seçeneğin para birimiyle biçimlenir. */
function formatExtraPrice(option: IkasProductOption, price: number | null | undefined): string {
  if (!price) return "";
  const formatted = getProductOptionFormattedPrice({
    price,
    currency: option.currency,
    currencySymbol: option.currencySymbol,
  } as unknown as IkasProductOption);
  return price > 0 ? `+${formatted}` : formatted;
}

function sortedValues(option: IkasProductOption): IkasProductOptionSelectValue[] {
  return [...(option.selectSettings?.values || [])].sort((a, b) => a.order - b.order);
}

function joinParts(parts: Array<string | false | null | undefined>, sep = " / "): string {
  return parts.filter(Boolean).join(sep);
}

function toInputDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toDisplayDate(inputDate: string): string {
  const [y, m, d] = inputDate.split("-");
  return `${d}.${m}.${y}`;
}

function relativeDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function dateBounds(option: IkasProductOption) {
  const s = option.dateSettings;
  let min: string | undefined;
  let max: string | undefined;
  if (s?.min) min = toInputDate(new Date(s.min));
  else if (s?.minRelativeNextDate != null) min = toInputDate(relativeDate(s.minRelativeNextDate));
  if (s?.max) max = toInputDate(new Date(s.max));
  else if (s?.maxRelativeNextDate != null) max = toInputDate(relativeDate(s.maxRelativeNextDate));
  return { min, max };
}

function fileNameFromUrl(url: string, index: number): string {
  const raw = url.split("?")[0].split("/").pop() || "";
  try {
    return decodeURIComponent(raw) || `#${index + 1}`;
  } catch {
    return raw || `#${index + 1}`;
  }
}

function fillTemplate(template: string, values: Record<string, string>): string {
  return Object.keys(values).reduce(
    (acc, key) => acc.split(`{${key}}`).join(values[key]),
    template
  );
}

/** Kısıt satırı (en az / en fazla) — seçenek tipine göre. */
function constraintHint(option: IkasProductOption, texts: Texts): string {
  const { minLabelText, maxLabelText } = texts;
  if (isTextOption(option) || isTextAreaOption(option)) {
    const s = option.textSettings;
    return joinParts([
      s?.min != null && `${minLabelText}${s.min}`,
      s?.max != null && `${maxLabelText}${s.max}`,
    ]);
  }
  if (isChoiceOption(option)) {
    const s = option.selectSettings;
    return joinParts([
      s?.minSelect != null && s.minSelect > 1 && `${minLabelText}${s.minSelect}`,
      s?.maxSelect != null && s.maxSelect > 1 && `${maxLabelText}${s.maxSelect}`,
    ]);
  }
  if (isDatePickerOption(option)) {
    const { min, max } = dateBounds(option);
    return joinParts(
      [min && `${minLabelText}${toDisplayDate(min)}`, max && `${maxLabelText}${toDisplayDate(max)}`],
      " — "
    );
  }
  if (isFileOption(option)) {
    const s = option.fileSettings;
    return joinParts([
      s?.minQuantity != null && s.minQuantity > 0 && `${minLabelText}${s.minQuantity}`,
      s?.maxQuantity != null && `${maxLabelText}${s.maxQuantity}`,
      !!s?.allowedExtensions?.length &&
        s.allowedExtensions.map((e) => (e.startsWith(".") ? e : `.${e}`)).join(", "),
    ]);
  }
  return "";
}

/* ─── kontrol bileşenleri ─────────────────────────────────────────────── */

interface ControlProps {
  option: IkasProductOption;
  texts: Texts;
  controlId: string;
  describedBy?: string;
  invalid: boolean;
}

function inputClass(base: string, invalid: boolean) {
  return `${base} _C0OZ8W7vYS${invalid ? ` ${base}--invalid` : ""}`;
}

const TextControl = observer(function TextControl({
  option,
  controlId,
  describedBy,
  invalid,
}: ControlProps) {
  const value = getTextValue(option) || "";
  const s = option.textSettings;
  const multiline = isTextAreaOption(option);
  const common = {
    id: controlId,
    className: inputClass("ikas-option-set__input", invalid),
    value,
    maxLength: s?.max ?? undefined,
    "aria-required": !option.isOptional,
    "aria-invalid": invalid || undefined,
    "aria-describedby": describedBy,
    onInput: (e: Event) =>
      setTextValue(option, (e.currentTarget as HTMLInputElement | HTMLTextAreaElement).value),
  };

  return (
    <div className="ikas-option-set__text-wrap">
      {multiline ? (
        <textarea {...common} rows={4} className={`${common.className} ikas-option-set__input--area`} />
      ) : (
        <input {...common} type="text" autoComplete="off" />
      )}
      {s?.max != null && (
        <span className="ikas-option-set__counter _eZyocyyd0F" aria-hidden="true">
          {value.length}/{s.max}
        </span>
      )}
    </div>
  );
});

const SelectControl = observer(function SelectControl({
  option,
  texts,
  controlId,
  describedBy,
  invalid,
}: ControlProps) {
  const values = sortedValues(option);
  const selectedId = option.values?.[0] ?? "";

  return (
    <div className="ikas-option-set__select-wrap">
      <select
        id={controlId}
        className={inputClass("ikas-option-set__input ikas-option-set__select", invalid)}
        value={selectedId}
        aria-required={!option.isOptional}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(e: Event) => {
          const id = (e.currentTarget as HTMLSelectElement).value;
          if (!id) clearValues(option, true);
          else setValues(option, [id]);
          pruneHiddenChildOptions(option);
        }}
      >
        <option value="">{texts.selectPlaceholder}</option>
        {values.map((v) => {
          const price = formatExtraPrice(option, v.price);
          return (
            <option key={v.id} value={v.id}>
              {price ? `${v.value} (${price})` : v.value}
            </option>
          );
        })}
      </select>
      <svg className="ikas-option-set__select-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
});

function toggleChoice(option: IkasProductOption, value: IkasProductOptionSelectValue) {
  selectValue(option, value);
  pruneHiddenChildOptions(option);
}

const ChecklistControl = observer(function ChecklistControl({ option, invalid }: ControlProps) {
  return (
    <div className="ikas-option-set__checklist">
      {sortedValues(option).map((v) => {
        const checked = isProductOptionSelectValueSelected(option, v);
        const price = formatExtraPrice(option, v.price);
        return (
          <label key={v.id} className="ikas-option-set__check">
            <input
              type="checkbox"
              className="ikas-option-set__check-input"
              checked={checked}
              aria-invalid={invalid || undefined}
              onChange={() => toggleChoice(option, v)}
            />
            <span className="ikas-option-set__check-box" aria-hidden="true">
              <CheckMark />
            </span>
            <span className="ikas-option-set__check-text _C0OZ8W7vYS">{v.value}</span>
            {price && <span className="ikas-option-set__extra _eZyocyyd0F">{price}</span>}
          </label>
        );
      })}
    </div>
  );
});

const BoxControl = observer(function BoxControl({ option }: ControlProps) {
  return (
    <div className="ikas-option-set__boxes">
      {sortedValues(option).map((v) => {
        const selected = isProductOptionSelectValueSelected(option, v);
        const price = formatExtraPrice(option, v.price);
        return (
          <button
            key={v.id}
            type="button"
            className={`ikas-option-set__box${selected ? " ikas-option-set__box--selected" : ""}`}
            aria-pressed={selected}
            onClick={() => toggleChoice(option, v)}
          >
            <span className="ikas-option-set__box-fill" aria-hidden="true" />
            <span className="ikas-option-set__box-label">{v.value}</span>
            {price && <span className="ikas-option-set__box-price">{price}</span>}
          </button>
        );
      })}
    </div>
  );
});

const SwatchControl = observer(function SwatchControl(props: ControlProps) {
  const { option } = props;
  const values = sortedValues(option);
  // Ne renk ne görsel tanımlıysa kutu görünümüne düş.
  if (!values.some((v) => v.colorCode || v.thumbnailImage)) return <BoxControl {...props} />;

  return (
    <div className="ikas-option-set__swatches">
      {values.map((v) => {
        const selected = isProductOptionSelectValueSelected(option, v);
        const price = formatExtraPrice(option, v.price);
        const thumb = v.thumbnailImage ? getSrc(v.thumbnailImage, 180) : null;
        return (
          <div key={v.id} className="ikas-option-set__swatch-item">
            <button
              type="button"
              className={`ikas-option-set__swatch${thumb ? " ikas-option-set__swatch--image" : ""}${
                selected ? " ikas-option-set__swatch--selected" : ""
              }`}
              style={!thumb && v.colorCode ? { backgroundColor: v.colorCode } : undefined}
              title={v.value}
              aria-label={price ? `${v.value} (${price})` : v.value}
              aria-pressed={selected}
              onClick={() => toggleChoice(option, v)}
            >
              {thumb && <img src={thumb} alt="" loading="lazy" className="ikas-option-set__swatch-img" />}
              <span className="ikas-option-set__swatch-ring" aria-hidden="true" />
            </button>
            {price && (
              <span className="ikas-option-set__extra _eZyocyyd0F" aria-hidden="true">
                {price}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});

const ColorControl = observer(function ColorControl({
  option,
  controlId,
  describedBy,
  invalid,
}: ControlProps) {
  const current = option.values?.[0] || "";
  return (
    <div className={`ikas-option-set__color${invalid ? " ikas-option-set__color--invalid" : ""}`}>
      <input
        id={controlId}
        type="color"
        className="ikas-option-set__color-input"
        value={current || "#ffffff"}
        aria-required={!option.isOptional}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onInput={(e: Event) => setValues(option, [(e.currentTarget as HTMLInputElement).value])}
      />
      {current && (
        <span className="ikas-option-set__color-code _eZyocyyd0F">{current.toUpperCase()}</span>
      )}
    </div>
  );
});

const DateControl = observer(function DateControl({
  option,
  controlId,
  describedBy,
  invalid,
}: ControlProps) {
  const stored = option.values?.[0] || "";
  const storedDate = stored ? new Date(stored) : null;
  const current = storedDate && !isNaN(storedDate.getTime()) ? toInputDate(storedDate) : "";
  const { min, max } = dateBounds(option);

  const apply = (raw: string) => {
    if (!raw) {
      setValues(option, []);
      return;
    }
    const date = new Date(raw);
    if (isNaN(date.getTime()) || date.getFullYear() < 1900) return;
    date.setHours(23, 59, 0, 0);
    setValues(option, [date.toString()]);
  };

  return (
    <input
      id={controlId}
      type="date"
      className={inputClass("ikas-option-set__input ikas-option-set__date", invalid)}
      value={current}
      min={min}
      max={max}
      aria-required={!option.isOptional}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      onChange={(e: Event) => apply((e.currentTarget as HTMLInputElement).value)}
      onBlur={(e: Event) => apply((e.currentTarget as HTMLInputElement).value)}
    />
  );
});

const FileControl = observer(function FileControl({
  option,
  texts,
  controlId,
  describedBy,
  invalid,
}: ControlProps) {
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const reset = () => setFileError(null);
    window.addEventListener(RESET_OPTION_STATE_EVENT, reset);
    return () => window.removeEventListener(RESET_OPTION_STATE_EVENT, reset);
  }, []);

  const s = option.fileSettings;
  const uploaded = option.values || [];
  const maxQty = s?.maxQuantity ?? null;
  const full = maxQty != null && uploaded.length >= maxQty;
  const allowed = (s?.allowedExtensions || []).map((e) => e.toLowerCase().replace(/^\./, ""));
  const accept = allowed.length ? allowed.map((e) => `.${e}`).join(",") : undefined;

  const check = (files: File[]): string | null => {
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return fillTemplate(texts.fileSizeErrorText, {
          fileName: file.name,
          maxSize: String(MAX_FILE_SIZE_MB),
        });
      }
      if (allowed.length) {
        const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
        if (!allowed.includes(ext)) {
          return fillTemplate(texts.fileTypeErrorText, {
            fileName: file.name,
            ext: ext ? `.${ext}` : file.name,
          });
        }
      }
    }
    if (maxQty != null && uploaded.length + files.length > maxQty) {
      return fillTemplate(texts.maxFilesErrorText, { max: String(maxQty) });
    }
    return null;
  };

  const upload = async (list: FileList | null | undefined) => {
    if (!list?.length || uploading) return;
    const files = Array.from(list);
    const error = check(files);
    if (error) {
      setFileError(error);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setFileError(null);
    setUploading(true);
    try {
      // SDK yüklenen dosya URL'lerini döndürür; seçenek değerine biz ekleriz.
      const urls = await productOptionFileUpload(option, files);
      if (urls.length) setValues(option, [...(option.values || []), ...urls]);
      if (urls.length < files.length) setFileError(texts.uploadFailedText);
    } catch (err) {
      console.error("Kişiselleştirme dosyası yüklenemedi:", err);
      setFileError(texts.uploadFailedText);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (index: number) => {
    const next = [...uploaded];
    next.splice(index, 1);
    setValues(option, next);
    setFileError(null);
  };

  const disabled = uploading || full;
  const fileErrorId = `${controlId}-file-error`;
  const ariaDescribedBy = joinParts([describedBy, fileError && fileErrorId], " ") || undefined;

  return (
    <div className="ikas-option-set__file">
      {!full && (
        <label
          className={`ikas-option-set__drop${dragOver ? " ikas-option-set__drop--over" : ""}${
            invalid || fileError ? " ikas-option-set__drop--invalid" : ""
          }${uploading ? " ikas-option-set__drop--busy" : ""}`}
          onDragOver={(e: DragEvent) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e: DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            if (!disabled) upload(e.dataTransfer?.files);
          }}
        >
          <input
            ref={inputRef}
            id={controlId}
            type="file"
            className="ikas-option-set__file-input"
            accept={accept}
            multiple={maxQty !== 1}
            disabled={disabled}
            aria-required={!option.isOptional}
            aria-invalid={invalid || !!fileError || undefined}
            aria-describedby={ariaDescribedBy}
            onChange={(e: Event) => upload((e.currentTarget as HTMLInputElement).files)}
          />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M12 16V4" />
            <path d="m7 9 5-5 5 5" />
            <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
          </svg>
          <span className="ikas-option-set__drop-text _C0OZ8W7vYS">
            {uploading ? texts.uploadingText : texts.fileDropText}
          </span>
        </label>
      )}

      <p id={fileErrorId} className="ikas-option-set__error" role="status" aria-live="polite">
        {fileError || ""}
      </p>

      {uploaded.length > 0 && (
        <ul className="ikas-option-set__files">
          {uploaded.map((url, i) => {
            const name = fileNameFromUrl(url, i);
            return (
              <li key={url} className="ikas-option-set__file-row">
                <span className="ikas-option-set__file-name _eZyocyyd0F">{name}</span>
                <button
                  type="button"
                  className="ikas-option-set__file-remove ikas-tap-44"
                  aria-label={`${texts.removeFileLabel}: ${name}`}
                  onClick={() => remove(i)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

function CheckMark() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <path d="M5 12.5l4.2 4.2L19 7.5" />
    </svg>
  );
}

/* ─── seçenek alanı (özyinelemeli) ────────────────────────────────────── */

interface FieldProps {
  option: IkasProductOption;
  texts: Texts;
  showError: boolean;
}

type Layout = "single" | "group" | "checkbox";

function resolveControl(option: IkasProductOption): { layout: Layout; Control: any } | null {
  if (isTextOption(option) || isTextAreaOption(option)) return { layout: "single", Control: TextControl };
  if (isCheckboxOption(option)) return { layout: "checkbox", Control: null };
  if (isChoiceOption(option)) {
    if (!option.selectSettings) return null;
    if (isChoiceOptionSelectType(option)) {
      return (option.selectSettings.maxSelect ?? 1) > 1
        ? { layout: "group", Control: ChecklistControl }
        : { layout: "single", Control: SelectControl };
    }
    if (isChoiceOptionSwatchType(option)) return { layout: "group", Control: SwatchControl };
    return { layout: "group", Control: BoxControl };
  }
  if (isColorPickerOption(option)) return { layout: "single", Control: ColorControl };
  if (isDatePickerOption(option)) return { layout: "single", Control: DateControl };
  if (isFileOption(option)) return { layout: "group", Control: FileControl };
  return null;
}

const OptionField = observer(function OptionField({ option, texts, showError }: FieldProps) {
  const resolved = resolveControl(option);
  if (!resolved) return null;

  const fieldId = optionFieldId(option);
  const controlId = `${fieldId}-control`;
  const labelId = `${fieldId}-label`;
  const descId = `${fieldId}-desc`;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;

  const invalid = showError && isOwnOptionInvalid(option);
  const hint = constraintHint(option, texts);
  const isEmpty = !(option.values && option.values.length);
  const errorText = invalid ? (isEmpty || !hint ? texts.requiredErrorText : hint) : "";
  const showHint = !!hint && errorText !== hint;
  const description = option.optionalText || "";
  const price = formatExtraPrice(option, option.price);

  const describedBy =
    joinParts([description && descId, showHint && hintId, errorText && errorId], " ") || undefined;

  const marker = option.isOptional ? (
    texts.optionalText ? (
      <span className="ikas-option-set__optional _eZyocyyd0F">{texts.optionalText}</span>
    ) : null
  ) : (
    <span className="ikas-option-set__required" aria-hidden="true">*</span>
  );

  const nameRow = (
    <>
      <span className="ikas-option-set__name">{option.name}</span>
      {marker}
      {price && <span className="ikas-option-set__price _eZyocyyd0F">{price}</span>}
    </>
  );

  const selectedSummary =
    resolved.Control === SwatchControl
      ? sortedValues(option)
          .filter((v) => isProductOptionSelectValueSelected(option, v))
          .map((v) => v.value.toLocaleUpperCase("tr-TR"))
          .join(", ")
      : "";

  const meta = (
    <>
      {description && (
        <p id={descId} className="ikas-option-set__desc _C0OZ8W7vYS">
          {description}
        </p>
      )}
      {showHint && (
        <p id={hintId} className="ikas-option-set__hint _eZyocyyd0F">
          {hint}
        </p>
      )}
      {errorText && (
        <p id={errorId} className="ikas-option-set__error">
          {errorText}
        </p>
      )}
    </>
  );

  const children = getDisplayedChildOptions(option);
  const childList = children.length > 0 && (
    <div className="ikas-option-set__children">
      {children.map((child) => (
        <OptionField key={child.id} option={child} texts={texts} showError={showError} />
      ))}
    </div>
  );

  const fieldClass = `ikas-option-set__field${invalid ? " ikas-option-set__field--invalid" : ""}`;
  const controlProps: ControlProps = { option, texts, controlId, describedBy, invalid };

  if (resolved.layout === "checkbox") {
    return (
      <div id={fieldId} className={fieldClass}>
        <label className="ikas-option-set__check ikas-option-set__check--single" htmlFor={controlId}>
          <input
            id={controlId}
            type="checkbox"
            className="ikas-option-set__check-input"
            checked={isChecked(option)}
            aria-required={!option.isOptional}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={(e: Event) => {
              setCheckboxValue(option, (e.currentTarget as HTMLInputElement).checked);
              pruneHiddenChildOptions(option);
            }}
          />
          <span className="ikas-option-set__check-box" aria-hidden="true">
            <CheckMark />
          </span>
          <span className="ikas-option-set__check-text _C0OZ8W7vYS">{nameRow}</span>
        </label>
        {meta}
        {childList}
      </div>
    );
  }

  const Control = resolved.Control;

  if (resolved.layout === "group") {
    return (
      <fieldset
        id={fieldId}
        className={`${fieldClass} ikas-option-set__fieldset`}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
      >
        <legend id={labelId} className="ikas-option-set__head">
          {nameRow}
          {selectedSummary && (
            <span className="ikas-option-set__selected" aria-live="polite">
              {selectedSummary}
            </span>
          )}
        </legend>
        <Control {...controlProps} />
        {meta}
        {childList}
      </fieldset>
    );
  }

  return (
    <div id={fieldId} className={fieldClass}>
      <label id={labelId} htmlFor={controlId} className="ikas-option-set__head">
        {nameRow}
      </label>
      <Control {...controlProps} />
      {meta}
      {childList}
    </div>
  );
});

/* ─── kök ─────────────────────────────────────────────────────────────── */

export function ProductOptionSet({
  product,
  requiredErrorText = "Bu alan zorunludur",
  selectPlaceholder = "Seçiniz",
  fileDropText = "Dosya seç veya buraya sürükle",
  uploadingText = "Yükleniyor...",
  uploadFailedText = "Dosya yüklenemedi",
  fileSizeErrorText = "{fileName}: en fazla {maxSize}MB",
  fileTypeErrorText = "{fileName}: {ext} dosya türüne izin verilmiyor",
  maxFilesErrorText = "En fazla {max} dosya yüklenebilir",
  minLabelText = "En az: ",
  maxLabelText = "En fazla: ",
  removeFileLabel = "Dosyayı kaldır",
  optionalText = "Opsiyonel",
  className = "",
}: Props) {
  // Yükleme bitince yeniden çizim tetikleyici (model gözlemlenmese bile)
  const [, setLoadTick] = useState(0);
  const [showError, setShowError] = useState(false);
  const productId = product?.id;

  // Seçenek seti asenkron yüklenir; yüklenene kadar hiçbir şey çizilmez.
  useEffect(() => {
    setShowError(false);
    if (!product || !product.productOptionSetId || product.productOptionSet) return;
    let active = true;
    getProductOptionSet(product)
      .then(() => {
        if (active) setLoadTick((n) => n + 1);
      })
      .catch((err) => console.error("Kişiselleştirme seçenekleri yüklenemedi:", err));
    return () => {
      active = false;
    };
  }, [productId]);

  useEffect(() => {
    const show = () => setShowError(true);
    const reset = () => setShowError(false);
    window.addEventListener(SHOW_OPTION_ERRORS_EVENT, show);
    window.addEventListener(RESET_OPTION_STATE_EVENT, reset);
    return () => {
      window.removeEventListener(SHOW_OPTION_ERRORS_EVENT, show);
      window.removeEventListener(RESET_OPTION_STATE_EVENT, reset);
    };
  }, []);

  const optionSet = product?.productOptionSet;
  if (!optionSet) return null;
  const options = getDisplayedOptions(optionSet);
  if (!options.length) return null;

  const texts: Texts = {
    requiredErrorText,
    selectPlaceholder,
    fileDropText,
    uploadingText,
    uploadFailedText,
    fileSizeErrorText,
    fileTypeErrorText,
    maxFilesErrorText,
    minLabelText,
    maxLabelText,
    removeFileLabel,
    optionalText,
  };

  return (
    <div className={`ikas-option-set ${className}`.trim()}>
      {options.map((option) => (
        <OptionField key={option.id} option={option} texts={texts} showError={showError} />
      ))}
    </div>
  );
}

export default observer(ProductOptionSet);
