import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

export default function CustomizedMenus(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div id="chat-dropdown">
      <IconButton edge="end" aria-haspopup="true" onClick={handleClick}>
        <ExpandMoreIcon style={{ color: "white" }} />
      </IconButton>
      <StyledMenu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {props.chat_data.map((e) => (
          <MenuItem
            key={e.id}
            onClick={() => {
              handleClose();
              props.history.push(`/dashboard/classroom/${e.title.replace(/ /g, "-")}/${e.id}`);
            }}
          >
            <ListItemIcon>
              <img className="chat-dropdown-img" src="https://images.indianexpress.com/2019/10/study1.jpg" alt="" />
            </ListItemIcon>
            <ListItemText primary={e.title} />
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}
