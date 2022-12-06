export default function Intro({ readyUp }) {
  return (
    <div className="intro">
      <h1>Quizy</h1>
      {/* <p>Ready to get Quizy?</p> */}
      <button onClick={readyUp}>Start Quiz</button>
    </div>
  );
}
