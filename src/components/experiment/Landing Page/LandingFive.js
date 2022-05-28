import React from "react";
import logo from "./asset/logo-with-text.webp";
import "./LandingFive.css";

function LandingFive() {
    return (
        <main id="landingOne">
            <div className="container-landing">
                <div className="left">
                    <div className="eclipse"></div>
                    <div>
                        <img src={logo} alt="" className="logo" />
                    </div>
                    <div className="container-content">
                        <div className="content">
                            <h1>Are you fed up of how badly schools teach your child?</h1>
                            <p>
                                Please help the entire country get updated by teaching what you
                                know. Create a course on Beyondexams.
                            </p>
                        </div>
                    </div>
                    <div className="button-container">
                        <input
                            type="text"
                            placeholder="Enter your email address"
                        />
                        <button>Get started</button>
                    </div>
                </div>
                <div className="right">

                </div>
            </div>
        </main>
    );
}

export default LandingFive;
