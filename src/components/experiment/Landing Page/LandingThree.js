import React from 'react';
import logo from "./asset/logo-with-text.webp";
import "./LandingThree.css";

function LandingThree() {
    return (
        <main id="landingThree">
            <div className="container-landing">
                <div className="container-logo">
                    <img src={logo} alt="logo" className="logo" />
                </div>
                <div className="content">
                    <h1>Are you proud about the fact that you are a great teacher?</h1>
                    <p>Help students all over India learn through your courses!</p>
                    <button>Get started as a teacher</button>
                </div>
                <div className="bg-shapes"></div>
                <div className="image-div"></div>
            </div>
        </main>
    )
}

export default LandingThree
