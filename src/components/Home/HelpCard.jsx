import React from "react";
// import Help1 from "../../assets/images/icons/help-1.png";

export default function HelpCard({ title, description, src }) {
  return (
    <div className="e105_41">
      <div className="e105_42">
        <div className="e105_43">
          <img src={src} alt=""></img>
        </div>
        <span className="e105_52">{title}</span>
        <div className="e105_53"></div>
        <span className="e105_54">{description}</span>
      </div>
    </div>
  );
}
