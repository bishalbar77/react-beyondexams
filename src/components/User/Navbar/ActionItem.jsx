import React, { Component } from "react";
import Party from "../../../assets/images/icons/party.png";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import "./actionitem.css";

var jsonData = require("./nav.json");

export default class ActionItem extends Component {
  state = { student: true };
  render() {
    return (
      <div className={`a_i_m_div ${this.props.actionItem ? "" : "a_i_m_none"}`}>
        <div className="a_i_hr"></div>
        <p className="look_what">{jsonData.heading.actionItem}</p>
        <div className="action_mid">
          <div className="action_mid_top flex">
            <h4
              className={`${this.state.student ? "action_mid_top_active" : "action_mid_top_inactive"}`}
              onClick={(e) => {
                e.stopPropagation();
                this.setState({ student: true });
              }}
            >
              {jsonData.toggleBtns.student}
            </h4>
            <h4
              className={`${!this.state.student ? "action_mid_top_active" : "action_mid_top_inactive"}`}
              onClick={(e) => {
                e.stopPropagation();
                this.setState({ student: false });
              }}
            >
              {jsonData.toggleBtns.teacher}
            </h4>
          </div>
          {this.state.student ? (
            <div className="action_points">
              {this.props.data.student.student_details.badge.tasks.map((e, i) => (
                <div className="action_point" key={i}>
                  <div className={`ellipse${e.iscomplete ? " bg-color-blue" : ""}`}></div>
                  <Link to={e.task_url ? e.task_url : "/"}>{e.task}</Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="action_points">
              {this.props.data.educator.educator_details.badge.tasks.map((e, i) => (
                <div className="action_point " key={i}>
                  <div className={`ellipse${e.iscomplete ? " bg-color-blue" : ""}`}></div>
                  <Link to={e.task_url ? e.task_url : "/"}>{e.task}</Link>
                </div>
              ))}
            </div>
          )}
          <div className="action_bottom">
            {/* <img src={Party} width="18" height="18" alt=""></img> */}
            <div className="flex-column-start gap_10 width_full">
              <Link to="/dashboard/progression" className="width_full">
                <Button variant="outlined" size="small" color="primary" className="width_full">
                {jsonData.buttons.badges}
                </Button>
              </Link>
              {this.state.student ? (
                <Link to="/dashboard/student-leaderboard" className="width_full">
                  <Button variant="outlined" size="small" color="primary" className="width_full">
                  {jsonData.buttons.studentLeaderBoard}
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard/teacher-leaderboard" className="width_full">
                  <Button variant="outlined" size="small" color="primary" className="width_full">
                  {jsonData.buttons.teacherLeaderBoard}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
