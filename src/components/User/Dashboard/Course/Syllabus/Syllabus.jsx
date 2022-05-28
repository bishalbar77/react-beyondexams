import React from "react";
import Accordion from "./Accordion";
import styles from "./Syllabus.module.css";

export default function Syllabus({ modules, slug, course }) {
  return (
    <div className={styles.root} id="bar_ref">
      <h2>Syllabus</h2>
      <p>
        Best course content delivered by leading faculty and industry experts in the form of On-Demand Videos and
        Projects.
      </p>
      <div className={styles.content}>
        {modules.map((e, i) => (
          <>
            <Accordion
              index={i}
              videos={e.videos}
              title={e.title}
              notes={e.notes}
              quizzes={e.quizzes}
              projects={e.projects}
              live_classes={e.live_classes}
              course_slug={slug}
              course={course}
              modules={modules}
              module={e}
            />
            {i != modules.length - 1 && <hr />}
          </>
        ))}
      </div>
    </div>
  );
}
