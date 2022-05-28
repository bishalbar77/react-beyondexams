import React from "react";
import "../../../../../../../assets/css/User/Dashboard/ReadingMaterial.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import FlagIcon from "@material-ui/icons/Flag";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { useHistory } from "react-router-dom";
import Share from "../../../Share";
import ShareIcon from "@material-ui/icons/Share";

const PDF = (props) => {
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const history = new useHistory();

  const handleToggle = (e) => {
    e.stopPropagation();
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  React.useEffect(() => {
    if (parseInt(props.slug.rm_slug) === props.material.id) {
      const offset =
        window.scrollY + document.getElementById("rm_slug_" + props.material.id).getBoundingClientRect().top - 160;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, []);

  const handleClickFile = () => {
    window.open(props.material.url);
  };

  const visitProfile = (e) => {
    e.stopPropagation();
    history.push(`/dashboard/profile/${props.material.user.slug}`);
  };
  const handleClick = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };
  let url = new URL(window.location.href);
  url.searchParams.set("rm_slug", props.material.id);
  let share = url.href;
  return (
    <div className="container" onClick={handleClickFile} id={"rm_slug_" + props.material.id}>
      <div className="reading-container">
        {/* <Link to={`/dashboard/profile/${timeStampedNotes[0].user.slug}`}> */}
        <div className="note-profile-image-two reading-img" onClick={visitProfile}>
          <img alt="" src={props.material.user.avatar} />
        </div>
        {/* </Link> */}
        <p className="reading-user" onClick={visitProfile}>
          {props.material.user.name}
        </p>
        <MoreVertIcon
          className="reading-opt"
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        />
        <div className="reading-pdf video-list-color">
          <div className="left">
            <div className="icon-container">
              {props.material.image_url ? (
                <img src={props.material.image_url} alt="" />
              ) : (
                <NoteAddIcon className="icon" />
              )}
            </div>
            <div className="right">
              <h3>{props.material.title}</h3>
              <div>
                <p>{props.material.size}</p>
                {/* <p>|</p>
                <p>18 pages</p> */}
              </div>
            </div>
          </div>
          <div className="right right-align">
            <p>{props.material.created_at?.split(" ")[0]}</p>
            <p>{props.material.type}</p>
          </div>
        </div>
      </div>

      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal placement="left-start">
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <div className="drop-list">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={handleClose}>
                    <FlagIcon className="menuIcon" /> Report
                  </MenuItem>
                  {localStorage.getItem("phoenix_user_id") === props.material.user.id.toString() && (
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose(e);
                        props.deleteMaterial(props.material.id);
                      }}
                    >
                      <DeleteOutlineIcon className="menuIcon" /> Delete
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleClick}>
                    <ShareIcon className="menuIcon" /> Share
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper>
      {isOpen && (
        <Share
          share={share}
          title={props.material.title}
          open={isOpen}
          close={() => {
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default PDF;
