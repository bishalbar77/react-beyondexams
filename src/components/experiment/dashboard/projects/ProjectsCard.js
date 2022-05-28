import React from 'react';
import styles from "./ProjectsCard.module.css";

function ProjectsCard({ img, name, btnText, number }) {
  return (
    <div className={styles.projectsCard}>
        <div className={styles.cardImage}>
            <img src={img} alt="image" />
            <h5>{number}% completed</h5>
        </div>

        <div className={styles.cardContent}>
            <h3>{name}</h3>
            <p>ongoing project</p>
            <button>{btnText}</button>
        </div>
    </div>
  )
}

export default ProjectsCard;