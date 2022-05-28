import React from "react";
import logo from "../asset/logo-with-text.webp";
import Footer from "./Footer";
import MagicSliderDots from "react-magic-slider-dots";
import SliderDots from "react-slick";
import styles from "./Landing.module.css";
import "../LandingOne.css";
import "react-magic-slider-dots/dist/magic-dots.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import features from "./student-features.json";
import details from "./page-details-one.json";
import useImage from "./useImage";

export const FeatureCard = ({ id, img, text }) => (
  <div className={styles.featureCard + " " + styles["id-" + (id % 2)]}>
    <img src={img} alt="feature" className={styles.featureCard__img} />
    <p className={styles.featureCard__text}>{text}</p>
  </div>
);
function StudentOne() {
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
  const { loading, image } = useImage(details.page_image);

  return (
    <div>
      <main id="landingOne">
        <div className="container-landing">
          <div className="left">
            <div className="eclipse"></div>
            <div>
              <img src={logo} alt="" className="logo" />
            </div>
            <div className="container-content">
              <div className="content">
                <h1>{details.page_heading}</h1>
                <p>{details.page_subheading}</p>
              </div>
            </div>

            <a className="button-container" href={details.button_link} target="_blank" rel="noopener noreferrer">
              <button>{details.button_text}</button>
            </a>
          </div>
          {!loading && <div className="right" style={{ backgroundImage: `url('${image}')`, opacity: 0.8 }} />}
        </div>
      </main>
      <div className={styles.landing__section}>
        <div className={styles.landing__features__bg}>
          {features.map(({ id, img, head }) => {
            return <FeatureCard key={id} id={id} img={img} text={head} />;
          })}
        </div>
        <div className={styles.landing__features__md}>
          <SliderDots {...sliderSettings}>
            <div className={styles.landing__features__half__md}>
              {features.slice(0, 2).map(({ id, img, head }) => (
                <FeatureCard key={id} id={id} img={img} text={head} />
              ))}
            </div>
            <div className={styles.landing__features__half__md}>
              {features.slice(2, 4).map(({ id, img, head }) => (
                <FeatureCard key={id} id={id} img={img} text={head} />
              ))}
            </div>
          </SliderDots>
        </div>
        <div className={styles.landing__features__sm}>
          <SliderDots {...sliderSettings}>
            {features.map(({ id, img, head }) => (
              <div className={styles.landing__features__half__sm}>
                <FeatureCard key={id} id={id} img={img} text={head} />
              </div>
            ))}
          </SliderDots>
        </div>
        <p className={styles.section__text}>
          {details.extra_description}
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default StudentOne;
