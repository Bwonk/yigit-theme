import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  waitForCustomerStoreInit,
  hasCustomer,
  logout,
  Router,
  getThemeSetting,
  getAccountInfoForm,
  initAccountInfoForm,
  setAccountInfoFormFirstName,
  setAccountInfoFormLastName,
  setAccountInfoFormPhone,
  submitAccountInfoForm,
  getCustomerBasicInfo,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../../sub-components/Button";
import AccountOrdersPanel from "../../sub-components/AccountOrdersPanel";
import AccountAddressesPanel from "../../sub-components/AccountAddressesPanel";
import AccountFavoritesPanel from "../../sub-components/AccountFavoritesPanel";
import { Props } from "./types";

export interface AccountDashboardProps extends Props {
  className?: string;
}

type Tab = "account" | "orders" | "addresses" | "favorites";

function resolveTab(): Tab {
  const path =
    (typeof Router.getCurrentPath === "function" && Router.getCurrentPath()) ||
    (typeof window !== "undefined" ? window.location.pathname : "") ||
    "";
  if (/\/account\/orders/i.test(path)) return "orders";
  if (/\/account\/addresses/i.test(path)) return "addresses";
  if (/\/account\/favorite-products/i.test(path)) return "favorites";
  return "account";
}

const ProfilePanel = observer(function ProfilePanel({
  accountForm,
  profileTitle,
  firstNameLabel,
  lastNameLabel,
  emailLabel,
  phoneLabel,
  saveButtonText,
  savingButtonText,
  successMessage,
}: {
  accountForm: ReturnType<typeof getAccountInfoForm>;
  profileTitle: string;
  firstNameLabel: string;
  lastNameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  saveButtonText: string;
  savingButtonText: string;
  successMessage: string;
}) {
  return (
    <div className="ikas-account__panel">
      <h1 className="ikas-account__title _sKAMD8d1LA">{profileTitle}</h1>

      {accountForm.isSuccess && (
        <div className="ikas-account__banner ikas-account__banner--ok" role="status">
          {successMessage}
        </div>
      )}
      {accountForm.isFailure && accountForm.responseMessage && (
        <div className="ikas-account__banner ikas-account__banner--err" role="alert">
          {accountForm.responseMessage}
        </div>
      )}

      <form
        className="ikas-account__form"
        onSubmit={(e) => {
          e.preventDefault();
          if (accountForm.isSubmitting) return;
          submitAccountInfoForm(accountForm).catch((err) =>
            console.error("Hesap bilgisi kaydetme hatası:", err)
          );
        }}
        noValidate
      >
        <div className="ikas-account__row">
          <label className="ikas-account__field">
            <span className="ikas-account__label">{firstNameLabel}</span>
            <input
              className={`ikas-account__input${
                accountForm.firstName?.hasError ? " ikas-account__input--error" : ""
              }`}
              value={accountForm.firstName?.value ?? ""}
              onInput={(e) =>
                setAccountInfoFormFirstName(
                  accountForm,
                  (e.target as HTMLInputElement).value
                )
              }
              autoComplete="given-name"
            />
            {accountForm.firstName?.hasError && (
              <span className="ikas-account__error">
                {accountForm.firstName.message}
              </span>
            )}
          </label>

          <label className="ikas-account__field">
            <span className="ikas-account__label">{lastNameLabel}</span>
            <input
              className={`ikas-account__input${
                accountForm.lastName?.hasError ? " ikas-account__input--error" : ""
              }`}
              value={accountForm.lastName?.value ?? ""}
              onInput={(e) =>
                setAccountInfoFormLastName(
                  accountForm,
                  (e.target as HTMLInputElement).value
                )
              }
              autoComplete="family-name"
            />
            {accountForm.lastName?.hasError && (
              <span className="ikas-account__error">
                {accountForm.lastName.message}
              </span>
            )}
          </label>
        </div>

        <div className="ikas-account__row">
          <label className="ikas-account__field">
            <span className="ikas-account__label">{emailLabel}</span>
            <input
              className="ikas-account__input"
              value={customerStore.customer?.email ?? ""}
              disabled
              type="email"
            />
          </label>

          <label className="ikas-account__field">
            <span className="ikas-account__label">{phoneLabel}</span>
            <input
              className={`ikas-account__input${
                accountForm.phone?.hasError ? " ikas-account__input--error" : ""
              }`}
              type="tel"
              value={accountForm.phone?.value ?? ""}
              onInput={(e) =>
                setAccountInfoFormPhone(
                  accountForm,
                  (e.target as HTMLInputElement).value
                )
              }
              autoComplete="tel"
            />
            {accountForm.phone?.hasError && (
              <span className="ikas-account__error">{accountForm.phone.message}</span>
            )}
          </label>
        </div>

        <div className="ikas-account__actions">
          <Button
            text={accountForm.isSubmitting ? savingButtonText : saveButtonText}
            variant="PILL_PRIMARY"
            size="NORMAL"
            disabled={accountForm.isSubmitting}
            loading={accountForm.isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              void submitAccountInfoForm(accountForm);
            }}
          />
        </div>
      </form>
    </div>
  );
});

