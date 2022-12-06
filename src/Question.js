import { nanoid } from "nanoid";

export default function Question({
  question,
  allAnswers,
  correctAnswer,
  select,
  id,
  userGuess,
  checked
}) {
  const answerBtns = allAnswers.map((answer) => {
    let guessClass = "";

    if (checked) {
      if (userGuess === answer) {
        if (userGuess === correctAnswer) {
          guessClass = "correct";
        } else if (userGuess !== correctAnswer) {
          guessClass = "wrong";
        }
      } else if (correctAnswer === answer) {
        guessClass = "correct";
      }
    } else if (userGuess === answer) {
      guessClass = "toggled";
    } else {
      guessClass = "";
    }

    return (
      <button
        key={nanoid()}
        className={guessClass}
        onClick={(event) => select(event, answer, id)}
      >
        {answer}
      </button>
    );
  });
  return (
    <div className="question">
      <p className="q-number">Question {id + 1}</p>
      <h3>{question}</h3>
      <div className="answers">{answerBtns}</div>
    </div>
  );
}
