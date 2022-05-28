import React, { useState } from "react";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import InputBox from "./InputBox";
import { ReactComponent as Upvote } from "../../../../../../assets/images/icons/upvote.svg";
import { ReactComponent as Downvote } from "../../../../../../assets/images/icons/downvote.svg";
import { useHistory } from "react-router-dom";

function AnswerContainer(props) {
  const [isOpen, setIsOpen] = useState(false);
  const history = new useHistory();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
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

  const visitProfile = (e) => {
    history.push(`/dashboard/profile/${props.answer.user.slug}`);
  };

  return (
    <>
      <div className="Ans-comment-container">
        <div className="note-profile-image-two QA-comment-img" onClick={visitProfile}>
          <img alt="" src={props.answer.user.avatar} />
        </div>

        <p className="QA-comment-user" onClick={visitProfile}>
          {props.answer.user.name} - 3 months ago
        </p>
        <MoreVertIcon
          className="QA-comment-opt"
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        />
        <div className="Ans-comment-pdf">
          <p className="ans-para">{props.answer.title}</p>
          <div>
            <div className="QA-comment-pdf-upvote">
              <Upvote color="#686868" onClick={() => props.handleUpvote(props.answer.id, 1)} />
              {props.answer.total_upvote - props.answer.total_downvote}
              <Downvote color="#686868" onClick={() => props.handleUpvote(props.answer.id, -1)} />
            </div>
            <span onClick={() => setIsOpen(!isOpen)} className={isOpen ? "primaryColor" : ""}>
              Reply
            </span>
          </div>
        </div>
      </div>

      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal placement="left-start">
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps}>
            <div className="drop-list">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={false} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem
                    onClick={(e) => {
                      handleClose(e);
                      props.deleteAnswer(props.answer.id);
                    }}
                  >
                    <DeleteOutlineOutlinedIcon className="menuIcon" /> Delete
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <FlagOutlinedIcon className="menuIcon" /> Report
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ShareIcon className="menuIcon" /> Share
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper>

      {isOpen ? (
        <div className="QuesInput-grid">
          <InputBox />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default AnswerContainer;
