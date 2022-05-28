import React, { useState } from "react";
import logo from "../asset/logo-with-text.webp";
import img from "../asset/Group 1153-2 (1).webp";
import img2 from "../asset/Group 1172.webp";
import styles from "./Landing.module.css";
import FeatureCard from "./FeatureCard";
import details from "./page-details-two.json";
import useImage from "../Student/useImage";
import Footer from "../Student/Footer";
import "../LandingTwo.css";

import features from "./features.json";

function TeacherTwo() {
  const { loading, image } = useImage(details.page_image);
  const [query, setQuery] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    window.open(details.button_link + query);
  };
  return (
    <div>
      <main id="landingTwo">
        <div className="container-landing">
          <div className="container-logo">
            <img src={logo} alt="logo" className="logo" />
          </div>
          <div className="content">
            <div className="container-content">
              <div className="left">
                <div className="top">
                  <h1>{details.page_heading}</h1>
                  <p>{details.page_subheading}</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="bottom">
                    <input
                      type="text"
                      placeholder="What do you want to learn today?"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      required
                    />
                    <button type="submit" disabled={!query}>
                      {details.button_text}
                    </button>
                  </div>
                </form>
              </div>
              {!loading && (
                <div className="right">
                  <img src={image} alt="image-girl" className="image" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <div className={styles.landing}>
        <div className={styles.landing__features_bg}>
          <div className={styles.features__side}>
            <FeatureCard feature={features[1]} />
            <FeatureCard feature={features[0]} />
          </div>
          <div className={styles.features__center}>
            <FeatureCard feature={features[2]} />
            <img src={img2} alt="" className={styles.fetures__image + " " + styles.bg_screen} />
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
      </div>
      <Footer />
    </div>
  );
}

export default TeacherTwo;