export function AccountDashboard({
  backgroundColor = "#ffffff",
  accountInfoLabel = "HESABIM",
  ordersLabel = "SİPARİŞLERİM",
  addressesLabel = "ADRESLERİM",
  favoritesLabel = "FAVORİLERİM",
  logoutLabel = "ÇIKIŞ YAP",
  profileTitle = "Hesap bilgileri",
  firstNameLabel = "AD",
  lastNameLabel = "SOYAD",
  emailLabel = "E-POSTA",
  phoneLabel = "TELEFON",
  saveButtonText = "KAYDET",
  savingButtonText = "KAYDEDİLİYOR...",
  successMessage = "Bilgilerin güncellendi.",
  ordersTitle = "Siparişlerim",
  ordersEmptyText = "Henüz siparişin yok.",
  addressesTitle = "Adreslerim",
  addressesEmptyText = "Kayıtlı adresin yok.",
  favoritesTitle = "Favorilerim",
  favoritesEmptyText = "Favori ürünün yok.",
  shopButtonText = "ALIŞVERİŞE BAŞLA",
  welcomePrefix = "Merhaba",
  detailButtonText = "DETAY",
  orderNoText = "Sipariş No",
  itemsText = "ürün",
  ordersErrorText = "Siparişler yüklenemedi.",
  retryButtonText = "TEKRAR DENE",
  addAddressText = "ADRES EKLE",
  editAddressText = "DÜZENLE",
  deleteAddressText = "SİL",
  cancelText = "İPTAL",
  modalTitleAdd = "Yeni adres",
  modalTitleEdit = "Adresi düzenle",
  deleteConfirmTitle = "Adresi sil",
  deleteConfirmMessage = "Bu adresi silmek istediğine emin misin?",
  addToCartText = "SEPETE EKLE",
  discountBadgeText,
  quickAddAriaLabel,
  removeFavoriteText = "FAVORİDEN ÇIKAR",
  addressTitleLabel = "BAŞLIK",
  addressLineLabel = "ADRES",
  cityLabel = "ŞEHİR",
  postalCodeLabel = "POSTA KODU",
  countryLabel = "ÜLKE",
  stateLabel,
  districtLabel,
  regionLabel,
  className = "",
}: AccountDashboardProps) {
  const [ready, setReady] = useState(false);
  const tab = resolveTab();
  const accountForm = getAccountInfoForm(customerStore);

  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx");
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx");
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ");
  const inputRadiusSetting = getThemeSetting("_iI8H4rllzj");

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    "--section-px": sectionPxSetting?.value || "20px",
    "--mobile-px": mobilePxSetting?.value || "16px",
    "--max-site-width": siteWidthSetting?.value || "1560px",
    "--input-radius": inputRadiusSetting?.value || "14px",
  } as any;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await waitForCustomerStoreInit(customerStore);
      if (cancelled) return;
      if (!hasCustomer(customerStore)) {
        Router.navigateToPage("LOGIN");
        return;
      }
      await initAccountInfoForm(accountForm);
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const customer = customerStore.customer;
  const basic = customer ? getCustomerBasicInfo(customer) : null;
  const displayName = [basic?.firstName, basic?.lastName].filter(Boolean).join(" ");

  const navItems: { id: Tab; label: string; go: () => void }[] = [
    {
      id: "account",
      label: accountInfoLabel || "",
      go: () => Router.navigateToPage("ACCOUNT"),
    },
    {
      id: "orders",
      label: ordersLabel || "",
      go: () => Router.navigateToPage("ORDERS"),
    },
    {
      id: "addresses",
      label: addressesLabel || "",
      go: () => Router.navigateToPage("ADDRESSES"),
    },
    {
      id: "favorites",
      label: favoritesLabel || "",
      go: () => Router.navigateToPage("FAVORITE_PRODUCTS"),
    },
  ];

  const handleLogout = async () => {
    await logout(customerStore);
    Router.navigateToPage("INDEX");
  };

  return (
    <section
      className={`ikas-account ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-account__container">
        <aside className="ikas-account__sidebar">
          <div className="ikas-account__welcome">
            <span className="ikas-account__welcome-kicker">{welcomePrefix}</span>
            {displayName && (
              <span className="ikas-account__welcome-name">{displayName}</span>
            )}
          </div>

          <nav className="ikas-account__nav" aria-label={accountInfoLabel}>
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`ikas-account__nav-btn${
                  tab === item.id ? " ikas-account__nav-btn--active" : ""
                }`}
                aria-current={tab === item.id ? "page" : undefined}
                onClick={item.go}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              className="ikas-account__nav-btn ikas-account__nav-btn--logout"
              onClick={() => void handleLogout()}
            >
              {logoutLabel}
            </button>
          </nav>
        </aside>

        <div className="ikas-account__content">
          {!ready ? (
            <div className="ikas-account__loading" aria-busy="true" />
          ) : tab === "account" ? (
            <ProfilePanel
              accountForm={accountForm}
              profileTitle={profileTitle || ""}
              firstNameLabel={firstNameLabel || ""}
              lastNameLabel={lastNameLabel || ""}
              emailLabel={emailLabel || ""}
              phoneLabel={phoneLabel || ""}
              saveButtonText={saveButtonText || ""}
              savingButtonText={savingButtonText || ""}
              successMessage={successMessage || ""}
            />
          ) : tab === "orders" ? (
            <AccountOrdersPanel
              title={ordersTitle}
              emptyText={ordersEmptyText}
              shopButtonText={shopButtonText}
              detailButtonText={detailButtonText}
              orderNoText={orderNoText}
              itemsText={itemsText}
              errorText={ordersErrorText}
              retryButtonText={retryButtonText}
            />
          ) : tab === "addresses" ? (
            <AccountAddressesPanel
              title={addressesTitle}
              emptyText={addressesEmptyText}
              addAddressText={addAddressText}
              editAddressText={editAddressText}
              deleteAddressText={deleteAddressText}
              cancelText={cancelText}
              saveButtonText={saveButtonText}
              savingButtonText={savingButtonText}
              modalTitleAdd={modalTitleAdd}
              modalTitleEdit={modalTitleEdit}
              deleteConfirmTitle={deleteConfirmTitle}
              deleteConfirmMessage={deleteConfirmMessage}
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
            />
          ) : (
            <AccountFavoritesPanel
              title={favoritesTitle}
              emptyText={favoritesEmptyText}
              shopButtonText={shopButtonText}
              addToCartText={addToCartText}
              discountBadgeText={discountBadgeText}
              quickAddAriaLabel={quickAddAriaLabel}
              removeFavoriteText={removeFavoriteText}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default AccountDashboard;
