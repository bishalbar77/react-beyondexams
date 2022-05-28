import React, { useEffect } from "react";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import { useHistory } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import { ReactComponent as Upvote } from "../../../../../../assets/images/icons/upvote.svg";
import { ReactComponent as Downvote } from "../../../../../../assets/images/icons/downvote.svg";
import Share from "../../Share";
import LaunchIcon from "@material-ui/icons/Launch";

function CommentContainer({ handleLvl, qna, setQuestionItem, handleUpvote, deleteQuestion, pinQuestion, slug }) {
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [answer, setAnswer] = React.useState("");
  const history = new useHistory();

  React.useEffect(() => {
    if (qna.answers.length !== 0) setAnswer(qna.answers[0]);
  }, [qna]);

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
    history.push(`/dashboard/profile/${qna.user.slug}`);
  };
  useEffect(() => {
    if (parseInt(slug.qna_slug) === qna.id) {
      const offset = window.scrollY + document.getElementById("qna_slug_" + qna.id).getBoundingClientRect().top - 160;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, []);
  const handleClick = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };
  let url = new URL(window.location.href);
  url.searchParams.set("qna_slug", qna.id);
  let share = url.href;

  return (
    <>
      <div
        className={"QA-comment-container " + (qna.id === parseInt(slug.qna_slug) ? "qna-slug" : "")}
        id={"qna_slug_" + qna.id}
      >
        <div className="note-profile-image-two QA-comment-img" onClick={visitProfile}>
          <img alt="" src={qna.user.avatar} />
        </div>

        <p className="QA-comment-user" onClick={visitProfile}>
          {qna.user.name} - {qna.created_at}
        </p>
        <MoreVertIcon
          className="QA-comment-opt"
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        />
        <div className="QA-comment-pdf">
          <div className="QA-Title-Box">
            <h3>{qna.title}</h3>
            {qna.question_link && (
              <a href={qna.question_link} target="_blank">
                <LaunchIcon fontSize="small" />
              </a>
            )}
          </div>
          {answer && (
            <p>
              {answer.title.split("").length > 15
                ? `${answer.title.split(" ").splice(0, 13).join(" ")} ...`
                : answer.title}
            </p>
          )}
          <div>
            {answer && (
              <div className="QA-comment-pdf-upvote">
                <Upvote color="#686868" onClick={() => handleUpvote(answer.id, 1)} />
                {answer.total_upvote - answer.total_downvote}
                <Downvote color="#686868" onClick={() => handleUpvote(answer.id, -1)} />
              </div>
            )}
            <span
              onClick={() => {
                setQuestionItem(qna);
                handleLvl();
              }}
            >
              Answer {qna.answers.length}
            </span>
          </div>
        </div>
      </div>

      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal placement="left-start">
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <div className="drop-list">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={false} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  {localStorage.getItem("phoenix_user_id") === qna.user.id.toString() && (
                    <MenuItem
                      onClick={(e) => {
                        handleClose(e);
                        deleteQuestion(qna.id);
                      }}
                    >
                      <DeleteOutlineOutlinedIcon className="menuIcon" /> Delete
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={(e) => {
                      handleClose(e);
                      pinQuestion(qna.id);
                    }}
                  >
                    <CreateIcon className="menuIcon" /> {qna.is_pinned ? "Unpin" : "Pin"}
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <FlagOutlinedIcon className="menuIcon" /> Report
                  </MenuItem>
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
          title={qna.title}
          open={isOpen}
          close={() => {
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
}

export default CommentContainer;
