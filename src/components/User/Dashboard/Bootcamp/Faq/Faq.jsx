import React from "react";
import Accordion from "./Accordion";
import styles from "./Faq.module.css";

export default function Faq({ course }) {
  return (
    <div className={styles.root}>
      <h2>
        Have a <span>question?</span>
        <br /> Look here
      </h2>
      <div className={styles.content}>
        <Accordion
          question={`Who can enroll for the ${course.title} course?`}
          answer="Our online courses are targeted at students & early working professionals."
        />
        <Accordion
          question="Why should I learn from BeyondExams?"
          answer="Our courses have been crafted with industry experts from all over the world, making it India’s first online learning platform with international instructors.\n 
Our courses are built for career aspirants who want to build a well paying, highly sought after career from the ground up.\n
Learn the best content from all over the Internet - Work on hands-on projects - Become certified - Get job placement support to land jobs."
        />
        <Accordion
          question="What certificate will I receive at the end of the program?"
          answer="On successful completion of the program, you will receive your course completion certificate from BeyondExams."
        />
        <Accordion
          question="Would the course content be available to me after completion of the course?"
          answer={`"Absolutely, you’ll be able to access the ${course.title} course content for a lifetime. We believe that learning never ends and you should always be able to access our resources to brush up on the concepts covered in the course.`}
        />
        <Accordion
          question="Is this course free?"
          answer="Students pay in BE keys to enrol in courses. You can get keys by adding notes, QnA, Reading Material, courses, etc. to BeyondExams. Or you can buy keys from us. You can email us at contact@beyondexams.org to know more about buying BE keys."
        />
      </div>
    </div>
  );
}
