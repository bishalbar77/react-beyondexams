import React, { Component } from "react";
import { withRouter } from "react-router";
// import { Link } from "react-router-dom";
// import { getLocal, setLocal } from "../../../common/localStorageAccess";

// import Illustration from "../../../../assets/images/icons/chat-illustration.png";

class UserLeftPane extends Component {
  state = {
    isCollapsed: false,
    open: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };
  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };
  dateHandler = (date) => {
    let curr = date.split(" ")[0];
    var d = new Date(date);
    var now = new Date();
    let diff = (now.getTime() - d.getTime()) / 3600000; //hours
    if (diff < 24 && d.getDate() === now.getDate()) {
      return "TODAY";
    } else if (diff < 48 && now.getDate() - 1 === d.getDate()) {
      return "YESTERDAY";
    } else return curr.split("-").reverse().join("/");
  };

  render() {
    return (
      <>
        <div className={"LeftChatContainer " + (this.props.status == 1 ? "LeftChatContainerFull" : "no_chats")}>
          <div>
            <div className="active-conversations">
              <p>Courses</p>
              <div className="all-chats">
                {this.props.single_chat.mentor_status >= 1 && (
                  <>
                    {this.props.chat_data.map((elmt) => {
                      console.log(elmt.chat);
                      if (!elmt.chat.is_support)
                        return (
                          <div
                            key={elmt.id}
                            className="active-conversations-list"
                            onClick={() => {
                              this.props.history.push(`/chat/${elmt.chat.title}/${elmt.chat.category_id}`);
                            }}
                          >
                            <img
                              src={
                                elmt.chat.category?.image_url ??
                                "https://api.beyondexams.org/images/instgram%20profile.jpg"
                              }
                              alt=""
                            />
                            <div className="flex-grow">
                              <h6>{elmt.chat.title}</h6>
                              <p>
                                {elmt.chat?.category?.user_actions?.length > 0 &&
                                elmt.chat?.category?.user_actions[0]?.pivot?.is_enrolled
                                  ? "Enrolled"
                                  : ""}
                              </p>
                            </div>
                            <span>{elmt.chat?.updated_at ? this.dateHandler(elmt.chat.updated_at) : "Today"}</span>
                          </div>
                        );
                    })}
                  </>
                )}
              </div>
            </div>
            {/* <div className="active-conversations-illustration">
              <img src={Illustration} alt="" />
            </div> */}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(UserLeftPane);
