import { useEffect, useRef, useState } from "preact/hooks";
import {
  getProductCustomerReviews,
  getIkasCustomerReviewFormattedDate,
  getCustomerReviewListNextPage,
  hasCustomerReviewListNextPage,
  IkasCustomerReview,
  IkasCustomerReviewList,
} from "@ikas/bp-storefront";
import { applyLayoutTokens, ThemeSetting, readSetting } from "../../utils/themeTokens";
import { useReveal, revealClasses } from "../../utils/reveal";
import Button from "../../sub-components/Button";
import CustomerReviewForm from "../../sub-components/CustomerReviewForm";
import { Props } from "./types";

export interface CustomerReviewsSectionProps extends Props {
  className?: string;
}

function authorLabel(review: IkasCustomerReview): string {
  const first = (review.firstName || "").trim();
  const last = (review.lastName || "").trim();
  if (first && last) return `${first} ${last.charAt(0).toLocaleUpperCase("tr-TR")}.`;
  if (first) return first;
  if (review.email) return review.email.split("@")[0] || "";
  return "";
}

function isVerified(review: IkasCustomerReview): boolean {
  return !!(review.orderId || review.orderNumber);
}

/** Uzun yorumlar kısaltılıp "devamını oku" ile açılır. */
function isLongComment(text: string): boolean {
  return text.length > 320 || text.split("\n").length > 5;
}

function Stars({ value }: { value: number }) {
  const n = Math.min(5, Math.max(0, Math.round(value)));
  return (
    <>
      {"★".repeat(n)}
      {"☆".repeat(5 - n)}
    </>
  );
}

