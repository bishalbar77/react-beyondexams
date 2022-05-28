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

const socket = io();
class Chat extends Component {
  constructor(props) {
    super(props);
    this.scrollElement = React.createRef();
  }
  state = {
    filetype: "",
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

  createChat = (chat_id, page) => {
    axios
      .get(`${baseDomain.route}${baseDomain.subRoute}/get_whattsapp_chat_messages?chat_id=${chat_id}`, {
        headers: {
          Authorization: `Bearer ${getLocal("access_token")}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        this.setState({
          chat_message: {
            moreLoaded: true,
            isLoaded: true,
            chat: res.data.data.data,
          },
        });
        // this.refs.scrollElement.scrollTop = this.refs.scrollElement.scrollHeight;
        // this.changeFocus();
      });
  };

  startChat = (id, user_name, desc) => {
    this.setState({ chat_end: 0 });
    setLocal("chat_id", id);
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
      });
      this.createChat(id, this.initial_page);
    }
  };

  addChats = async (chat_id, page) => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/get_whattsapp_chat_messages?chat_id=${chat_id}&page=${page}`,
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
      let formData = new FormData();
      formData.append("role_id", getLocal("role_id"));
      formData.append("chat_id", this.props.match.params.id);
      formData.append("message", chat_message);
      axios
        .post(`${baseDomain.route}${baseDomain.subRoute}/send_message`, formData, {
          headers: {
            Authorization: `Bearer ${getLocal("access_token")}`,
          },
        })
        .then(() => {
          return null;
        })
        .catch((err) => {
          swal("Error", "Some Error Occured while sending message", err);
        });
      let data = {
        message: chat_message,
        room: parseInt(this.props.match.params.id),
        chat_id: parseInt(this.props.match.params.id),
        created_at: this.getDateTime(),
        id: Math.random(),
        type_id: 1,
        updated_at: this.getDateTime(),
        user: {
          id: parseInt(localStorage.getItem("phoenix_user_id")),
          name: localStorage.getItem("name"),
          role_id: parseInt(localStorage.getItem("role_id")),
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
  componentDidMount = () => {
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
      socket.on("message", (data) => {
        // console.log(data);
        let chat_arr = [data, ...this.state.chat_message.chat];
        console.log(chat_arr);
        this.setState({
          message: "",
          chat_message: {
            moreLoaded: true,
            isLoaded: true,
            chat: chat_arr,
          },
        });
      });
      //  this.addChatOnServiceWorker();

      // let formData = new FormData();
      // formData.append("role_id", getLocal("role_id"));
      axios({
        url: `${baseDomain.route}${baseDomain.subRoute}/get_all_whatsapp_chats`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getLocal("access_token")}`,
          Accept: "application/json",
        },
      }).then((res) => {
        //57,58,60
        console.log(res);
        if (res.data.data.length) {
          this.setState({
            single_chat: { mentor_status: 1 },
            chat_data: res.data.data,
          });
        } else if (!res.data.data.data.length) {
          this.setState({ single_chat: { mentor_status: 0 } });
        }
        let params = this.props.match.params;
        if (params.id) {
          this.startChat(params.id, params.className);
          // const socket = io();
          socket.emit("joinRoom", { username: localStorage.getItem("name"), room: parseInt(params.id) });
          // socket.on("message", (message) => {
          //   console.log(message);
          // });
        }
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
    if (prevProps.location !== this.props.location) {
      let params = this.props.match.params;
      if (params.id) {
        socket.emit("leave");
        socket.emit("joinRoom", { username: localStorage.getItem("name"), room: parseInt(params.id) });
        this.startChat(params.id, params.className);
      } else {
        this.setState({ single_chat: { mentor_status: 1 } });
      }
    }
  }
  render() {
    return (
      <div className="scroll" style={{ flex: 1 }}>
        <MetaHelmet title="BeyondExams" description="Best educational videos on your fingertips. Start learning now!" />
        {this.state.isFileOpened ? (
          <div className="fileContainerOverlay">
            <div className="container mentor-file-upload-container">
              {this.state.isFileOpened === 1 ? <FileChooser handleFileType={this.handleFileType} /> : null}
              {this.state.isFileOpened === 2 ? (
                <>
                  <div className="mentor-file-upload-close">
                    <span onClick={() => this.toggleFile(0)}>&times;</span>
                  </div>
                  <DragAndDrop handleDropDown={this.toggleFile} handleFileType={this.state.filetype} />
                </>
              ) : null}
              {this.state.isFileOpened === 3 ? (
                <div className="loader">
                  <CircularProgress />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="chat-page-grid">
          <div className="chat-container">
            {this.state.single_chat.mentor_status === 1 ? (
              <div className="chat-container-outer" id="chat-container-outer" key={this.state.single_chat.user_name}>
                <div className="chat-header">
                  <div className="flex">
                    <img src="https://images.indianexpress.com/2019/10/study1.jpg" alt="" />
                    <h4>{this.state.single_chat.user_name}</h4>
                  </div>
                  <div>
                    <ChatDropDown
                      startChat={this.startChat}
                      chat_data={this.state.chat_data}
                      history={this.props.history}
                    />
                  </div>
                </div>

                <div className="justifyCenter">Please Select a Chat.</div>
              </div>
            ) : null}
            {this.state.single_chat.mentor_status === 2 ? (
              <div className="chat-container-outer" ref="scrollElement" key={this.state.single_chat.user_name}>
                <div className="chat-header">
                  <div className="flex">
                    <img src="https://images.indianexpress.com/2019/10/study1.jpg" alt="" />
                    <h4>{this.state.single_chat.user_name}</h4>
                  </div>
                  <div>
                    <ChatDropDown
                      startChat={this.startChat}
                      chat_data={this.state.chat_data}
                      history={this.props.history}
                    />
                  </div>
                </div>
                <ChatRoomInner
                  chatEnd={this.state.chat_end}
                  handleChat={this.state.chat_message}
                  title={this.state.single_chat.user_name}
                  handleScroll={this.handleScroll}
                />
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
                    placeholder="Type a message ..."
                    onKeyUp={this.inputKeyPress}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "120px",
                      paddingTop: "7px",
                    }}
                  >
                    <div className="pointer">
                      <img src={Emoji} alt="Emoji" style={{ height: "15px" }} />
                    </div>
                    <div className="pointer">
                      <img src={Attach} alt="Attach" style={{ height: "15px" }} />
                    </div>
                    <div className="pointer" onClick={this.handleSendBtn}>
                      <SendIcon className="send-icon" />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <ChatLeftPane
            single_chat={this.state.single_chat}
            startChat={this.startChat}
            chat_data={this.state.chat_data}
            leftNav={this.state}
            LeftNavCollapsed={this.LeftNavCollapsed}
            toggleLeftNav={this.toggleLeftNav}
            toggleLeftNavCollapsed={this.toggleLeftNavCollapsed}
            history={this.props.history}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Chat;
