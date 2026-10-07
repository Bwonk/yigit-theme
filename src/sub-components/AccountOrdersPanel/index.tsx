import { useEffect, useRef, useState } from "preact/hooks";
import {
  customerStore,
  getOrders,
  getIkasOrderFormattedTotalFinalPrice,
  getIkasOrderTotalItemCount,
  getIkasOrderFormattedOrderedAt,
  getIkasOrderPackageStatusTranslation,
  getIkasOrderHref,
  Router,
  IkasOrder,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../Button";

export interface Props {
  title?: string;
  emptyText?: string;
  shopButtonText?: string;
  detailButtonText?: string;
  orderNoText?: string;
  itemsText?: string;
  errorText?: string;
  retryButtonText?: string;
}

export function AccountOrdersPanel({
  title = "Siparişlerim",
  emptyText = "Henüz siparişin yok.",
  shopButtonText = "ALIŞVERİŞE BAŞLA",
  detailButtonText = "DETAY",
  orderNoText = "Sipariş No",
  itemsText = "ürün",
  errorText = "Siparişler yüklenemedi.",
  retryButtonText = "TEKRAR DENE",
}: Props) {
  const [orders, setOrders] = useState<IkasOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const mountedRef = useRef(true);
  useEffect(() => () => {
    mountedRef.current = false;
  }, []);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await getOrders(customerStore);
      if (mountedRef.current) setOrders(result || []);
    } catch {
      if (mountedRef.current) setError(true);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="ikas-account__panel">
      <h1 className="ikas-account__title _sKAMD8d1LA">
        {title}
        {orders.length > 0 ? ` (${orders.length})` : ""}
      </h1>

      {loading ? (
        <div className="ikas-account__loading" aria-busy="true" />
      ) : error ? (
        <div className="ikas-account__empty-block">
          <p className="ikas-account__empty">{errorText}</p>
          <Button
            text={retryButtonText}
            variant="PILL_PRIMARY"
            size="NORMAL"
            onClick={() => void load()}
          />
        </div>
      ) : orders.length === 0 ? (
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
        <ul className="ikas-account-orders">
          {orders.map((order) => {
            const href = getIkasOrderHref(order);
            const count = getIkasOrderTotalItemCount(order);
            return (
              <li key={order.id} className="ikas-account-orders__item">
                <div className="ikas-account-orders__meta">
                  <span className="ikas-account-orders__no">
                    {orderNoText} #{order.orderNumber}
                  </span>
                  <span className="ikas-account-orders__date">
                    {getIkasOrderFormattedOrderedAt(order)}
                  </span>
                </div>
                <div className="ikas-account-orders__row">
                  <span className="ikas-account-orders__status">
                    {getIkasOrderPackageStatusTranslation(order)}
                  </span>
                  <span className="ikas-account-orders__count">
                    {count} {itemsText}
                  </span>
                  <span className="ikas-account-orders__price">
                    {getIkasOrderFormattedTotalFinalPrice(order)}
                  </span>
                </div>
                <Button
                  text={detailButtonText}
                  variant="PILL_SECONDARY"
                  size="NORMAL"
                  onClick={() => {
                    if (href) Router.navigate(href);
                    else if (order.id)
                      Router.navigateToPage("ORDER_DETAIL", order.id);
                  }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default observer(AccountOrdersPanel);
