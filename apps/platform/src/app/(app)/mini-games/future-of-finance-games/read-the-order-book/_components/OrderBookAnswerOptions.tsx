import styles from "../read-the-order-book.module.css";

interface OrderBookAnswerOptionsProps {
  questionText: string;
  options: readonly string[];
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
}

export function OrderBookAnswerOptions({
  questionText,
  options,
  selectedAnswer,
  onSelect,
}: OrderBookAnswerOptionsProps) {
  return (
    <fieldset className={styles.answerGroup}>
      <legend>{questionText}</legend>
      <div className={styles.answerList}>
        {options.map((option) => (
          <label className={styles.answerChoice} key={option}>
            <input
              type="radio"
              name="order-book-answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onSelect(option)}
            />
            <span className={styles.answerSurface}>
              <span className={styles.radioMark} aria-hidden="true" />
              <span>{option}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
