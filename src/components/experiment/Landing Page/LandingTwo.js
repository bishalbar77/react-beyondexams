import React from "react";
import logo from "./asset/logo-with-text.webp";
import img from "./asset/Group 1153-2 (1).webp";
import "./LandingTwo.css";

function LandingTwo() {
  return (
    <main id="landingTwo">
      <div className="container-landing">
        <div className="container-logo">
          <img src={logo} alt="logo" className="logo" />
        </div>
        <div className="content">
          <div className="container-content">
            <div className="left">
              <div className="top">
                <h1>Are you frustated by how outdated the syllabus is?</h1>
                <p>
                  Come and explore through our wide range of updated courses for
                  free
                </p>
              </div>
              <div className="bottom">
                <input
                  type="text"
                  placeholder="What do you want to learn today?"
                />
                <button>Search</button>
              </div>
            </div>
            <div className="right">
              <img src={img} alt="image-girl" className="image" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LandingTwo;
