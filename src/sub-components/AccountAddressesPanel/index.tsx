import { useEffect, useId, useRef, useState } from "preact/hooks";
import {
  customerStore,
  IkasCustomerAddress,
  deleteCustomerAddress,
  getCustomerAddressText,
  getEmptyAddressForm,
  getIkasCustomerAddressForm,
  initAddressForm,
  submitAddressForm,
  setAddressFormTitle,
  setAddressFormFirstName,
  setAddressFormLastName,
  setAddressFormPhone,
  setAddressFormAddressLine1,
  setAddressFormAddressLine2,
  setAddressFormCity,
  setAddressFormPostalCode,
  setAddressFormCountry,
  setAddressFormState,
  setAddressFormDistrict,
  setAddressFormRegion,
  IkasFormItemOption,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../Button";
import { useFocusTrap, useBodyScrollLock } from "../../utils/a11y";

type FieldState = { hasError?: boolean; message?: string; value?: string } | undefined;

/** SDK doğrulama mesajı — alanın altında gösterilir. */
function FieldError({ field }: { field: FieldState }) {
  if (!field?.hasError || !field.message) return null;
  return <span className="ikas-account__error">{field.message}</span>;
}

const inputClass = (field: FieldState) =>
  `ikas-account__input${field?.hasError ? " ikas-account__input--error" : ""}`;

/** Seçenek listesi varsa select, yoksa serbest metin girişi. */
function LocationField({
  label,
  field,
  options,
  freeText,
  onValue,
}: {
  label: string;
  field: FieldState;
  options?: IkasFormItemOption[];
  freeText?: boolean;
  onValue: (value: string) => void;
}) {
  const useSelect = (options?.length || 0) > 0 && !freeText;
  return (
    <label className="ikas-account__field">
      <span className="ikas-account__label">{label}</span>
      {useSelect ? (
        <select
          className={inputClass(field)}
          value={field?.value ?? ""}
          aria-invalid={field?.hasError ? "true" : undefined}
          onChange={(e) => onValue((e.target as HTMLSelectElement).value)}
        >
          <option value="" />
          {options!.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={inputClass(field)}
          value={field?.value ?? ""}
          aria-invalid={field?.hasError ? "true" : undefined}
          onInput={(e) => onValue((e.target as HTMLInputElement).value)}
        />
      )}
      <FieldError field={field} />
    </label>
  );
}

/** Modal kabuğu: ESC, Tab döngüsü, scroll kilidi, başlıkla etiketleme. */
function ModalShell({
  title,
  backdropLabel,
  onClose,
  small,
  children,
}: {
  title: string;
  backdropLabel: string;
  onClose: () => void;
  small?: boolean;
  children: any;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleId = `ikas-addr-modal-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  useFocusTrap({ active: true, containerRef: sheetRef, onEscape: onClose, skipBackgroundInert: true });
  useBodyScrollLock(true);
  return (
    <div className="ikas-addr-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="ikas-addr-modal__backdrop"
        aria-label={backdropLabel}
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className={`ikas-addr-modal__sheet${small ? " ikas-addr-modal__sheet--sm" : ""}`}
      >
        <h2 id={titleId} className="ikas-addr-modal__title">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export interface Props {
  title?: string;
  emptyText?: string;
  addAddressText?: string;
  editAddressText?: string;
  deleteAddressText?: string;
  cancelText?: string;
  saveButtonText?: string;
  savingButtonText?: string;
  modalTitleAdd?: string;
  modalTitleEdit?: string;
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: string;
  addressTitleLabel?: string;
  firstNameLabel?: string;
  lastNameLabel?: string;
  phoneLabel?: string;
  addressLineLabel?: string;
  cityLabel?: string;
  postalCodeLabel?: string;
  countryLabel?: string;
  stateLabel?: string;
  districtLabel?: string;
  regionLabel?: string;
}

const AddressFormModal = observer(function AddressFormModal({
  address,
  modalTitle,
  saveButtonText,
  savingButtonText,
  cancelText,
  addressTitleLabel,
  firstNameLabel,
  lastNameLabel,
  phoneLabel,
  addressLineLabel,
  cityLabel,
  postalCodeLabel,
  countryLabel,
  stateLabel,
  districtLabel,
  regionLabel,
  onClose,
}: {
  address?: IkasCustomerAddress;
  modalTitle: string;
  saveButtonText: string;
  savingButtonText: string;
  cancelText: string;
  addressTitleLabel: string;
  firstNameLabel: string;
  lastNameLabel: string;
  phoneLabel: string;
  addressLineLabel: string;
  cityLabel: string;
  postalCodeLabel: string;
  countryLabel: string;
  stateLabel: string;
  districtLabel: string;
  regionLabel: string;
  onClose: () => void;
}) {
  const [ready, setReady] = useState(false);
  const [form] = useState(() =>
    address
      ? getIkasCustomerAddressForm(address)
      : getEmptyAddressForm(customerStore)
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await initAddressForm(form, address);
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (e: Event) => {
    e.preventDefault();
    if (form.isSubmitting) return;
    try {
      const ok = await submitAddressForm(form);
      if (ok) onClose();
    } catch (err) {
      console.error("Adres kaydetme hatası:", err);
    }
  };

  return (
    <ModalShell title={modalTitle} backdropLabel={cancelText} onClose={onClose}>
        {!ready ? (
          <div className="ikas-account__loading" aria-busy="true" />
        ) : (
          <form className="ikas-addr-modal__form" onSubmit={handleSave} noValidate>
            {form.isFailure && form.responseMessage && (
              <div className="ikas-account__banner ikas-account__banner--err">
                {form.responseMessage}
              </div>
            )}

            <label className="ikas-account__field">
              <span className="ikas-account__label">{addressTitleLabel}</span>
              <input
                className={inputClass(form.title)}
                value={form.title?.value ?? ""}
                onInput={(e) =>
                  setAddressFormTitle(form, (e.target as HTMLInputElement).value)
                }
              />
              <FieldError field={form.title} />
            </label>

            <div className="ikas-account__row">
              <label className="ikas-account__field">
                <span className="ikas-account__label">{firstNameLabel}</span>
                <input
                  className={inputClass(form.firstName)}
                  value={form.firstName?.value ?? ""}
                  onInput={(e) =>
                    setAddressFormFirstName(
                      form,
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
                <FieldError field={form.firstName} />
              </label>
              <label className="ikas-account__field">
                <span className="ikas-account__label">{lastNameLabel}</span>
                <input
                  className={inputClass(form.lastName)}
                  value={form.lastName?.value ?? ""}
                  onInput={(e) =>
                    setAddressFormLastName(
                      form,
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
                <FieldError field={form.lastName} />
              </label>
            </div>

            <label className="ikas-account__field">
              <span className="ikas-account__label">{phoneLabel}</span>
              <input
                className={inputClass(form.phone)}
                type="tel"
                value={form.phone?.value ?? ""}
                onInput={(e) =>
                  setAddressFormPhone(form, (e.target as HTMLInputElement).value)
                }
              />
              <FieldError field={form.phone} />
            </label>

            <label className="ikas-account__field">
              <span className="ikas-account__label">{addressLineLabel}</span>
              <input
                className={inputClass(form.addressLine1)}
                value={form.addressLine1?.value ?? ""}
                onInput={(e) =>
                  setAddressFormAddressLine1(
                    form,
                    (e.target as HTMLInputElement).value
                  )
                }
              />
              <FieldError field={form.addressLine1} />
            </label>

            <input
              className="ikas-account__input"
              value={form.addressLine2?.value ?? ""}
              onInput={(e) =>
                setAddressFormAddressLine2(
                  form,
                  (e.target as HTMLInputElement).value
                )
              }
              aria-label={addressLineLabel}
            />

            {(form.countryOptions?.length || 0) > 0 && (
              <LocationField
                label={countryLabel}
                field={form.country}
                options={form.countryOptions}
                onValue={(v) => setAddressFormCountry(form, v)}
              />
            )}

            {(form.stateOptions?.length || 0) > 0 && (
              <LocationField
                label={stateLabel}
                field={form.state}
                options={form.stateOptions}
                onValue={(v) => setAddressFormState(form, v)}
              />
            )}

            <div className="ikas-account__row">
              <LocationField
                label={cityLabel}
                field={form.city}
                options={form.cityOptions}
                freeText={form.city?.isFreeText}
                onValue={(v) => setAddressFormCity(form, v)}
              />
              {/* İlçe: seçenek geldiyse ya da zorunlu/serbest metinse göster. */}
              {((form.districtOptions?.length || 0) > 0 ||
                form.district?.isFreeText ||
                form.district?.isRequired) && (
                <LocationField
                  label={districtLabel}
                  field={form.district}
                  options={form.districtOptions}
                  freeText={form.district?.isFreeText}
                  onValue={(v) => setAddressFormDistrict(form, v)}
                />
              )}
            </div>

            {(form.regionOptions?.length || 0) > 0 && (
              <LocationField
                label={regionLabel}
                field={form.region}
                options={form.regionOptions}
                onValue={(v) => setAddressFormRegion(form, v)}
              />
            )}

            <div className="ikas-account__row">
              <label className="ikas-account__field">
                <span className="ikas-account__label">{postalCodeLabel}</span>
                <input
                  className={inputClass(form.postalCode)}
                  value={form.postalCode?.value ?? ""}
                  onInput={(e) =>
                    setAddressFormPostalCode(
                      form,
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
                <FieldError field={form.postalCode} />
              </label>
            </div>

            <div className="ikas-addr-modal__actions">
              <Button
                text={cancelText}
                variant="PILL_SECONDARY"
                size="NORMAL"
                onClick={onClose}
              />
              <Button
                text={form.isSubmitting ? savingButtonText : saveButtonText}
                variant="PILL_PRIMARY"
                size="NORMAL"
                disabled={form.isSubmitting}
                loading={form.isSubmitting}
                onClick={(e) => void handleSave(e)}
              />
            </div>
          </form>
        )}
    </ModalShell>
  );
});

export function AccountAddressesPanel({
  title = "Adreslerim",
  emptyText = "Kayıtlı adresin yok.",
  addAddressText = "ADRES EKLE",
  editAddressText = "DÜZENLE",
  deleteAddressText = "SİL",
  cancelText = "İPTAL",
  saveButtonText = "KAYDET",
  savingButtonText = "KAYDEDİLİYOR...",
  modalTitleAdd = "Yeni adres",
  modalTitleEdit = "Adresi düzenle",
  deleteConfirmTitle = "Adresi sil",
  deleteConfirmMessage = "Bu adresi silmek istediğine emin misin?",
  addressTitleLabel = "BAŞLIK",
  firstNameLabel = "AD",
  lastNameLabel = "SOYAD",
  phoneLabel = "TELEFON",
  addressLineLabel = "ADRES",
  cityLabel = "ŞEHİR",
  postalCodeLabel = "POSTA KODU",
  countryLabel = "ÜLKE",
  stateLabel = "EYALET",
  districtLabel = "İLÇE",
  regionLabel = "MAHALLE",
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IkasCustomerAddress | undefined>();
  const [deleting, setDeleting] = useState<IkasCustomerAddress | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const addresses = customerStore.customer?.addresses ?? [];

  const openAdd = () => {
    setEditing(undefined);
    setModalOpen(true);
  };
  const openEdit = (addr: IkasCustomerAddress) => {
    setEditing(addr);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    // Çift tıklama aynı adresi iki kez silmeye çalışmasın.
    if (!deleting || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteCustomerAddress(customerStore, deleting);
      setDeleting(undefined);
    } catch (err) {
      console.error("Adres silme hatası:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="ikas-account__panel">
      <div className="ikas-account__panel-head">
        <h1 className="ikas-account__title _sKAMD8d1LA">{title}</h1>
        {addresses.length > 0 && (
          <Button
            text={addAddressText}
            variant="PILL_ACCENT"
            size="NORMAL"
            onClick={openAdd}
          />
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="ikas-account__empty-block">
          <p className="ikas-account__empty">{emptyText}</p>
          <Button
            text={addAddressText}
            variant="PILL_ACCENT"
            size="NORMAL"
            onClick={openAdd}
          />
        </div>
      ) : (
        <ul className="ikas-account-addrs">
          {addresses.map((addr) => (
            <li key={addr.id} className="ikas-account-addrs__card">
              {addr.title && (
                <span className="ikas-account-addrs__title">{addr.title}</span>
              )}
              <p className="ikas-account-addrs__text">
                {getCustomerAddressText(addr)}
              </p>
              <div className="ikas-account-addrs__actions">
                <Button
                  text={editAddressText}
                  variant="PILL_SECONDARY"
                  size="NORMAL"
                  onClick={() => openEdit(addr)}
                />
                <Button
                  text={deleteAddressText}
                  variant="PILL_SECONDARY"
                  size="NORMAL"
                  onClick={() => setDeleting(addr)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <AddressFormModal
          key={editing?.id || "new"}
          address={editing}
          modalTitle={editing ? modalTitleEdit : modalTitleAdd}
          saveButtonText={saveButtonText}
          savingButtonText={savingButtonText}
          cancelText={cancelText}
          addressTitleLabel={addressTitleLabel}
          firstNameLabel={firstNameLabel}
          lastNameLabel={lastNameLabel}
          phoneLabel={phoneLabel}
          addressLineLabel={addressLineLabel}
          cityLabel={cityLabel}
          postalCodeLabel={postalCodeLabel}
          countryLabel={countryLabel}
          stateLabel={stateLabel}
          districtLabel={districtLabel}
          regionLabel={regionLabel}
          onClose={() => {
            setModalOpen(false);
            setEditing(undefined);
          }}
        />
      )}

      {deleting && (
        <ModalShell
          small
          title={deleteConfirmTitle}
          backdropLabel={cancelText}
          onClose={() => {
            if (!isDeleting) setDeleting(undefined);
          }}
        >
            <p className="ikas-account__empty">{deleteConfirmMessage}</p>
            <div className="ikas-addr-modal__actions">
              <Button
                text={cancelText}
                variant="PILL_SECONDARY"
                size="NORMAL"
                onClick={() => setDeleting(undefined)}
              />
              <Button
                text={deleteAddressText}
                variant="PILL_PRIMARY"
                size="NORMAL"
                disabled={isDeleting}
                loading={isDeleting}
                onClick={() => void confirmDelete()}
              />
            </div>
        </ModalShell>
      )}
    </div>
  );
}

export default observer(AccountAddressesPanel);
