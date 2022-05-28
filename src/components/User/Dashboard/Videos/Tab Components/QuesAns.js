import React, { useState, useEffect } from "react";
import "../../../../../assets/css/User/Dashboard/QuesAns.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CommentContainer from "./QA Component/CommentContainer";
import AnswerContainer from "./QA Component/AnswerContainer";
import InputBox from "./QA Component/InputBox";
import axios from "axios";
import swal from "sweetalert";
import baseDomain from "../../../../common/baseDomain";
import { getLocal } from "../../../../common/localStorageAccess";

import { notify } from "../../../Navbar/notify";
import { ANSWER_KEYS, QUESTION_KEYS } from "../../Course/globalData";
import { NotificationPermission } from "../../../../common/common";
import NotificationAlert from "../../NotificationAlert/NotificationAlert";

function QuesAns(props) {
  const [level, setLevel] = useState(false);
  const [QnA, setQnA] = useState([]);
  const [question, setQuestion] = useState("");
  const [questionItem, setQuestionItem] = useState();
  const editorRef = React.useRef(null);

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const handleQuestionSubmit = async () => {
    let title = question.trim();
    setQuestion(title);
    if (title === "") return;

    // console.log(editorRef.current.getContent())

    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/add_video_query`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        video_url: props.id,
        title: title,
        video_timestamp: Date.now(),
        is_public: 1,
      },
    })
      .then((response) => {
        let res = response.data.data;
        console.log(res);
        setQuestion("");
        getQnA();
        // swal("Success", "Course added successfully", "success");
        notify(`🔑 You got ${QUESTION_KEYS} bonus keys for asking a question!`);
        // if (course_slug) {
        //   NotificationPermission(course_slug);
        // }
        setTimeout(() => {
          setIsNotificationModalOpen(true);
        }, 2500);
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };

  const handleNotify = () => {
    const query = new URLSearchParams(window.location.search);
    const course_slug = query.get("course");
    if (localStorage.getItem("access_token") && course_slug)
    {
      NotificationPermission(course_slug);
    }
    setIsNotificationModalOpen(false)
  }

  const handleUpvote = async (id, vote) => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/add_video_answer_vote`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        answer_id: id,
        vote: vote,
      },
    })
      .then((response) => {
        let res = response.data.data;
        console.log(res);
        getQnA();
        // swal("Success", "Course added successfully", "success");
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };

  const getQnA = async () => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/get_video_questions?video_url=${props.id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        let res = response.data.data;
        setQnA(res);
        if (questionItem) {
          res.forEach((e) => {
            if (e.id === questionItem.id) setQuestionItem(e);
          });
        }
        // swal("Success", "Course added successfully", "success");
      })
      .catch((e) => {
        console.log(e);
        // swal("Error", e.response.data.message, "error");
      });
  };

  const deleteQuestion = async (id) => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/remove_video_question?question_id=${id}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        getQnA();
        // swal("Success", "Course added successfully", "success");
      })
      .catch((e) => {
        console.log(e);
        // swal("Error", e.response.data.message, "error");
      });
  };

  const deleteAnswer = async (id) => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/remove_video_answer?answer_id=${id}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        getQnA();
        // swal("Success", "Course added successfully", "success");
      })
      .catch((e) => {
        console.log(e);
        // swal("Error", e.response.data.message, "error");
      });
  };

  const pinQuestion = async (id) => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/pin_video_question?question_id=${id}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        getQnA();
        // swal("Success", "Course added successfully", "success");
      })
      .catch((e) => {
        console.log(e);
        // swal("Error", e.response.data.message, "error");
      });
  };

  const getEditorContent = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  useEffect(() => {
    getQnA();
  }, [props.id]);

  return (
    <>
      <NotificationAlert
        isOpen={isNotificationModalOpen}
        setIsOpen={setIsNotificationModalOpen} 
        handleNotify={handleNotify}
      />
      {level === false ? (
        <CommentLvlOne
          handleLvl={() => setLevel(!level)}
          QnA={QnA}
          handleQuestionSubmit={handleQuestionSubmit}
          question={question}
          setQuestion={(value) => setQuestion(value)}
          setQuestionItem={(item) => setQuestionItem(item)}
          handleUpvote={handleUpvote}
          deleteQuestion={deleteQuestion}
          pinQuestion={pinQuestion}
          slug={props.slug}
          editorRef={editorRef}
        />
      ) : (
        <CommentLvlTwo
          handleLvl={() => setLevel(!level)}
          question={questionItem}
          getQnA={getQnA}
          handleUpvote={handleUpvote}
          deleteAnswer={deleteAnswer}
        />
      )}
    </>
  );
}

