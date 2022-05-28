import React, { useState } from "react";
import InfoIcon from "../../../../assets/images/icons/alert-circle-colored.svg";
import Tooltip from "@material-ui/core/Tooltip";
const InputKeywords = (props) => {
  const inputContainer = {
    display: "flex",
    flexDirection: "column",
  };

  const [keys, setKeys] = useState(props.value);

  const handleValue = (value) => {
    props.onValue(value.split(","));
    setKeys(value.split(","));
    // if (value === "") {
    //   setValue("");
    //   return;
    // }
    // if (value[value.length - 1] === " ") {
    //   value = value.trim();
    //   if (value !== "") {
    //     let newKeys = [...keys, value];
    //     setKeys(newKeys);
    //     props.onValue(newKeys);
    //   }
    //   setValue("");
    // } else {
    //   setValue(value);
    // }
  };

  // const removeKey = (i) => {
  //   let newKeys = [...keys];
  //   newKeys.splice(i, 1);
  //   setKeys(newKeys);
  // };

  return (
    <div style={inputContainer}>
      <label className="input-label" id="course">
        Keywords<span style={{ color: "#FF0000" }}>*</span>
        <Tooltip
          // enterTouchDelay={0}
          arrow
          enterTouchDelay={1}
          placement="right"
          title="Add keywords which give users an idea about what your course is about"
        >
          <img src={InfoIcon} alt="" />
        </Tooltip>
      </label>
      <div
        // type="text"
        // id="course"
        // name="course"
        // required
        className="input-text keys-container"
      >
        {/* {keys.map((e, i) => (
          <div key={i} onClick={() => removeKey(i)}>
            {e}
          </div>
        ))} */}
        <input
          type="text"
          value={keys}
          onChange={(e) => handleValue(e.target.value)}
          className="keys-container"
          required
        />
      </div>
    </div>
  );
};

export default InputKeywords;
