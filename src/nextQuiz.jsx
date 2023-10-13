import React from "react";

export default function nextQuiz(props) {
  return (
    <div className="next-quiz">
      <h2>Let's try again?</h2>
      <button className="prime-btn" onClick={() => props.changeToQuizPage()}>
        Start quiz
      </button>
    </div>
  );
}
