import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // const handleChange = (e) => {
  //   console.log(e.target.value);
  // };
  return (
    <>
      <div onClick={handleClick} className="profile-class-dropdown flex-column">
        <div className="profile-class-top flex space-around">
          <p>Class</p>
          <ExpandMoreIcon />
        </div>
        <h1 className="flex flex-grow">-</h1>
      </div>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Class I</MenuItem>
        <MenuItem onClick={handleClose}>Class II</MenuItem>
        <MenuItem onClick={handleClose}>Class III</MenuItem>
        <MenuItem onClick={handleClose}>Class IV</MenuItem>
        <MenuItem onClick={handleClose}>Class V</MenuItem>
        <MenuItem onClick={handleClose}>Class VI</MenuItem>
        <MenuItem onClick={handleClose}>Class VII</MenuItem>
        <MenuItem onClick={handleClose}>Class VIII</MenuItem>
        <MenuItem onClick={handleClose}>Class IX</MenuItem>
        <MenuItem onClick={handleClose}>Class X</MenuItem>
        <MenuItem onClick={handleClose}>Class XI</MenuItem>
        <MenuItem onClick={handleClose}>Class XII</MenuItem>
      </Menu>
    </>
  );
}
