import React from 'react';
import logo from "./asset/logo-with-text.webp";
import "./LandingSix.css";

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
                    <div className="landingThree-btn">
                        <input
                            type="text"
                            placeholder="Enter your email address"
                        />
                        <button>Get started</button>
                    </div>
                </div>
                <div className="bg-shapes"></div>
                <div className="image-div"></div>
            </div>
        </main>
    )
}

export default LandingThree
