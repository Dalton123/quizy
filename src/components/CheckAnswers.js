import { decode } from "html-entities";
export default function CheckAnswers({
  score,
  setScore,
  checked,
  setChecked,
  allQuestionsAnswered,
  setAllQuestionsAnswered,
  numOfQuestions,
  resetGame,
  checkAnswers,
  questions
}) {
  function checkAnswers() {
    let userScore = 0;
    // Check to make sure each question has been answered
    const allAnswered = questions.every((q) => {
      return q.hasOwnProperty("selected") && q.selected === true;
    });
    // Updated state if they have all been answered
    allAnswered && setAllQuestionsAnswered((prev) => !allQuestionsAnswered);

    // Add 1 to the score for every correct answer
    questions.forEach(
      (d) => decode(d.userGuess) === decode(d.correct_answer) && userScore++
    );
    setScore((prev) => userScore);
    setChecked((prev) => true);
  }

  function UIMessage() {
    if (!checked) {
      return <p>Once you're finished, click below to check your answers.</p>;
    } else if (checked && !allQuestionsAnswered) {
      return (
        <p>
          Looks like you missed some questions, please try answer them all
          before checking your answers.
        </p>
      );
    } else if (score === 0) {
      return (
        <p>{`Unlucky! Why not try again and see if you can do better!`}</p>
      );
    } else if (score > 0 && score !== numOfQuestions) {
      return <p>{`Well done, you got ${score}/${numOfQuestions}`}</p>;
    } else {
      return (
        <p>
          {`Well done, you got them all correct! ${score}/${numOfQuestions}`};
        </p>
      );
    }
  }
  return (
    <div className="check-answers">
      {UIMessage()}
      {!allQuestionsAnswered && (
        <button onClick={checkAnswers}>Check answers</button>
      )}
      {allQuestionsAnswered && <button onClick={resetGame}>Play again?</button>}
    </div>
  );
}
