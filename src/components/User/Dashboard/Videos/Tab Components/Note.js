import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IsolatedMenu } from "./NotesTab";
import { ReactComponent as Upvote } from "../../../../../assets/images/icons/upvote.svg";
import { ReactComponent as Downvote } from "../../../../../assets/images/icons/downvote.svg";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import swal from "sweetalert";
import { EditVideoNote, Vote } from "../../../../common/videocommon.js";

function Note({
  note,
  index,
  classes,
  handleAnnoDelete,
  annoArr,
  handleSeek,
  id,
  handleState,
  content,
  formatTime,
  bgColor,
  slug,
  share,
  title,
}) {
  const [votes, setVotes] = useState(
    note.total_vote ? note.total_vote.total_upvote - note.total_vote.total_downvote : 0
  );
  const [voter, setVoter] = useState({
    upvote: false,
    downvote: false,
  });
  const [noteAnno, setNoteAnno] = useState(note.annotation || "");

  // useEffect(() => {}, [voter]);

  // console.log("note props in note.js", note);

  const txtColor = (index) => {
    let num = index % 3;
    if (num === 0) {
      return "var(--color1)";
    } else if (num === 1) {
      return "var(--color3)";
    } else if (num === 2) {
      return "var(--color2)";
    }
  };

  const vote = async (id, value) => {
    let access = localStorage.getItem("access_token");
    if (!access) {
      swal("Unauthorized", "You are unauthorized. Sign-in to continue", "error", {
        buttons: true,
        dangerMode: true,
      }).then((ok) => {
        if (ok) {
          return (window.location.href = "/login");
        }
      });
    } else {
      const voty = await Vote(id, value);
      if (voty === "error") {
        if (value === 1) {
          setVoter({
            upvote: true,
            downvote: false,
          });
        } else if (value === -1) {
          setVoter({
            upvote: false,
            downvote: true,
          });
        }
      } else {
        // console.log("vote fetch return", voty);
        if (value === 1) {
          voter.downvote ? setVotes(votes + 2) : setVotes(votes + 1);
          setVoter({
            upvote: true,
            downvote: false,
          });
        } else if (value === -1) {
          voter.upvote ? setVotes(votes - 2) : setVotes(votes - 1);
          setVoter({
            upvote: false,
            downvote: true,
          });
        } else if (value === 0) {
          voter.upvote ? setVotes(votes - 1) : setVotes(votes + 1);
          setVoter({
            upvote: false,
            downvote: false,
          });
        }
      }
    }
  };

  // const handleDropDownClose = (index) => {
  //     handleState({
  //       open: null,
  //     });
  //   };
  // const  handleDropDownClick = (value) => {
  //     handleState({ isPublic: value });
  //     handleDropDownClose();
  //   };
  const editContent = async (id, content) => {
    handleState({ id: id, content: content });
  };
  const contentChange = (e) => {
    handleState({
      content: e.target.value,
    });
  };
  const editContentSubmit = async (event, id) => {
    event.preventDefault();
    swal("Note Updated", "Are you sure you want to update this note", "warning", {
      buttons: true,
    }).then(async (ok) => {
      if (ok) {
        const annoEdit = await EditVideoNote(id, content);
        if (annoEdit !== "error") setNoteAnno(content);
        handleState({ id: null, content: "" });
      }
    });
  };

  useEffect(() => {
    if (parseInt(slug.note_slug) === note.id) {
      const offset = window.scrollY + document.getElementById("note_slug_" + note.id).getBoundingClientRect().top - 160;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="flex" key={note.id} id={"note_slug_" + note.id}>
      <div
        style={{ marginTop: "10px" }}
        onClick={(e) => {
          e.stopPropagation();
          window.scrollTo({
            top: 50,
            left: 100,
            behavior: "smooth",
          });
          handleSeek(e, note.video_timestamp);
        }}
        className={"notes-list " + (parseInt(slug.note_slug) === note.id ? "qna-slug" : "")}
      >
        <Link to={`/dashboard/profile/${note.user.slug}`}>
          <div className="note-profile-image-two">
            <img alt="" src={note.user.avatar} />
          </div>
        </Link>
        {id === note.id ? (
          <div className="flex-grow">
            <Paper
              elevation={0}
              component="form"
              onSubmit={(event) => editContentSubmit(event, note.id)}
              className={`${classes.root} ${content ? classes.rootBgActive : classes.rootBg}`}
            >
              <p className="note-time-with-input-show">{formatTime(note.video_timestamp)}</p>
              <InputBase
                onChange={contentChange}
                multiline
                defaultValue={note.annotation}
                className={classes.input}
                onClick={(e) => e.stopPropagation()}
                required
              />
              <div className={`${classes.iconButtonDiv} ${content ? classes.BgActive : ""}`}>
                <IconButton
                  type="submit"
                  onClick={(e) => e.stopPropagation()}
                  className={content ? classes.IconButtonActive : classes.IconButton}
                >
                  <SendRoundedIcon fontSize="small" style={{ fontSize: "18px" }} />
                </IconButton>
              </div>
            </Paper>
          </div>
        ) : (
          <>
            <p className={"note-time " + bgColor(index)}>{formatTime(note.video_timestamp)}</p>
            <div>
              <div className="content note-text">{noteAnno}</div>
              <div className="video-vote">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    voter.upvote === false ? vote(note.id, 1) : vote(note.id, 0);
                  }}
                >
                  <Upvote color={voter.upvote ? txtColor(index) : "#686868"} />
                </IconButton>
                <p>{votes}</p>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    voter.downvote === false ? vote(note.id, -1) : vote(note.id, 0);
                  }}
                >
                  <Downvote color={voter.downvote ? txtColor(index) : "#686868"} />
                </IconButton>
              </div>
            </div>
          </>
        )}
      </div>

      <div key={note.id}>
        <IsolatedMenu
          note={note}
          classes={classes}
          editContent={editContent}
          annoArr={annoArr}
          handleAnnoDelete={handleAnnoDelete}
          share={share}
          title={title}
        />
      </div>
    </div>
  );
}

export default Note;
