import React from "react";
import InfoIcon from "../../../../assets/images/icons/alert-circle-colored.svg";
import Tooltip from "@material-ui/core/Tooltip";

const TextArea = (props) => {
  const inputContainer = {
    display: "flex",
    flexDirection: "column",
  };
  return (
    <div style={inputContainer}>
      <label className="input-label" for="description">
        Description<span style={{ color: "#FF0000" }}>*</span>
        <Tooltip
          enterTouchDelay={1}
          title="This is important! Most users don't open courses with empty description!"
          arrow
        >
          <img src={InfoIcon} alt="" />
        </Tooltip>
      </label>
      <textarea
        type="text"
        id="description"
        name="description"
        required
        className="input-text"
        style={{ borderRadius: 20 }}
        rows="3"
        onChange={(e) => props.onValue(e.target.value)}
        value={props.value}
      />
    </div>
  );
};

export default TextArea;
