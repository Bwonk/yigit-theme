import { useId, useState } from "preact/hooks";
import {
  IkasProduct,
  customerStore,
  getIkasProductCustomerReviewForm,
  clearIkasProductCustomerReviewForm,
  isCustomerReviewLoginRequired,
  setCustomerReviewFormStar,
  setCustomerReviewFormTitle,
  setCustomerReviewFormComment,
  submitCustomerReviewForm,
  Router,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../Button";

interface Props {
  product: IkasProduct;
  formHeading?: string;
  ratingLabel?: string;
  starUnitLabel?: string;
  titleLabel?: string;
  titlePlaceholder?: string;
  commentLabel?: string;
  commentPlaceholder?: string;
  submitText?: string;
  submittingText?: string;
  successText?: string;
  failureText?: string;
  loginRequiredText?: string;
  loginButtonText?: string;
  /** Başarılı gönderimden sonra (ör. listeyi yenilemek için) çağrılır. */
  onSubmitted?: () => void;
}

export function CustomerReviewForm({
  product,
  formHeading,
  ratingLabel,
  starUnitLabel,
  titleLabel,
  titlePlaceholder,
  commentLabel,
  commentPlaceholder,
  submitText,
  submittingText,
  successText,
  failureText,
  loginRequiredText,
  loginButtonText,
  onSubmitted,
}: Props) {
  const uid = `review-form-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [hoverStar, setHoverStar] = useState(0);
  const [sent, setSent] = useState(false);

  if (isCustomerReviewLoginRequired(product) && !customerStore.customer) {
    return (
      <div className="ikas-review-form ikas-review-form--login">
        {loginRequiredText && (
          <p className="ikas-review-form__note">{loginRequiredText}</p>
        )}
        {loginButtonText && (
          <Button
            text={loginButtonText}
            variant="PILL_PRIMARY"
            onClick={() => Router.navigateToPage("LOGIN")}
          />
        )}
      </div>
    );
  }

  if (sent) {
    return (
      <div className="ikas-review-form ikas-review-form--done" role="status">
        {successText && <p className="ikas-review-form__note">{successText}</p>}
      </div>
    );
  }

  const form = getIkasProductCustomerReviewForm(product);
  const star = Number(form.star?.value) || 0;
  const shownStar = hoverStar || star;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (form.isSubmitting) return;
    try {
      const success = await submitCustomerReviewForm(form);
      if (success) {
        clearIkasProductCustomerReviewForm(product);
        setSent(true);
        onSubmitted?.();
      }
    } catch (err) {
      console.error("Yorum gönderilemedi:", err);
    }
  };

  return (
    <form className="ikas-review-form" onSubmit={handleSubmit} noValidate>
      {formHeading && <h3 className="ikas-review-form__heading">{formHeading}</h3>}

      {form.isFailure && (form.responseMessage || failureText) && (
        <div className="ikas-review-form__banner" role="alert">
          {form.responseMessage || failureText}
        </div>
      )}

      <fieldset className="ikas-review-form__field ikas-review-form__rating">
        {ratingLabel && <legend className="ikas-review-form__label">{ratingLabel}</legend>}
        <div
          className="ikas-review-form__stars"
          onMouseLeave={() => setHoverStar(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className={`ikas-review-form__star${
                n <= shownStar ? " ikas-review-form__star--on" : ""
              }`}
              onMouseEnter={() => setHoverStar(n)}
            >
              <input
                type="radio"
                className="ikas-review-form__star-input"
                name={`${uid}-star`}
                value={String(n)}
                checked={star === n}
                aria-label={`${n} ${starUnitLabel ?? ""}`.trim()}
                onChange={() => setCustomerReviewFormStar(form, String(n))}
              />
              <span aria-hidden="true">★</span>
            </label>
          ))}
        </div>
        {form.star?.hasError && form.star.message && (
          <span className="ikas-review-form__error">{form.star.message}</span>
        )}
      </fieldset>

      <label className="ikas-review-form__field" htmlFor={`${uid}-title`}>
        {titleLabel && <span className="ikas-review-form__label">{titleLabel}</span>}
        <input
          id={`${uid}-title`}
          className={`ikas-review-form__input${
            form.title?.hasError ? " ikas-review-form__input--error" : ""
          }`}
          type="text"
          name="title"
          placeholder={titlePlaceholder}
          value={form.title?.value ?? ""}
          onInput={(e) =>
            setCustomerReviewFormTitle(form, (e.target as HTMLInputElement).value)
          }
        />
        {form.title?.hasError && form.title.message && (
          <span className="ikas-review-form__error">{form.title.message}</span>
        )}
      </label>

      <label className="ikas-review-form__field" htmlFor={`${uid}-comment`}>
        {commentLabel && <span className="ikas-review-form__label">{commentLabel}</span>}
        <textarea
          id={`${uid}-comment`}
          className={`ikas-review-form__input ikas-review-form__textarea${
            form.comment?.hasError ? " ikas-review-form__input--error" : ""
          }`}
          name="comment"
          rows={5}
          placeholder={commentPlaceholder}
          value={form.comment?.value ?? ""}
          onInput={(e) =>
            setCustomerReviewFormComment(form, (e.target as HTMLTextAreaElement).value)
          }
        />
        {form.comment?.hasError && form.comment.message && (
          <span className="ikas-review-form__error">{form.comment.message}</span>
        )}
      </label>

      <Button
        type="submit"
        text={form.isSubmitting ? submittingText : submitText}
        variant="PILL_ACCENT"
        disabled={form.isSubmitting}
        loading={form.isSubmitting}
        className="ikas-review-form__submit"
      />
    </form>
  );
}

export default observer(CustomerReviewForm);
