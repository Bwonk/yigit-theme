import BouncyAccordionRow from "../../sub-components/BouncyAccordionRow";
import { Props } from "./types";

export function FaqAccordionItem({ question, answer }: Props) {
  if (!question) return null;

  return <BouncyAccordionRow question={question} answer={answer} />;
}

export default FaqAccordionItem;
