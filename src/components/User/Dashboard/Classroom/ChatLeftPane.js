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

  render() {
    return (
      <>
        <div className="LeftChatContainer scroll">
          <div style={{ width: "280px", margin: "0 auto" }}>
            <div className="active-conversations">
              <p>e-classrooms</p>
              {this.props.single_chat.mentor_status >= 1 && (
                <>
                  {this.props.chat_data.map((elmt) => (
                    <div
                      key={elmt.id}
                      className="active-conversations-list"
                      onClick={() => {
                        this.props.history.push(`/dashboard/classroom/${elmt.title.replace(/ /g, "-")}/${elmt.id}`);
                        // this.props.startChat(elmt.id, elmt.title);
                      }}
                    >
                      <img src="https://images.indianexpress.com/2019/10/study1.jpg" alt="" />
                      <p>{elmt.title}</p>
                    </div>
                  ))}
                </>
              )}
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
