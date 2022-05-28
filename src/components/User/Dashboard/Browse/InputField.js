import React from "react";
import InfoIcon from "../../../../assets/images/icons/alert-circle-colored.svg";
import Tooltip from "@material-ui/core/Tooltip";

const InputField = (props) => {
  const inputContainer = {
    display: "flex",
    flexDirection: "column",
  };
  return (
    <div style={inputContainer}>
      <label className="input-label" id="course">
        Name of the course<span style={{ color: "#FF0000" }}>*</span>
        <Tooltip title="Give your course a unique name users can relate to." arrow enterTouchDelay={1}>
          <img src={InfoIcon} alt="" />
        </Tooltip>
      </label>
      <input
        type="text"
        id="course"
        name="course"
        required
        className="input-text"
        onChange={(e) => props.onValue(e.target.value)}
        value={props.value}
      />
    </div>
  );
};

export default InputField;
