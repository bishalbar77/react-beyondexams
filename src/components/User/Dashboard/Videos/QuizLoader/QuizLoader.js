import React, { useState, useEffect } from "react";
import styles from "./QuizLoader.module.css";
import quizData from "./questions.json";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import LinearProgress from "@material-ui/core/LinearProgress";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

const question = quizData[Math.floor(Math.random() * quizData.length)];

const useStyles = makeStyles(() => ({
  paper: {
    minWidth: "70vw",
    minHeight: "fit-content",
    position: "relative",
  },
  progressBar: {
    marginTop: "0.8rem",
    width: "50%",
  },
  mt: {
    marginTop: "0",
  },
  iconCancel: {
    background: "red",
  },
}));

function QuizLoader({ isLoading }) {
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [initial, setInitial] = useState(true);
  const [correct, setCorrect] = useState(false);
  const classes = useStyles();

  const checkAnswer = (e, idx) => {
    const optionLabel = document.getElementById(`option-label-${idx}`);
    const option = document.getElementById(`option-li-${idx}`);

    const allOptions = document.querySelectorAll(`.${styles.inputOption}`);
    for (let i = 0; i < allOptions.length; i++) {
      const ol = document.getElementById(`option-label-${i}`);
      const op = document.getElementById(`option-li-${i}`);
      if (allOptions[i].value === question.correctAnswer) {
        console.log("in");
        // const elemId = allOptions[i].getAttribute("elemId");
        document.getElementById(`icon-right-${i}`).style.display = "block";
        ol.style.color = "green";
      } else {
        document.getElementById(`icon-wrong-${i}`).style.display = "block";
        ol.style.color = "red";
      }
      if (e.target.value === question.correctAnswer) {
        optionLabel.style.color = "green";
        option.style.border = "2px solid green";
        option.style.background = "var(--background)";
        setCorrect(true);
      } else {
        optionLabel.style.color = "red";
        option.style.border = "2px solid red";
        option.style.background = "var(--background)";
        setCorrect(false);
      }
      setIsChecked(true);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setInitial(false);
    }, 2000);
  });

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} classes={{ paper: classes.paper }}>
      <div className={styles.topContainer}>
        {isLoading && <p>The page is loading at the speed of light.</p>}

        {!isLoading && !initial ? (
          <>
            <p>The page is ready. Start learning now!</p>
            <button className={styles.continue} onClick={() => setIsOpen(false)}>
              Continue to website
            </button>
          </>
        ) : (
          <LinearProgress className={classes.progressBar} />
        )}

        <p className={classes.mt}>While you are waiting, can you answer this question?</p>

        <CloseIcon onClick={() => setIsOpen(false)} />
      </div>
      <div className={styles.quizLoaderWrapper}>
        <div className={styles.quizContainer}>
          <h1 className={styles.question}>{question.question}</h1>

          <div className={styles.optionContainer}>
            <div className={styles.options}>
              <ul className={styles.optionList}>
                {question.options.map((option, idx) => (
                  <li id={`option-li-${idx}`}>
                    <input
                      type="radio"
                      disabled={isChecked}
                      className={`${styles.inputOption} input-option`}
                      elemId={idx}
                      id={`option-${idx}`}
                      value={option}
                      name="selector"
                      onChange={(e) => checkAnswer(e, idx)}
                    />

                    <div className={styles.questionInput}>
                      <label htmlFor={`option-${idx}`} id={`option-label-${idx}`}>
                        {option}
                      </label>

                      <CheckCircleIcon id={`icon-right-${idx}`} style={{ display: "none", fill: "green" }} />
                      <CancelIcon id={`icon-wrong-${idx}`} style={{ display: "none", fill: "red" }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.image}>
              <img src={question.imgURL} className={styles.questionImg} alt="quiz-image" />
            </div>
          </div>
          {isChecked && (
            <p className={styles.text}>
              {correct ? "Correct answer! Good job!" : "That's incorrect! You learnt something new today!"}
            </p>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default QuizLoader;
