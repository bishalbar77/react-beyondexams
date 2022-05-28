import CircularProgress from "@material-ui/core/CircularProgress";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import React, { Component } from "react";
import io from "socket.io-client";
import swal from "sweetalert";
import "../../../../assets/css/User/Dashboard/onGoingChat.css";
import Attach from "../../../../assets/images/icons/attach.png";
import Emoji from "../../../../assets/images/icons/emoji.png";
import baseDomain from "../../../common/baseDomain";
import Footer from "../../../common/Footer";
import { getLocal, setLocal } from "../../../common/localStorageAccess";
import MetaHelmet from "../../../common/MetaHelmet";
import ChatDropDown from "./ChatDropDown";
import ChatLeftPane from "./ChatLeftPane";
import ChatRoomInner from "./components/ChatRoomInner";
import FileChooser from "./components/FileChooser";
import DragAndDrop from "./components/fileDragDrop";
import moment from "moment";
import DrawerRight from "./DrawerRight";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ImageImg from "./images/png.png";
import VideoImg from "./images/video_file.png";
import MusicImg from "./images/audio_file.png";
import FileImg from "./images/doc.png";

const socket = io();
class Chat extends Component {
  constructor(props) {
    super(props);
    this.scrollElement = React.createRef();
  }
  state = {
    filetype: "",
    loading: true,
    isDrawerOpen: false,
    selected: 0,
    isFileOpened: 0,
    chat_end: 0, //0=>More Loading on Scroll else no loader
    chat_data: [],
    chat_message: {
      moreLoaded: true,
      isLoaded: false,
      chat: [],
    },
    message: "",
    single_chat: {
      chat_id: -1,
      isChatLoaded: 0,
      mentor_status: 0,
      user_name: "",
    },
    userLeftNav: {
      page: 0,
    },
    mentorLeftNav: {
      page: 0,
    },
    isCollapsed: false,
    isOpened: false,
    // mentor_status: 0  => No mentor Assigned
    // mentor_status: 1  => Mentor Assigned. But no chat selected
    // mentor_status: 2  => Chat selected,

    // isChatLoaded: 0,  => No Chat Loaded
    // isChatLoaded: 1,  => Chat Loaded
    // isChatLoaded: 2,  => Loader
  };

  initial_page = 1;

