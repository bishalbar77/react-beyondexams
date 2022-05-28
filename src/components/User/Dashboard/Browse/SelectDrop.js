import React, { useState } from "react";
import InfoIcon from "../../../../assets/images/icons/alert-circle-colored.svg";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import Beginner from "../../../../assets/images/icons/beginner.svg";
import Intermediate from "../../../../assets/images/icons/intermediate.svg";
import Advanced from "../../../../assets/images/icons/advanced.svg";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const SelectInput = withStyles((theme) => ({
  root: {
    "label + &": {},
  },
  input: {
    borderRadius: 38,
    position: "relative",
    backgroundColor: "#ffffff",
    border: "1px solid #686868",
    fontSize: 16,
    padding: "8px 26px 8px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 38,
      borderColor: "#6646E7",
      backgroundColor: "#ffffff",
      boxShadow: "0 0 0 3px #F1EDFF",
    },
  },
}))(InputBase);
const useStyles = makeStyles((theme) => ({
  customWidth: {
    maxWidth: 500,
  },
}));

const SelectDrop = (props) => {
  const [isShow, setIsShow] = useState(false);
  const [value, setValue] = useState(props.value);
  const classes = useStyles();

  const inputContainer = {
    display: "flex",
    flexDirection: "column",
  };
  return (
    <FormControl style={inputContainer}>
      <label className="input-label" id="course">
        {props.label}
        <span style={{ color: "#FF0000" }}>*</span>
        <Tooltip
          classes={{ tooltip: classes.customWidth }}
          placement="right"
          arrow
          enterTouchDelay={1}
          title={
            <div>
              Beginner = Anyone can easily go through the course.
              <br />
              Intermediate = Some knowledge of the domain is needed for best experience
              <br />
              Expert = Your course targets users who are well-versed with the domain
            </div>
          }
        >
          <img src={InfoIcon} alt="" />
        </Tooltip>
      </label>

      <Select
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={isShow}
        onClose={() => setIsShow(false)}
        onOpen={() => setIsShow(true)}
        value={value}
        onChange={(e) => {
          props.onValue(e.target.value);
          setValue(e.target.value);
        }}
        input={<SelectInput />}
        className="select-course"
      >
        <MenuItem value="0" className="select-option">
          <img src={Beginner} alt="" className="select-option-img" />
          Beginner
        </MenuItem>
        <MenuItem value="1" className="select-option">
          <img src={Intermediate} alt="" className="select-option-img" />
          Intermediate
        </MenuItem>
        <MenuItem value="2" className="select-option">
          <img src={Advanced} alt="" className="select-option-img" />
          Advanced
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default SelectDrop;
