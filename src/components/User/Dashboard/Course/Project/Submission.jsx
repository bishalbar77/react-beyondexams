import React, { useState, useEffect } from "react";
import styles from "./Submission.module.css";
import ProfileUpload from "../../../../../assets/images/icons/profile-upload.png";
import Select from "@material-ui/core/Select";
import { MenuItem } from "@material-ui/core";
import { renderDate } from "../../Browse/CourseCard";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../../../common/common";

export default function Submission({ data, title }) {
  const [grade, setGrade] = useState(0);
  const dispatch = useDispatch();
  const getMenuItem = () => {
    let items = [];
    for (let i = 1; i <= 20; i++) {
      items.push(<MenuItem value={i * 5}>{i * 5} %</MenuItem>);
    }
    return items;
  };
  const handleChange = async (e) => {
    await Post(1, "evaluate_project_submission", {
      score: e.target.value,
      project_submission_slug: data.slug,
    }).then(() => {
      setGrade(e.target.value);
      dispatch({
        type: "SHOW_SUCCESS",
        message: "Grade Updated Successfully",
      });
    });
  };
  useEffect(() => {
    setGrade(data.score);
  }, [data]);
  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <div className={styles.avatar}>
          <img src={data.user.avatar} />
          <div />
        </div>

        <p className={styles.name}>
          {data.user.name}
          <br />
          <span>{renderDate(data.created_at)}</span>
        </p>
        <div className={styles.circle} />
        <p className={styles.project_title}>{title}</p>
      </div>
      <div className={styles.right}>
        <a href={data.url} download={data.title} target="_blank">
          <img src={ProfileUpload} alt="" style={{ transform: "rotate(180deg)" }} />
        </a>
        <Select
          value={grade}
          displayEmpty
          renderValue={grade !== 0 ? undefined : () => <strong>N/A</strong>}
          variant="outlined"
          className={styles.select}
          onChange={handleChange}
        >
          {getMenuItem()}
        </Select>
      </div>
    </div>
  );
}