  createChat = async (chat_id, page) => {
    if (chat_id == -1) {
      let data = [
        {
          chat_id: -1,
          created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
          id: -1,
          message: "How may I help you?",
          sender: {
            id: 568,
            name: "Beyondexams",
            avatar: "https://api.beyondexams.org/images/instgram%20profile.jpg",
          },
          sender_id: 568,
          type_id: 1,
        },
        {
          chat_id: -1,
          created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
          id: -1,
          message: "Hi ",
          sender: {
            id: 568,
            name: "Beyondexams",
            avatar: "https://api.beyondexams.org/images/instgram%20profile.jpg",
          },
          sender_id: 568,
          type_id: 1,
        },
      ];

      let chats = this.state.chat_message.chat.concat(data);
      this.setState({
        chat_message: {
          moreLoaded: false,
          isLoaded: true,
          chat: chats,
        },
        loading: false,
      });
      await axios
        .get(`${baseDomain.route}${baseDomain.subRoute}/get_course_community_messages?category_id=${chat_id}`, {
          headers: {
            Authorization: `Bearer ${getLocal("access_token")}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log(res.data.data.data);
          this.setState({
            chat_message: {
              moreLoaded: true,
              isLoaded: true,
              chat: data.concat(res.data.data.data),
            },
            loading: false,
          });
          console.log(data.concat(res.data.data.data));
          // this.refs.scrollElement.scrollTop = this.refs.scrollElement.scrollHeight;
          // this.changeFocus();
        });
    } else {
      await axios
        .get(`${baseDomain.route}${baseDomain.subRoute}/get_course_community_messages?category_id=${chat_id}`, {
          headers: {
            Authorization: `Bearer ${getLocal("access_token")}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log(res.data.data.data);
          this.setState({
            chat_message: {
              moreLoaded: true,
              isLoaded: true,
              chat: res.data.data.data,
            },
            loading: false,
          });
          // this.refs.scrollElement.scrollTop = this.refs.scrollElement.scrollHeight;
          // this.changeFocus();
        });
    }
  };

  startChat = (id, user_name, desc) => {
    this.setState({ chat_end: 0 });
    setTimeout(() => {
      console.log(this.state.chat_data[this.state.selected]);
      setLocal("chat_id", this.state.chat_data[this.state.selected]?.chat_id);
    }, 1);

    this.initial_page = 1;
    if (this.state.single_chat.chat_id === id) {
      return null;
    } else {
      this.setState({
        single_chat: {
          chat_id: id,
          isChatLoaded: 2,
          mentor_status: 2,
          user_name: user_name,
          desc: desc,
        },
        chat_message: {
          moreLoaded: true,
          isLoaded: false,
          chat: [],
        },
        // loading: false,
      });
      this.createChat(id, this.initial_page);
    }
  };

  addChats = async (chat_id, page) => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/get_course_community_messages?category_id=${chat_id}&page=${page}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json",
      },
    }).then((res) => {
      let new_chats = res.data.data.data;
      if (new_chats.length === 0) {
        return this.setState({ chat_end: 1 });
      }
      // let all_chats = [...new_chats, ...this.state.chat_message.chat];
      this.setState({
        chat_message: {
          moreLoaded: true,
          isLoaded: true,
          chat: this.state.chat_message.chat.concat(new_chats),
        },
        loading: false,
      });
    });
  };

  inputKeyPress = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.handleSendBtn();
    }
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  };

  toggleFile = (num) => {
    this.setState({ isFileOpened: num });
  };
  getDateTime = () => {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    if (day.toString().length == 1) {
      day = "0" + day;
    }
    if (hour.toString().length == 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length == 1) {
      minute = "0" + minute;
    }
    if (second.toString().length == 1) {
      second = "0" + second;
    }
    var dateTime = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
    return dateTime;
  };

  handleSendBtn = () => {
    let chat_message = this.state.message;
    if (chat_message.trim() !== "") {
      if (this.props.match.params.id != -1) {
        let formData = new FormData();
        formData.append("role_id", getLocal("role_id"));
        formData.append("category_id", this.props.match.params.id);
        formData.append("message", chat_message);
        if (localStorage.getItem("phoenix_user_id") == 1) {
          if (this.state.chat_message?.chat[0]?.sender_id) {
            formData.append("creator_id", this.state.chat_message.chat[0].sender_id);
          }
        }
        axios
          .post(`${baseDomain.route}${baseDomain.subRoute}/send_message`, formData, {
            headers: {
              Authorization: `Bearer ${getLocal("access_token")}`,
            },
          })
          .then(() => {
            return null;
          })
          .catch((err) => {});
      }
      let data = {
        message: chat_message,
        room: parseInt(this.props.match.params.id),
        chat_id: parseInt(this.props.match.params.id),
        created_at: this.getDateTime(),
        id: Math.random(),
        type_id: 1,
        updated_at: this.getDateTime(),
        sender: {
          id: parseInt(localStorage.getItem("phoenix_user_id")),
          name: localStorage.getItem("name"),
          role_id: parseInt(localStorage.getItem("role_id")),
          avatar: localStorage.getItem("avatar"),
        },
      };
      socket.emit("chatMessage", data);
      this.setState({ message: "" });
    }
  };

  handleScroll = async () => {
    this.initial_page++;
    await this.addChats(getLocal("chat_id"), this.initial_page);
  };
  handleFileType = (type, val) => {
    this.setState({ filetype: type, isFileOpened: val });
  };
  componentDidMount = async () => {
    let access = getLocal("access_token");
    if (!access) {
      swal("Unauthorized", "Please sign-in to continue", "warning", {
        buttons: true,
        dangerMode: true,
      }).then((ok) => {
        if (ok) {
          return (window.location.href = "/login");
        } else {
          return (window.location.href = "/");
        }
      });
    } else {
      //  this.addChatOnServiceWorker();

      // let formData = new FormData();
      // formData.append("role_id", getLocal("role_id"));
      if (this.props.match.params.id != null && this.props.match.params.id != -1) {
        socket.on("message", (data) => {
          // console.log(data);
          let chat_arr = [data, ...this.state.chat_message.chat];
          console.log("message ", chat_arr);
          this.setState({
            message: "",
            chat_message: {
              moreLoaded: true,
              isLoaded: true,
              chat: chat_arr,
            },
            loading: false,
          });
        });
        await axios({
          url: `${baseDomain.route}${baseDomain.subRoute}/create_course_chat`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            Accept: "application/json;charset=UTF-8",
          },
          data: {
            category_id: this.props.match.params.id,
          },
        }).catch((e) => {
          console.log(e.response);
        });
      }
      axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/get_all_chat_room`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getLocal("access_token")}`,
          Accept: "application/json",
        },
      }).then((res) => {
        console.log(res.data.data.data);
        let chat_data = [];
        if (res.data.data.data.length) {
          chat_data = res.data.data.data;
        }

        chat_data.unshift({
          chat: {
            id: "-1",
            title: "Beyondexams Support",
            category_id: "-1",
            category: {
              creator: { avatar: "https://api.beyondexams.org/images/instgram%20profile.jpg" },
              image_url: "https://api.beyondexams.org/images/instgram%20profile.jpg",
            },
          },
        });
        this.setState({
          single_chat: { mentor_status: 1 },
          chat_data: chat_data,
        });
        let params = this.props.match.params;
        if (params.id) {
          for (let i = 0; i < chat_data.length; i++) {
            if (chat_data[i].chat.category_id == params.id) {
              this.setState({ selected: i });
            }
          }
          this.startChat(params.id, params.className);
          socket.emit("joinRoom", { username: localStorage.getItem("name"), room: parseInt(params.id) });
        }

        // else if (!res.data.data.data.length) {
        //   this.setState({ single_chat: { mentor_status: 0 } });
        // }
      });
    }
  };

  toggleLeftNav = () => {
    this.setState({
      isOpened: !this.state.isOpened,
    });
  };

  LeftNavCollapsed = (bool) => {
    this.setState({
      isCollapsed: bool,
    });
  };
  toggleLeftNavCollapsed = () => {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    });
  };
  async componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ loading: true });
      let params = this.props.match.params;
      if (params.id) {
        for (let i = 0; i < this.state.chat_data.length; i++) {
          if (this.state.chat_data[i].chat.category_id == params.id) {
            this.setState({ selected: i });
          }
        }
        this.setState({ loading: true });
        socket.emit("leave");
        socket.emit("joinRoom", { username: localStorage.getItem("name"), room: parseInt(params.id) });
        this.startChat(params.id, params.className);
      } else {
        this.setState({ single_chat: { mentor_status: 1 } });
      }
    }
  }
  handleDrawerClose = () => {
    this.setState({ isDrawerOpen: false });
  };
  handleDrawerOpen = () => {
    this.setState({ isDrawerOpen: true });
  };
  handleChatBack = () => {
    this.props.history.push("/chat");
  };
  handleFileCheck = (files, type) => {
    let type_val = 0;
    const formData = new FormData();
    // formData.append("role_id", "1");
    //formData.append("sender_id", localStorage.getItem("user_id"));
    formData.append("chat_id", parseInt(localStorage.getItem("chat_id")));
    // formData.append("sender_name", localStorage.getItem("username"));
    formData.append("file", files[0]);
    if (type === "image/*") {
      type_val = 2;
    } else if (type === "video/*") {
      type_val = 3;
    } else if (type === "audio/*") {
      type_val = 4;
    } else if (type === ".doc,.docx,.pdf") {
      type_val = 5;
    }
    console.log(type_val);
    formData.append("type_id", type_val);
    swal({
      title: "Send File!",
      text: "Are you sure you want to send the current file?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios({
          url: `${baseDomain.route}${baseDomain.subRoute}/send_multimedia_message`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${getLocal("access_token")}`,
          },
          data: formData,
        }).then((response) => {
          let res = response.data.data;
          console.log(res);
          let data = {
            message: res.message,
            room: parseInt(this.props.match.params.id),
            chat_id: parseInt(this.props.match.params.id),
            created_at: this.getDateTime(),
            id: Math.random(),
            type_id: parseInt(res.type_id),
            updated_at: this.getDateTime(),
            sender: {
              id: parseInt(localStorage.getItem("phoenix_user_id")),
              name: localStorage.getItem("name"),
              role_id: parseInt(localStorage.getItem("role_id")),
              avatar: localStorage.getItem("avatar"),
            },
          };
          socket.emit("chatMessage", data);

          swal("Uploaded Successfully", "", "success");
        });
      } else {
        this.setState({ showSuccess: true });
        return null;
      }
    });
  };
  render() {
    let status = this.state.single_chat.mentor_status;
    return (
      <div className="scroll" style={{ flex: 1 }}>
        <MetaHelmet title="BeyondExams" description="Best educational videos on your fingertips. Start learning now!" />

        <div className="chat-page-grid">
          <ChatLeftPane
            single_chat={this.state.single_chat}
            startChat={this.startChat}
            chat_data={this.state.chat_data}
            leftNav={this.state}
            LeftNavCollapsed={this.LeftNavCollapsed}
            toggleLeftNav={this.toggleLeftNav}
            toggleLeftNavCollapsed={this.toggleLeftNavCollapsed}
            history={this.props.history}
            status={status}
          />
          <div className={"chat-container " + (status == 1 ? "no_chats" : "")}>
            {this.state.single_chat.mentor_status === 1 ? (
              <div className="chat-container-outer" id="chat-container-outer" key={this.state.single_chat.user_name}>
                {/* <div className="chat-header">
                  <div className="flex">
                    <img src="https://api.beyondexams.org/images/instgram%20profile.jpg" alt="" />
                    <h4>{this.state.single_chat.user_name}</h4>
                  </div> 
                  <div>
                    <ChatDropDown
                      startChat={this.startChat}
                      chat_data={this.state.chat_data}
                      history={this.props.history}
                    />
                  </div>
                </div> */}

                <div className="justifyCenter">Please Select a Chat.</div>
              </div>
            ) : null}
            {this.state.single_chat.mentor_status === 2 ? (
              <div className="chat-container-outer" ref="scrollElement" key={this.state.single_chat.user_name}>
                <div className="chat-header">
                  <IconButton onClick={this.handleChatBack}>
                    <ArrowBackIcon />
                  </IconButton>
                  <div className="flex pointer" onClick={this.handleDrawerOpen}>
                    <img
                      src={
                        this.state.chat_data[this.state.selected].chat.category?.image_url ??
                        "https://api.beyondexams.org/images/instgram%20profile.jpg"
                      }
                      alt=""
                    />
                    <h4>{this.state.single_chat.user_name}</h4>
                  </div>
                  {/* <div>
                    <ChatDropDown
                      startChat={this.startChat}
                      chat_data={this.state.chat_data}
                      history={this.props.history}
                    />
                  </div> */}
                </div>
                {!this.state.loading && (
                  <ChatRoomInner
                    chatEnd={this.state.chat_end}
                    handleChat={this.state.chat_message}
                    title={this.state.single_chat.user_name}
                    handleScroll={this.handleScroll}
                  />
                )}
              </div>
            ) : null}
            <div>
              {this.state.single_chat.mentor_status === 2 ? (
                <div className="send-messages-grid">
                  <input
                    type="text"
                    className="chat-input-field"
                    autoComplete="off"
                    value={this.state.message}
                    id="send-message-text"
                    onChange={this.handleChange}
                    name="message"
                    placeholder="Type your message here..."
                    onKeyUp={this.inputKeyPress}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "22px",
                      paddingTop: "7px",
                      position: "relative",
                    }}
                  >
                    {/* <div className="pointer">
                      <img src={Emoji} alt="Emoji" style={{ height: "15px" }} />
                    </div>*/}
                    <div className="pointer" onClick={() => this.toggleFile(1)}>
                      <img src={Attach} alt="Attach" style={{ height: "15px" }} />
                    </div>
                    {this.state.isFileOpened ? (
                      <ClickAwayListener onClickAway={() => this.toggleFile(0)}>
                        <div className="fileContainerOverlay">
                          <div>
                            {/* <span className="show_text">Image</span> */}
                            <input
                              accept="image/*"
                              type="file"
                              id="DropImg"
                              className="none"
                              onChange={(e) => {
                                this.handleFileCheck(e.target.files, "image/*");
                              }}
                            />
                            <label for="DropImg">
                              <img src={ImageImg} alt="jpg" width={55} />
                            </label>
                          </div>
                          <div>
                            <input
                              accept="video/*"
                              type="file"
                              id="DropImg"
                              className="none"
                              onChange={(e) => {
                                this.handleFileCheck(e.target.files, "video/*");
                              }}
                            />
                            <label for="DropImg">
                              <img src={VideoImg} alt="jpg" width={55} />
                            </label>
                          </div>
                          <div>
                            <input
                              accept="audio/*"
                              type="file"
                              id="DropImg"
                              className="none"
                              onChange={(e) => {
                                this.handleFileCheck(e.target.files, "audio/*");
                              }}
                            />
                            <label for="DropImg">
                              <img src={MusicImg} alt="jpg" width={55} />
                            </label>
                          </div>
                          <div>
                            <input
                              accept=".doc,.docx,.pdf"
                              type="file"
                              id="DropImg"
                              className="none"
                              onChange={(e) => {
                                this.handleFileCheck(e.target.files, ".doc,.docx,.pdf");
                              }}
                            />
                            <label for="DropImg">
                              <img src={FileImg} alt="jpg" width={55} />
                            </label>
                          </div>
                        </div>
                      </ClickAwayListener>
                    ) : null}
                    {/* <FileChooser handleFileType={this.handleFileType} /> */}
                    <div className="pointer" onClick={this.handleSendBtn}>
                      <SendIcon className="send-icon" />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          {this.state.isDrawerOpen && (
            <DrawerRight
              isDrawerOpen={this.state.isDrawerOpen}
              handleDrawerClose={this.handleDrawerClose}
              creator={this.state.chat_data[this.state.selected]}
            />
          )}
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default Chat;
