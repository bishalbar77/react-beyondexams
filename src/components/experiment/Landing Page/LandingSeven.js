import React from "react";
import logo from "./asset/logo-with-text.webp";
import img from "./asset/Group-1170-2.webp";
import img2 from "./asset/Group 1172.webp";
import bgImg from "./asset/Group 1304.svg"
import "./LandingSeven.css";

function LandingFour() {
    return (
        <main id="landingFour">
            <div className="container-landing">
                <div className="left">
                    <div className="container-logo">
                        <img src={logo} alt="logo" className="logo" width="150" height="145" />
                    </div>
                    <div className="content">
                        <h1>The best way to learn is by teaching someone else!</h1>
                        <p>
                            Reinforce what you have learned by teaching your juniors. Create a
                            course at Beyondexams and share it with young children around you
                        </p>
                        <div className="landingFour-btn">
                            <input
                                type="text"
                                placeholder="Enter your email address"
                            />
                            <button>Get started</button>
                        </div>
                    </div>
                </div>
                <div className="right bg-screen">
                    <img src={img} alt="" className="image" />
                </div>
                <div className="right sm-screen">
                    <img src={img2} alt="" className="image" />
                </div>
                <img src={bgImg} alt="" className="shape-image" />
            </div>
        </main>
    );
}

export default LandingFour;
