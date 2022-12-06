import React, { useState, useEffect } from "react";
import "./App.css";
import { nanoid } from "nanoid";
import { decode } from "html-entities";
import Intro from "./Intro";
import Question from "./Question";
import Confetti from "react-confetti";

function App() {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState();
  const [checked, setChecked] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [ready, setReady] = useState(false);
  const [reset, setReset] = useState(false);
  const numOfQuestions = questions.length;

  const fetchData = async () => {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=2&difficulty=easy"
    );
    const data = await response.json();
    // Decode the HTML entities and add some extra values to state
    const updatedData = data.results.map((data, i) => {
      return {
        ...data,
        id: i,
        question: decode(data.question),
        options: shuffleArray([
          ...decode(data.incorrect_answers),
          decode(data.correct_answer)
        ]),
        selected: false
      };
    });
    setQuestions(updatedData);
  };

  useEffect(() => {
    fetchData();
  }, [reset]);

  const resetGame = () => {
    setReset((prev) => !prev);
    setChecked(false);
    setAllQuestionsAnswered(false);
    setScore(0);
  };

  function shuffleArray(array) {
    return array.sort(function () {
      return Math.random() - 0.5;
    });
  }

  const readyUp = () => {
    setReady((current) => !current);
  };

  const selectAnswer = (event, selected, id) => {
    setQuestions((prev) =>
      prev.map((data) => {
        return data.id === id
          ? {
              ...data,
              selected: true,
              userGuess: selected
            }
          : data;
      })
    );
  };

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
    <div className="App">
      {score === numOfQuestions && <Confetti />}
      {!ready && <Intro readyUp={() => readyUp()} />}
      <div
        className={`questions-container ${allQuestionsAnswered && "checked"}`}
      >
        {questions &&
          questions.map((q) => {
            return (
              <Question
                key={nanoid()}
                id={q.id}
                checked={allQuestionsAnswered}
                question={q.question}
                allAnswers={q.options}
                correctAnswer={q.correct_answer}
                userGuess={q.userGuess}
                select={selectAnswer}
              />
            );
          })}
      </div>
      {
        <div className="check-answers">
          {UIMessage()}
          {!allQuestionsAnswered && (
            <button onClick={checkAnswers}>Check answers</button>
          )}
          {allQuestionsAnswered && (
            <button onClick={resetGame}>Play again?</button>
          )}
        </div>
      }
    </div>
  );
}

export default App;
