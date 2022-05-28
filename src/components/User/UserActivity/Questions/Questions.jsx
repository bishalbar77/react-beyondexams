import React from "react";
import Question from "./Question/Question";

const Questions = ({ questions, answers, getData }) => {
  return (
    <section>
      {questions.map((e, i) => (
        <Question key={i} data={e} type="Question" />
      ))}
      {answers.map((e, i) => (
        <Question key={i} data={e} type="Answer" getData={getData} />
      ))}
    </section>
  );
};

export default Questions;
