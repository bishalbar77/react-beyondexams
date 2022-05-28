import React from "react";
import UpArrow from "../../../../../assets/images/icons/up_grey.png";
import DownArrow from "../../../../../assets/images/icons/down_grey.png";
import "./Question.css";
import axios from "axios";
import swal from "sweetalert";
import baseDomain from "../../../../common/baseDomain";
import { getLocal } from "../../../../common/localStorageAccess";

const Question = ({ data, type, getData }) => {
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
        // swal("Success", "Course added successfully", "success");
        getData();
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };

  return (
    <div className="question_flex align_top question_container">
      <div className="question_type">{type}</div>
      <div>
        <p className="question_text">
          {data.title} <span>2d</span>
        </p>
        {type === "Answer" && (
          <div className="question_flex vote_container">
            <img src={UpArrow} onClick={() => handleUpvote(data.id, 1)} />
            <p>{data?.total_upvote - data?.total_downvote}</p>
            <img src={DownArrow} onClick={() => handleUpvote(data.id, -1)} />
            {/* <div className="question_answer">Answer</div> */}
          </div>
        )}
        {/* <p className="details">Introduction to geography</p>
        <div className="question_flex">
          <p className="details">Geography</p>
          <div className="question_dot"></div>
          <p className="details">Module 1</p>
        </div> */}
      </div>
    </div>
  );
};

export default Question;
