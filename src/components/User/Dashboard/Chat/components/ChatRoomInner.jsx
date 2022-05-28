import { IconButton } from "@material-ui/core";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Linkify from "react-linkify";

class MentorChatRoomInner extends Component {
  state = {
    show: false,
    showChat: this.props.handleChat.chat[0]?.id != -1 ? true : false,
  };

  timeHandler = (time) => {
    let times = time.split(" ")[1];
    times = times.split(":");
    let hours = times[0];
    let minutes = times[1];
    return `${hours}:${minutes}`;
  };

  mimetype = (url) => {
    let urlBreak = url.split(".");
    let extension = urlBreak[urlBreak.length - 1];
    if (extension === "m4a") {
      extension = "x-m4a";
    }
    return extension;
  };
  dateHandler = (index, date, prevDate) => {
    let curr = date.split(" ")[0];
    var d = new Date(date);
    var now = new Date();
    let diff = (now.getTime() - d.getTime()) / 3600000; //hours
    if (index < this.props.handleChat.chat.length - 1) {
      let pre = prevDate.split(" ")[0];
      if (curr !== pre) {
        if (diff < 24 && d.getDate() === now.getDate()) {
          return "TODAY";
        } else if (diff < 48 && now.getDate() - 1 === d.getDate()) {
          return "YESTERDAY";
        } else return curr.split("-").reverse().join("/");
      } else {
        return "";
      }
    } else if (diff < 24 && d.getDate() === now.getDate()) {
      return "TODAY";
    } else if (diff < 48 && now.getDate() - 1 === d.getDate()) {
      return "YESTERDAY";
    } else return curr.split("-").reverse().join("/");
  };
  chatColor = (id) => {
    let num = id % 4;
    if (num === 0) {
      return "chat-color-yellow";
    } else if (num === 1) {
      return "chat-color-red";
    } else if (num === 2) {
      return "chat-color-blue";
    } else return "chat-color-green";
  };
  handleScroll = (e) => {
    if (e.currentTarget.scrollTop < -100) {
      this.setState({ show: true });
    } else {
      this.setState({ show: false });
    }
  };
  chatToBottom = () => {
    let e = document.getElementById("chat-container-inner");
    e.scrollTop = e.scrollHeight;
  };
  componentDidMount = () => {
    if (!this.state.showChat) {
      setTimeout(() => {
        this.setState({ showChat: true });
      }, 2000);
    }
  };
  render() {
    if (!this.props.handleChat.isLoaded) {
      return <></>;
    }

    return (
      <>
        <div className="chat-container-inner" id="chat-container-inner" onScroll={this.handleScroll}>
          <InfiniteScroll
            dataLength={this.props.handleChat.chat.length}
            next={this.props.handleScroll}
            style={{
              display: "flex",
              flexDirection: "column-reverse",
            }} //To put endMessage and loader to the top.
            inverse={true}
            hasMore={true}
            // loader={
            //   <div style={{ textAlign: "center", margin: "5px" }}>
            //     Loading...
            //   </div>
            // }
            scrollableTarget="chat-container-inner"
          >
            {this.props.handleChat.chat.length !== 0 ? (
              this.state.showChat ? (
                <>
                  {this.props.handleChat.chat.map((elmt, index, arr) => (
                    <div key={`chat-${index}`}>
                      {((index < this.props.handleChat.chat.length - 1 &&
                        arr[index + 1].created_at.split(" ")[0] !== elmt.created_at.split(" ")[0]) ||
                        index === this.props.handleChat.chat.length - 1) && (
                        <div className="chat-date">
                          {this.dateHandler(index, elmt.created_at, arr[index + 1]?.created_at)}
                        </div>
                      )}
                      {elmt.message === "" ? null : (
                        <>
                          <div
                            className={`chat-box ${
                              elmt.sender.id === parseInt(localStorage.getItem("phoenix_user_id"))
                                ? "chat-right"
                                : "chat-left"
                            }`}
                          >
                            {((index < this.props.handleChat.chat.length - 1 &&
                              arr[index + 1].sender.id !== elmt.sender.id) ||
                              index === this.props.handleChat.chat.length - 1) && (
                              <div className="chat-inner-img">
                                <img src={elmt.sender.avatar} alt="img" />
                              </div>
                            )}
                            <div>
                              {parseInt(elmt.type_id) === 1 ? (
                                <div
                                  className={
                                    (index < this.props.handleChat.chat.length - 1 &&
                                      arr[index + 1].sender.id !== elmt.sender.id) ||
                                    index === this.props.handleChat.chat.length - 1
                                      ? "chat-box-container-left " + this.chatColor(elmt.sender.id)
                                      : `chat-box-container-left ${this.chatColor(elmt.sender.id)} ${
                                          elmt.sender.id === parseInt(localStorage.getItem("phoenix_user_id"))
                                            ? "chat-margin-right"
                                            : "chat-margin-left"
                                        }`
                                  }
                                >
                                  {((index < this.props.handleChat.chat.length - 1 &&
                                    arr[index + 1].sender.id !== elmt.sender.id) ||
                                    index === this.props.handleChat.chat.length - 1) && (
                                    <div className={"chat-box-name-row "}>
                                      <p> {elmt.sender.name}</p>
                                      <div className="chat-box-time">{this.timeHandler(elmt.created_at)}</div>
                                    </div>
                                  )}
                                  <div style={{ display: "flex" }}>
                                    <span style={{ flex: 1 }}>
                                      <Linkify>{elmt.message}</Linkify>
                                    </span>
                                    {!(
                                      (index < this.props.handleChat.chat.length - 1 &&
                                        arr[index + 1].sender.id !== elmt.sender.id) ||
                                      index === this.props.handleChat.chat.length - 1
                                    ) && (
                                      <div className="chat-box-time time-inline ">
                                        {this.timeHandler(elmt.created_at)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : null}
                              {parseInt(elmt.type_id) === 5 ? (
                                <div
                                  className={
                                    (index < this.props.handleChat.chat.length - 1 &&
                                      arr[index + 1].sender.id !== elmt.sender.id) ||
                                    index === this.props.handleChat.chat.length - 1
                                      ? "chat-box-container-left " + this.chatColor(elmt.sender.id)
                                      : `chat-box-container-left ${this.chatColor(elmt.sender.id)} ${
                                          elmt.sender.id === parseInt(localStorage.getItem("phoenix_user_id"))
                                            ? "chat-margin-right"
                                            : "chat-margin-left"
                                        }`
                                  }
                                >
                                  <div className={"chat-box-name-row "}>
                                    <p> {elmt.sender.name}</p>
                                    <div className="chat-box-time">{this.timeHandler(elmt.created_at)}</div>
                                  </div>
                                  <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={
                                      "https://api.beyondexams.org/classroom_assets/" +
                                      this.props.title +
                                      "/" +
                                      elmt.message.split("/")[1]
                                    }
                                  >
                                    <InsertDriveFileIcon
                                      style={{
                                        color: "grey",
                                        fontSize: "32px",
                                        marginRight: "5px",
                                        verticalAlign: "bottom",
                                        marginLeft: "-5px",
                                      }}
                                    />
                                    {elmt.message}
                                  </a>
                                </div>
                              ) : null}
                              {parseInt(elmt.type_id) === 2 ? (
                                <div
                                  className={
                                    (index < this.props.handleChat.chat.length - 1 &&
                                      arr[index + 1].sender.id !== elmt.sender.id) ||
                                    index === this.props.handleChat.chat.length - 1
                                      ? "chat-box-container-left " + this.chatColor(elmt.sender.id)
                                      : `chat-box-container-left ${this.chatColor(elmt.sender.id)} ${
                                          elmt.sender.id === parseInt(localStorage.getItem("phoenix_user_id"))
                                            ? "chat-margin-right"
                                            : "chat-margin-left"
                                        }`
                                  }
                                >
                                  <div className={"chat-box-name-row "}>
                                    <p> {elmt.sender.name}</p>
                                    <div className="chat-box-time">{this.timeHandler(elmt.created_at)}</div>
                                  </div>
                                  <a target="_blank" rel="noopener noreferrer" href={elmt.message}>
                                    <div
                                      style={{
                                        backgroundImage: `url(${elmt.message})`,
                                      }}
                                      className="file-image-chat-inner"
                                    />
                                  </a>
                                </div>
                              ) : null}

                              {parseInt(elmt.type_id) === 4 ? (
                                <div
                                  className={
                                    (index < this.props.handleChat.chat.length - 1 &&
                                      arr[index + 1].sender.id !== elmt.sender.id) ||
                                    index === this.props.handleChat.chat.length - 1
                                      ? "chat-box-container-left " + this.chatColor(elmt.sender.id)
                                      : `chat-box-container-left ${this.chatColor(elmt.sender.id)} ${
                                          elmt.sender.id === parseInt(localStorage.getItem("phoenix_user_id"))
                                            ? "chat-margin-right"
                                            : "chat-margin-left"
                                        }`
                                  }
                                >
                                  <div className={"chat-box-name-row "}>
                                    <p> {elmt.sender.name}</p>
                                    <div className="chat-box-time">{this.timeHandler(elmt.created_at)}</div>
                                  </div>
                                  <audio controls className="chat-audio-player">
                                    <source src={elmt.message} />
                                  </audio>
                                </div>
                              ) : null}
                              {parseInt(elmt.type_id) === 3 ? (
                                <div
                                  className={
                                    (index < this.props.handleChat.chat.length - 1 &&
                                      arr[index + 1].sender.id !== elmt.sender.id) ||
                                    index === this.props.handleChat.chat.length - 1
                                      ? "chat-box-container-left " + this.chatColor(elmt.sender.id)
                                      : `chat-box-container-left ${this.chatColor(elmt.sender.id)} ${
                                          elmt.sender.id === parseInt(localStorage.getItem("phoenix_user_id"))
                                            ? "chat-margin-right"
                                            : "chat-margin-left"
                                        }`
                                  }
                                >
                                  <div className={"chat-box-name-row "}>
                                    <p> {elmt.sender.name}</p>
                                    <div className="chat-box-time">{this.timeHandler(elmt.created_at)}</div>
                                  </div>
                                  <a target="_blank" rel="noopener noreferrer" href={elmt.message}>
                                    <video controls className="file-video-chat-inner">
                                      <source
                                        src={elmt.message}
                                        // type={`video/${this.mimetype(
                                        //   elmt.message.split("/")[1]
                                        // )}`}
                                      />
                                    </video>
                                  </a>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </>
              ) : this.props.handleChat.chat[0].id == -1 ? (
                <h6 style={{ color: "#888" }}>Beyondexams is typing...</h6>
              ) : (
                <></>
              )
            ) : (
              <>
                <h6 style={{ color: "#888" }}>This chat is empty</h6>
              </>
            )}
            {/* End */}
          </InfiniteScroll>
        </div>
        {this.state.show && (
          <IconButton onClick={this.chatToBottom} className="chat-scroll-down">
            <KeyboardArrowDownIcon fontSize="small" />
          </IconButton>
        )}
      </>
    );
  }
}

export default MentorChatRoomInner;
