import React from "react";
import { decode } from "html-entities";

export default function QuizForm({
  formId,
  question,
  answers,
  selectedAnswerId,
  handleCheck,
}) {
  question = decode(question);

  return (
    <>
      <form key={formId} className="test" id={formId}>
        <p className="test--question">{question}</p>
        {answers.map((answer) => (
          <React.Fragment key={answer.answerId}>
            <input
              type="radio"
              name={"answer" + formId}
              id={answer.answerId}
              value={answer.answerValue}
              onChange={() => handleCheck(formId, answer.answerId)}
              checked={selectedAnswerId === answer.answerId}
            />
            <label htmlFor={answer.answerId} className={answer.className}>
              {answer.answerValue}
            </label>
          </React.Fragment>
        ))}
      </form>
    </>
  );
}
