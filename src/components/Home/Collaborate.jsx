import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React from "react";
// import Collaborate1 from "../../assets/images/icons/collaborate1.png";
// import Collaborate2 from "../../assets/images/icons/collaborate2.png";
// import Collaborate3 from "../../assets/images/icons/collaborate3.png";
// import Collaborate4 from "../../assets/images/icons/collaborate4.png";
// import Collaborate5 from "../../assets/images/icons/collaborate5.png";
// import Collaborate6 from "../../assets/images/icons/collaborate6.png";
// import Collaborate7 from "../../assets/images/icons/collaborate7.png";
// import Collaborate8 from "../../assets/images/icons/collaborate8.png";
// import Collaborate9 from "../../assets/images/icons/collaborate9.png";
// import Collaborate10 from "../../assets/images/icons/collaborate10.png";
// import Collaborate11 from "../../assets/images/icons/collaborate11.png";

var jsonData = require("./home.json");

export default function Collaborate() {
  return (
    <div className="bg-color-gray">
      <div className="home-collaborate">
        <div className="spacing-2"></div>
        <h2>{jsonData.sectionHeading.collaboration}</h2>
        <div className="h_c_main collaborate_tabs">
          <Tabs variant="scrollable" value={false} scrollButtons="on" textColor="primary">
            <Tab
              label={
                <img
                  loading="lazy"
                  src={require(`../../assets/images/icons/${jsonData.images.collaborate1}`)}
                  alt=""
                ></img>
              }
              component="div"
              disableRipple
            />
            <Tab
              label={
                <img
                  loading="lazy"
                  src={require(`../../assets/images/icons/${jsonData.images.collaborate2}`)}
                  alt=""
                ></img>
              }
              component="div"
              disableRipple
            />
            <Tab
              label={
                <img
                  loading="lazy"
                  src={require(`../../assets/images/icons/${jsonData.images.collaborate3}`)}
                  alt=""
                ></img>
              }
              component="div"
              disableRipple
            />
            <Tab
              label={
                <img
                  loading="lazy"
                  src={require(`../../assets/images/icons/${jsonData.images.collaborate4}`)}
                  alt=""
                ></img>
              }
              component="div"
              disableRipple
            />
            <Tab
              label={
                <img
                  loading="lazy"
                  src={require(`../../assets/images/icons/${jsonData.images.collaborate5}`)}
                  alt=""
                ></img>
              }
              component="div"
              disableRipple
            />
            <Tab
              label={
                <img
                  loading="lazy"
                  src={require(`../../assets/images/icons/${jsonData.images.collaborate6}`)}
                  alt=""
                ></img>
              }
              component="div"
              disableRipple
            />
            <Tab
              label={
                <img
                  loading="lazy"
                  src={require(`../../assets/images/icons/${jsonData.images.collaborate7}`)}
                  alt=""
                ></img>
              }
              component="div"
              disableRipple
            />
            <Tab
              label={
                <img
                  loading="lazy"
                  src={require(`../../assets/images/icons/${jsonData.images.collaborate8}`)}
                  alt=""
                ></img>
              }
              component="div"
              disableRipple
            />
            <Tab
              label={
                <img
                  loading="lazy"
                  src={require(`../../assets/images/icons/${jsonData.images.collaborate9}`)}
                  alt=""
                ></img>
              }
              component="div"
              disableRipple
            />
            <Tab
              label={
                <img
                  loading="lazy"
                  src={require(`../../assets/images/icons/${jsonData.images.collaborate10}`)}
                  alt=""
                ></img>
              }
              component="div"
              disableRipple
            />
            <Tab
              label={
                <img
                  loading="lazy"
                  src={require(`../../assets/images/icons/${jsonData.images.collaborate11}`)}
                  alt=""
                ></img>
              }
              component="div"
              disableRipple
            />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
