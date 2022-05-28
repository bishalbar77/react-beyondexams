import React from "react";
import logo from "../asset/logo-with-text.webp";
import img2 from "../asset/Group 1172.webp";
import bgImg from "../asset/Group 1304.svg";
import styles from "./Landing.module.css";
import FeatureCard from "./FeatureCard";
import Footer from "../Student/Footer";

const features = [
  {
    id: 0,
    img: "https://static.wixstatic.com/media/c22c23_43242107a6ca4fe6bb37f0a698754b55~mv2.png/v1/fill/w_155,h_164,al_c,q_85,usm_0.66_1.00_0.01/Artboard%201.webp",
    head: "Easy to Use",
    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat, porro! Corrupti eum recusandae magni enim?",
  },
  {
    id: 1,
    img: "https://static.wixstatic.com/media/c22c23_43242107a6ca4fe6bb37f0a698754b55~mv2.png/v1/fill/w_155,h_164,al_c,q_85,usm_0.66_1.00_0.01/Artboard%201.webp",
    head: "Fully Assisted platform",
    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat, porro! Corrupti eum recusandae magni enim?",
  },
  {
    id: 2,
    img: "https://static.wixstatic.com/media/c22c23_43242107a6ca4fe6bb37f0a698754b55~mv2.png/v1/fill/w_155,h_164,al_c,q_85,usm_0.66_1.00_0.01/Artboard%201.webp",
    head: "Create courses for a particular skill or a class",
    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat, porro! Corrupti eum recusandae magni enim?",
  },
  {
    id: 3,
    img: "https://static.wixstatic.com/media/c22c23_43242107a6ca4fe6bb37f0a698754b55~mv2.png/v1/fill/w_155,h_164,al_c,q_85,usm_0.66_1.00_0.01/Artboard%201.webp",
    head: "Easy to Use Analytics",
    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat, porro! Corrupti eum recusandae magni enim?",
  },
  {
    id: 4,
    img: "https://static.wixstatic.com/media/c22c23_43242107a6ca4fe6bb37f0a698754b55~mv2.png/v1/fill/w_155,h_164,al_c,q_85,usm_0.66_1.00_0.01/Artboard%201.webp",
    head: "Regularly Monitor Students' Progress",
    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat, porro! Corrupti eum recusandae magni enim?",
  },
];

const Landing = () => {
  return (
    <main className={styles.landing}>
      <div className={styles.landing__head}>
        <div className={styles.head__logo}>
          <img
            src={logo}
            alt="logo"
            className={styles.logo}
            width="150"
            height="145"
          />
        </div>
        <h1>The best way to learn is by teaching someone else!</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora sint
          odit quae fuga cupiditate consectetur, officia temporibus saepe cumque
          iusto veniam amet illo. Vel officia ullam a. Qui, provident quis?
        </p>
        <button>Get Started as a Teacher</button>
        <div className={styles.head__img + " " + styles.sm_screen}>
          <img src={img2} alt="" className={styles.image} />
        </div>
        <img src={bgImg} alt="" className={styles.shape_image} />
      </div>
      <div className={styles.landing__features_bg}>
        <div className={styles.features__side}>
          <FeatureCard feature={features[1]} />
          <FeatureCard feature={features[0]} />
        </div>
        <div className={styles.features__center}>
          <FeatureCard feature={features[2]} />
          <img
            src={img2}
            alt=""
            className={styles.fetures__image + " " + styles.bg_screen}
          />
        </div>
        <div className={styles.features__side}>
          <FeatureCard feature={features[3]} />
          <FeatureCard feature={features[4]} />
        </div>
      </div>
      <div className={styles.landing__features_sm}>
        {features.map((feature) => (
          <FeatureCard feature={feature} />
        ))}
      </div>
      <hr />
      <Footer />
    </main>
  );
};
export default Landing;
