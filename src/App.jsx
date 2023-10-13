import React from "react";
import { nanoid } from "nanoid";
import { decode } from "html-entities";
import StartPage from "./StartPage.jsx";
import QuizForm from "./QuizForm.jsx";
import Confetti from "react-confetti";

function App() {
  const [isMainPage, setIsMainPage] = React.useState(true);
  const [quiz, setQuiz] = React.useState([]);
  const [selectedAnswerIds, setSelectedAnswerIds] = React.useState({});
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [result, setResult] = React.useState(0);

  React.useEffect(() => {
    getQuiz();
  }, [isMainPage]);

  React.useEffect(() => {
    let correctAnswersCount = 0;
    quiz.forEach((quizItem) => {
      const selectedAnswer = selectedAnswerIds[quizItem.id];

      if (selectedAnswer) {
        const selectedAnswerObj = quizItem.answers.find(
          (answer) => answer.answerId === selectedAnswer
        );

        if (selectedAnswerObj.answerValue === quizItem.correctAnswer) {
          correctAnswersCount++;
        }
      }
    });
    setResult(correctAnswersCount);
  }, [isCompleted]);

  function changeToQuizPage() {
    setIsMainPage((prevIsMainPage) => !prevIsMainPage);
  }

  function shuffleAnswers(answers) {
    for (let i = answers.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[randomIndex]] = [answers[randomIndex], answers[i]];
    }
    return answers;
  }

  async function getQuiz() {
    const quizObj = await fetch(
      `https://opentdb.com/api.php?amount=5&category=9`
    );
    const quizData = await quizObj.json();
    setQuiz(
      quizData.results.map((quizItem) => {
        const allAnswers = [
          quizItem.correct_answer,
          ...quizItem.incorrect_answers,
        ];
        const shuffledAnswers = shuffleAnswers(allAnswers);

        return {
          id: nanoid(),
          question: quizItem.question,
          correctAnswer: quizItem.correct_answer,
          answers: shuffledAnswers.map((answer) => ({
            answerValue: decode(answer),
            answerId: nanoid(),
            className: "",
          })),
        };
      })
    );
  }

  function handleCheck(formId, answerId) {
    setSelectedAnswerIds((prevIds) => ({
      ...prevIds,
      [formId]: prevIds[formId] === answerId ? null : answerId,
    }));
  }

  function checkAnsweres() {
    setQuiz((prevQuiz) =>
      prevQuiz.map((quizItem) => {
        const correctAnswerObj = quizItem.answers.find(
          (answer) => answer.answerValue === quizItem.correctAnswer
        );

        const correctAnswerValue = correctAnswerObj
          ? correctAnswerObj.answerValue
          : null;

        return {
          ...quizItem,
          answers: quizItem.answers.map((quizAnswer) => {
            let className = "test-completed";

            if (quizAnswer.answerValue === correctAnswerValue) {
              className = "correct-answer";
            }
            if (quizAnswer.answerId === selectedAnswerIds[quizItem.id]) {
              if (quizAnswer.answerValue === correctAnswerValue) {
                className = "correct-answer";
              } else {
                className += " incorrect-answer";
              }
            }
            return {
              ...quizAnswer,
              className: className,
            };
          }),
        };
      })
    );
  }

  function renderButton() {
    let quizBtn;
    if (isCompleted) {
      quizBtn = (
        <div className="result-message">
          <p>You scored {result}/5 correct answers</p>
          <button
            className="prime-btn"
            key={nanoid()}
            onClick={() => {
              getQuiz();
              setIsCompleted(false);
            }}
          >
            Play again
          </button>
        </div>
      );
    } else {
      quizBtn = (
        <button
          className="prime-btn check-btn"
          key={nanoid()}
          onClick={() => {
            checkAnsweres();
            setIsCompleted(true);
          }}
        >
          Check answers
        </button>
      );
    }

    return quizBtn;
  }

  function renderQuizPage() {
    return (
      <>
        {quiz.map((quizItem) => (
          <QuizForm
            key={quizItem.id}
            formId={quizItem.id}
            question={quizItem.question}
            answers={quizItem.answers}
            selectedAnswerId={selectedAnswerIds[quizItem.id] || null}
            handleCheck={handleCheck}
            isCompleted={isCompleted}
          />
        ))}
        {renderButton()}
      </>
    );
  }

  return (
    <>
      <div className="container">
        {isCompleted && result > 2 && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}
        {isMainPage ? (
          <StartPage changeToQuizPage={changeToQuizPage} />
        ) : (
          renderQuizPage()
        )}
      </div>
    </>
  );
}

export default App;