export function CustomerReviewsSection({
  tag = "02 · YORUMLAR",
  heading = "Müşteri değerlendirmeleri",
  countSuffix = "doğrulanmış yorum",
  verifiedBuyerText = "Doğrulanmış alıcı",
  emptyText = "Bu ürün için henüz yorum yok.",
  loadingText = "Yorumlar yükleniyor...",
  errorText = "Yorumlar yüklenemedi. Lütfen tekrar deneyin.",
  showReviewForm = true,
  writeReviewText = "YORUM YAZ",
  cancelReviewText = "VAZGEÇ",
  formHeading = "Deneyimini paylaş",
  ratingLabel = "PUANIN",
  starUnitLabel = "yıldız",
  titleLabel = "BAŞLIK",
  titlePlaceholder = "Kısaca özetle",
  commentLabel = "YORUMUN",
  commentPlaceholder = "Ürünle ilgili deneyimini anlat",
  submitReviewText = "YORUMU GÖNDER",
  submittingReviewText = "GÖNDERİLİYOR...",
  reviewSuccessText = "Teşekkürler! Yorumun onaylandıktan sonra yayınlanacak.",
  reviewFailureText = "Yorum gönderilemedi. Lütfen tekrar deneyin.",
  loginRequiredText = "Yorum yazmak için giriş yapmalısın.",
  loginButtonText = "GİRİŞ YAP",
  reviewsPerPage = 5,
  loadMoreText = "DAHA FAZLA YORUM",
  loadingMoreText = "YÜKLENİYOR...",
  showingText = "yorum gösteriliyor",
  readMoreText = "Devamını oku",
  readLessText = "Daha az göster",
  storeReplyLabel = "MAĞAZA YANITI",
  product,
  backgroundColor,
  className = "",
}: CustomerReviewsSectionProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [reviews, setReviews] = useState<IkasCustomerReview[]>([]);
  const [listCount, setListCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [reloadKey, setReloadKey] = useState(0);
  const listRef = useRef<IkasCustomerReviewList | null>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const itemsReveal = useReveal(itemsRef, {
    threshold: 0.08,
    rootMargin: "0px 0px -4% 0px",
    enabled: !loading && !error && reviews.length > 0,
  });

  const pageSize = Math.min(50, Math.max(1, Math.round(Number(reviewsPerPage) || 5)));

  const layoutTokens = applyLayoutTokens({
    includePy: true,
    includePx: true,
    includeSiteWidth: true,
  });
  const fadeEase = readSetting(ThemeSetting.fade, "0.6s cubic-bezier(0.22, 1, 0.36, 1)");

  const syncFromList = (list: IkasCustomerReviewList | null) => {
    setReviews(list?.data ? [...list.data] : []);
    setListCount(list?.count ?? list?.data?.length ?? 0);
    setHasMore(!!list && hasCustomerReviewListNextPage(list));
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!product) {
        listRef.current = null;
        syncFromList(null);
        setError(false);
        return;
      }

      // Gönderimden sonraki yenilemede mevcut liste ekranda kalsın (iskelet yanıp sönmesin).
      if (reloadKey === 0) setLoading(true);
      setError(false);
      try {
        const list = await getProductCustomerReviews(product, pageSize, 1);
        if (cancelled) return;
        listRef.current = list;
        syncFromList(list);
      } catch (err) {
        console.error("Yorumlar yüklenemedi:", err);
        if (!cancelled) {
          listRef.current = null;
          syncFromList(null);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [product?.id, pageSize, reloadKey]);

  const loadMore = async () => {
    const list = listRef.current;
    if (!list || loadingMore || !hasCustomerReviewListNextPage(list)) return;
    setLoadingMore(true);
    try {
      await getCustomerReviewListNextPage(list);
      syncFromList(list);
    } catch (err) {
      console.error("Yorumlar yüklenemedi:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const avgRating =
    typeof product?.averageRating === "number" && product.averageRating > 0
      ? product.averageRating
      : reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.star || 0), 0) / reviews.length
        : 0;

  const totalReviews = listCount || product?.reviewCount || reviews.length;
  const canWriteReview = showReviewForm && !!product;
  // Hiç yorum yoksa boş puan sütunu gizlenir, mesaj tek sütunda gösterilir
  const isEmpty =
    !loading && !error && reviews.length === 0 && totalReviews === 0 && avgRating === 0;

  const writeButton = canWriteReview && (formOpen ? cancelReviewText : writeReviewText) && (
    <Button
      text={formOpen ? cancelReviewText : writeReviewText}
      variant={formOpen ? "PILL_SECONDARY" : "PILL_PRIMARY"}
      className="ikas-reviews__write"
      onClick={() => setFormOpen((v) => !v)}
    />
  );

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    ...layoutTokens,
    "--reviews-fade": fadeEase,
  } as any;

  return (
    <section
      id="degerlendirmeler"
      className={`ikas-reviews ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-reviews__container">
        <header
          className={`ikas-reviews__header${isEmpty && writeButton ? " ikas-reviews__header--action" : ""}`}
        >
          {tag && <div className="ikas-reviews__tag">{tag}</div>}
          {heading && <h2 className="ikas-reviews__heading">{heading}</h2>}
          {/* Yorum yokken puan sütunu gizli; buton başlığın sağında durur */}
          {isEmpty && writeButton}
        </header>

        <div className={`ikas-reviews__layout${isEmpty ? " ikas-reviews__layout--empty" : ""}`}>
          {!isEmpty && (
            <aside className="ikas-reviews__aside">
              {avgRating > 0 && (
                <div className="ikas-reviews__score-row">
                  <span className="ikas-reviews__score">
                    {avgRating.toLocaleString("tr-TR", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </span>
                  <span
                    className="ikas-reviews__stars"
                    role="img"
                    aria-label={`${avgRating.toLocaleString("tr-TR")} / 5`}
                  >
                    <Stars value={avgRating} />
                  </span>
                </div>
              )}
              {totalReviews > 0 && countSuffix && (
                <span className="ikas-reviews__count">
                  {totalReviews.toLocaleString("tr-TR")} {countSuffix}
                </span>
              )}
              {writeButton}
            </aside>
          )}

          <div className="ikas-reviews__main">
            {isEmpty && emptyText && <p className="ikas-reviews__status">{emptyText}</p>}

            {canWriteReview && formOpen && product && (
              <CustomerReviewForm
                product={product}
                formHeading={formHeading}
                ratingLabel={ratingLabel}
                starUnitLabel={starUnitLabel}
                titleLabel={titleLabel}
                titlePlaceholder={titlePlaceholder}
                commentLabel={commentLabel}
                commentPlaceholder={commentPlaceholder}
                submitText={submitReviewText}
                submittingText={submittingReviewText}
                successText={reviewSuccessText}
                failureText={reviewFailureText}
                loginRequiredText={loginRequiredText}
                loginButtonText={loginButtonText}
                onSubmitted={() => setReloadKey((k) => k + 1)}
              />
            )}

            {loading && (
              <div className="ikas-reviews__loading" aria-live="polite">
                <div className="ikas-reviews__skeleton" aria-hidden="true" />
                <div className="ikas-reviews__skeleton" aria-hidden="true" />
                <div className="ikas-reviews__skeleton" aria-hidden="true" />
                {loadingText && <p className="ikas-reviews__status">{loadingText}</p>}
              </div>
            )}

            {!loading && error && errorText && (
              <p className="ikas-reviews__status ikas-reviews__status--error" role="alert">
                {errorText}
              </p>
            )}

            {!loading && !error && reviews.length > 0 && (
              <div
                ref={itemsRef}
                className={`ikas-reviews__list ${revealClasses("ikas-reviews__list", itemsReveal)}`.trim()}
              >
                {reviews.map((rev, idx) => {
                  const author = authorLabel(rev);
                  const verified = isVerified(rev);
                  const dateStr = getIkasCustomerReviewFormattedDate(rev);
                  const comment = rev.comment || "";
                  const long = isLongComment(comment);
                  const open = !!expanded[rev.id];

                  return (
                    <article
                      key={rev.id}
                      className="ikas-reviews__item"
                      style={{ "--stagger": `${Math.min(idx, pageSize) * 60}ms` } as any}
                    >
                      <div className="ikas-reviews__item-top">
                        <span
                          className="ikas-reviews__item-stars"
                          role="img"
                          aria-label={`${rev.star || 0} / 5`}
                        >
                          <Stars value={rev.star || 0} />
                        </span>
                        {dateStr && (
                          <time className="ikas-reviews__item-date">{dateStr}</time>
                        )}
                      </div>

                      {rev.title && <h3 className="ikas-reviews__item-title">{rev.title}</h3>}

                      {comment && (
                        <p
                          className={`ikas-reviews__item-text${
                            long && !open ? " ikas-reviews__item-text--clamped" : ""
                          }`}
                        >
                          {comment}
                        </p>
                      )}

                      {long && (open ? readLessText : readMoreText) && (
                        <button
                          type="button"
                          className="ikas-reviews__more-link"
                          aria-expanded={open}
                          onClick={() => toggleExpanded(rev.id)}
                        >
                          {open ? readLessText : readMoreText}
                        </button>
                      )}

                      {rev.reply && (
                        <div className="ikas-reviews__reply">
                          {storeReplyLabel && (
                            <span className="ikas-reviews__reply-label">{storeReplyLabel}</span>
                          )}
                          <p className="ikas-reviews__reply-text">{rev.reply}</p>
                        </div>
                      )}

                      {(author || (verified && verifiedBuyerText)) && (
                        <div className="ikas-reviews__item-meta">
                          {author && <span className="ikas-reviews__author">{author}</span>}
                          {verified && verifiedBuyerText && (
                            <span className="ikas-reviews__badge">{verifiedBuyerText}</span>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && !error && reviews.length > 0 && (hasMore || totalReviews > reviews.length) && (
              <div className="ikas-reviews__pager">
                {showingText && (
                  <span className="ikas-reviews__pager-count">
                    {reviews.length.toLocaleString("tr-TR")} / {totalReviews.toLocaleString("tr-TR")}{" "}
                    {showingText}
                  </span>
                )}
                {hasMore && (loadingMore ? loadingMoreText : loadMoreText) && (
                  <Button
                    text={loadingMore ? loadingMoreText : loadMoreText}
                    variant="PILL_SECONDARY"
                    disabled={loadingMore}
                    loading={loadingMore}
                    onClick={() => {
                      void loadMore();
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomerReviewsSection;
