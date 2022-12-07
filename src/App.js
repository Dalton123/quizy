import React, { useState, useEffect } from "react";
import "./App.css";
import { nanoid } from "nanoid";
import { decode } from "html-entities";
import Intro from "./components/Intro";
import Question from "./components/Question";
import CheckAnswers from "./components/CheckAnswers";
import Github from "./components/Github";
import Confetti from "react-confetti";

function App() {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState();
  const [checked, setChecked] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [ready, setReady] = useState(true);
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
      <CheckAnswers
        questions={questions}
        score={score}
        checked={checked}
        allQuestionsAnswered={allQuestionsAnswered}
        setScore={setScore}
        setChecked={setChecked}
        setAllQuestionsAnswered={setAllQuestionsAnswered}
        numOfQuestions={numOfQuestions}
        resetGame={resetGame}
      />

      <Github link="https://github.com/Dalton123/quizy" />
    </div>
  );
}

export default App;
