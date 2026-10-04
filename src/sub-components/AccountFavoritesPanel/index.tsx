import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  getFavoriteProducts,
  removeIkasProductFromFavorites,
  Router,
  IkasProduct,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../Button";
import TextLink from "../TextLink";
import ProductCard from "../ProductCard";

export interface Props {
  title?: string;
  emptyText?: string;
  shopButtonText?: string;
  addToCartText?: string;
  discountBadgeText?: string;
  quickAddAriaLabel?: string;
  removeFavoriteText?: string;
}

export function AccountFavoritesPanel({
  title = "Favorilerim",
  emptyText = "Favori ürünün yok.",
  shopButtonText = "ALIŞVERİŞE BAŞLA",
  addToCartText = "SEPETE EKLE",
  discountBadgeText,
  quickAddAriaLabel,
  removeFavoriteText = "FAVORİDEN ÇIKAR",
}: Props) {
  const [favorites, setFavorites] = useState<IkasProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const products = await getFavoriteProducts(customerStore);
        if (!cancelled) setFavorites(products || []);
      } catch (err) {
        console.error("Favoriler yüklenemedi:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRemove = async (product: IkasProduct) => {
    try {
      const ok = await removeIkasProductFromFavorites(product);
      if (ok) {
        setFavorites((prev) => prev.filter((p) => p.id !== product.id));
      }
    } catch (err) {
      console.error("Favoriden çıkarma hatası:", err);
    }
  };

  return (
    <div className="ikas-account__panel">
      <h1 className="ikas-account__title _sKAMD8d1LA">
        {title}
        {favorites.length > 0 ? ` (${favorites.length})` : ""}
      </h1>

      {loading ? (
        <div className="ikas-account__loading" aria-busy="true" />
      ) : favorites.length === 0 ? (
        <div className="ikas-account__empty-block">
          <p className="ikas-account__empty">{emptyText}</p>
          <Button
            text={shopButtonText}
            variant="PILL_ACCENT"
            size="NORMAL"
            onClick={() => Router.navigateToPage("INDEX")}
          />
        </div>
      ) : (
        <div className="ikas-account-favs">
          {favorites.map((product) => (
            <div key={product.id} className="ikas-account-favs__card">
              <ProductCard
                product={product}
                showQuickAdd
                overlayQuickAdd
                addToCartText={addToCartText}
                discountBadgeText={discountBadgeText}
                quickAddAriaLabel={quickAddAriaLabel}
              />
              <TextLink
                tone="LABEL"
                className="ikas-account-favs__remove"
                text={removeFavoriteText}
                onClick={() => void handleRemove(product)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default observer(AccountFavoritesPanel);