function CommentLvlOne({
  handleLvl,
  QnA,
  handleQuestionSubmit,
  question,
  setQuestion,
  setQuestionItem,
  handleUpvote,
  deleteQuestion,
  pinQuestion,
  slug,
  editorRef,
}) {
  const [filter, setFilter] = useState("Most answered");
  const [open, setOpen] = useState(null);

  // useEffect(() => {
  //   console.log(QnA);
  // }, [QnA]);

  function handleDropDownClick(value) {
    setFilter(value);
    setOpen(null);
  }

  function handleDropDownClose() {
    setOpen(null);
  }

  return (
    <div className="QuesAns-container">

      <div className="key-info" style={{ transform: "translateX(62px)" }}>
        <p>Earn {QUESTION_KEYS} bonus key.</p>
      </div>
      <InputBox
        input={question}
        setInput={setQuestion}
        onSubmit={handleQuestionSubmit}
        placeholder={"enter question"}
        editorRef={editorRef}
      />

      {/* <div className="flex-column-start" style={{ marginLeft: "60px", zIndex: "2" }}>
        {QnA.length > 0 && (
          <>
            <div
              className="notes-dropdown"
              onClick={(e) =>
              {
                setOpen(e.currentTarget);
              }}
            >
              <div className="flex">
                <p style={{ fontSize: "12px" }}>{filter}</p>
                <ExpandMoreIcon style={{ fontSize: "18px" }} />
              </div>
            </div>
            <Popper open={Boolean(open)} anchorEl={open} role={undefined} transition disablePortal>
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <div className="drop-list">
                    <ClickAwayListener onClickAway={handleDropDownClose}>
                      <MenuList>
                        <MenuItem onClick={() => handleDropDownClick("All")}>All</MenuItem>
                        <MenuItem onClick={() => handleDropDownClick("Asked by me")}>Asked by me</MenuItem>
                        <MenuItem onClick={() => handleDropDownClick("Most answered")}>Most Answered</MenuItem>
                        <MenuItem onClick={() => handleDropDownClick("Least answered")}>Least Answered</MenuItem>
                        <MenuItem onClick={() => handleDropDownClick("Recently asked")}>Recently Asked</MenuItem>
                        <MenuItem onClick={() => handleDropDownClick("Popular")}>Popular</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </div>
                </Grow>
              )}
            </Popper>
          </>
        )}
      </div> */}

      {Array.isArray(QnA) &&
        QnA.map((e, i) => (
          <CommentContainer
            key={e.id}
            qna={e}
            handleLvl={handleLvl}
            setQuestionItem={setQuestionItem}
            handleUpvote={handleUpvote}
            deleteQuestion={deleteQuestion}
            pinQuestion={pinQuestion}
            slug={slug}
          />
        ))}
    </div>
  );
}

function CommentLvlTwo({ handleLvl, question, getQnA, handleUpvote, deleteAnswer }) {
  const [answer, setAnswer] = useState("");

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const handleAnswerSubmit = async () => {
    let title = answer.trim();
    setAnswer(title);
    if (title === "") return;

    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/add_video_query_answer`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        question_id: question.id,
        title: title,
      },
    })
      .then((response) => {
        let res = response.data.data;
        console.log(res);
        setAnswer("");
        getQnA();

        // swal("Success", "Course added successfully", "success");
        notify(`🔑 You got ${ANSWER_KEYS} bonus keys for answering a question!`);
        setTimeout(() => {
          setIsNotificationModalOpen(true);
        }, 2500);
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };

  const handleNotify = () => {
    const query = new URLSearchParams(window.location.search);
    const course_slug = query.get("course");
    if (localStorage.getItem("access_token") && course_slug)
    {
      NotificationPermission(course_slug);
    }
    setIsNotificationModalOpen(false)
  }

  return (
    <div className="LvlTwo-container">

      <NotificationAlert
        isOpen={isNotificationModalOpen}
        setIsOpen={setIsNotificationModalOpen} 
        handleNotify={handleNotify}
      />

      <p onClick={handleLvl}>
        <ArrowBackIosIcon /> Back to all questions
      </p>

      <div className="Ans-Container">
        <div className="note-profile-image">
          <img alt="" src={question.user.avatar} />
        </div>
        <h3>{question?.title}</h3>

        {question.answers.map((e, i) => (
          <AnswerContainer key={i} answer={e} handleUpvote={handleUpvote} deleteAnswer={deleteAnswer} />
        ))}
      </div>

      <div className="AnsInput">
        <div className="key-info" style={{ transform: "translateX(62px)" }}>
          <p>Earn {ANSWER_KEYS} bonus keys.</p>
        </div>
        <InputBox
          placeholder="enter answer"
          onSubmit={handleAnswerSubmit}
          input={answer}
          setInput={(value) => setAnswer(value)}
        />
      </div>
    </div>
  );
}

export default QuesAns;
