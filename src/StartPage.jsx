import React from "react";

export default function StartPage(props) {
  return (
    <main>
      <h1>Quizzical</h1>
      <p className="subtitle">Test your knowledge with Quizzical! Have fun!</p>
      <button className="prime-btn" onClick={() => props.changeToQuizPage()}>
        Start quiz
      </button>
    </main>
  );
}
