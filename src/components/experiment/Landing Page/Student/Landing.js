import React from "react";
import logo from "../asset/logo-with-text.webp";
import img from "../../../../assets/images/icons/home-top-illustration.webp";
import bgImg from "../asset/Group 1304.svg";
import styles from "./Landing.module.css";
import MagicSliderDots from "react-magic-slider-dots";
import SliderDots from "react-slick";
import "react-magic-slider-dots/dist/magic-dots.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Footer";

const features = [
  {
    id: 0,
    img: "https://static.wixstatic.com/media/c22c23_43242107a6ca4fe6bb37f0a698754b55~mv2.png/v1/fill/w_155,h_164,al_c,q_85,usm_0.66_1.00_0.01/Artboard%201.webp",
    text: "Awarded with Certificates",
  },
  {
    id: 1,
    img: "https://static.wixstatic.com/media/c22c23_43242107a6ca4fe6bb37f0a698754b55~mv2.png/v1/fill/w_155,h_164,al_c,q_85,usm_0.66_1.00_0.01/Artboard%201.webp",
    text: "Appropriate Reading Material",
  },
  {
    id: 2,
    img: "https://static.wixstatic.com/media/c22c23_43242107a6ca4fe6bb37f0a698754b55~mv2.png/v1/fill/w_155,h_164,al_c,q_85,usm_0.66_1.00_0.01/Artboard%201.webp",
    text: "QnA",
  },
  {
    id: 3,
    img: "https://static.wixstatic.com/media/c22c23_43242107a6ca4fe6bb37f0a698754b55~mv2.png/v1/fill/w_155,h_164,al_c,q_85,usm_0.66_1.00_0.01/Artboard%201.webp",
    text: "Personalised Public Resume",
  },
];

export const FeatureCard = ({ id, img, text }) => (
  <div className={styles.featureCard + " " + styles["id-" + (id % 2)]}>
    <img src={img} alt="feature" className={styles.featureCard__img} />
    <p className={styles.featureCard__text}>{text}</p>
  </div>
);

const Landing = () => {
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots) => {
      return <MagicSliderDots dots={dots} numDotsToShow={4} dotWidth={30} />;
    },
  };
  return (
    <div>
      <main className={styles.landing}>
        <div className={styles.landing__head}>
          <div className={styles.head__left}>
            <div className={styles.head__logo}>
              <img
                src={logo}
                alt="logo"
                className={styles.logo}
                width="150"
                height="145"
              />
            </div>
            <div className={styles.head__content}>
              <h1>Are you frustated by how outdated the syllabus is?</h1>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam
                rem deserunt obcaecati quidem illo maxime suscipit error, commodi
                sequi amet.
              </p>
              <button>Get Started as a Student</button>
            </div>
          </div>
          <div className={styles.head__right}>
            <img src={img} alt="" className={styles.image} />
          </div>
          <img src={bgImg} alt="" className={styles.shape_image} />
        </div>
      </main>
      <div className={styles.landing__section}>
        <div className={styles.landing__features__bg}>
          {features.map(({ id, img, text }) => (
            <FeatureCard key={id} id={id} img={img} text={text} />
          ))}
        </div>
        <div className={styles.landing__features__md}>
          <SliderDots {...sliderSettings}>
            <div className={styles.landing__features__half__md}>
              {features.slice(0, 2).map(({ id, img, text }) => (
                <FeatureCard key={id} id={id} img={img} text={text} />
              ))}
            </div>
            <div className={styles.landing__features__half__md}>
              {features.slice(2, 4).map(({ id, img, text }) => (
                <FeatureCard key={id} id={id} img={img} text={text} />
              ))}
            </div>
          </SliderDots>
        </div>
        <div className={styles.landing__features__sm}>
          <SliderDots {...sliderSettings}>
            {features.map(({ id, img, text }) => (
              <div className={styles.landing__features__half__sm}>
                <FeatureCard key={id} id={id} img={img} text={text} />
              </div>
            ))}
          </SliderDots>
        </div>
        <p className={styles.section__text}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo, a
          sit? Consequuntur deleniti qui velit pariatur, repellendus perferendis
          beatae veritatis quidem molestias corrupti dolores odit eum sit dicta,
          sapiente optio!
        </p>
      </div>
      <Footer />
    </div>
  );
};
export default Landing;
