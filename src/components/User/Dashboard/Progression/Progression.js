import { CircularProgress } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import React, { Component } from "react";
import swal from "sweetalert";
import baseDomain from "../../../common/baseDomain";
import Contributor from "./assests/contributor.png";
import Expert from "./assests/expert.png";
import GrandMaster from "./assests/grandmaster.png";
import Master from "./assests/master.png";
import Novice from "./assests/novice.png";
import TierAnimation from "./assests/tier-animation-transparent.gif";
import "./progression.css";

export default class Progression extends Component {
  state = {
    data: [],
    loading: true,
  };
  componentDidMount = () => {
    axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/get_badges`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((res) => {
        console.log(res.data.data);
        let response = res.data.data;
        if (localStorage.getItem("role_id") === "2") {
          this.setState({ data: response.educator, loading: false });
        } else {
          this.setState({ data: response.students, loading: false });
        }
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };
  render() {
    const { data } = this.state;
    return this.state.loading ? (
      <div className="loader">
        <CircularProgress />
      </div>
    ) : (
      <div className="rightPane">
        <div className="outer-container">
          <div className="pr_top pr_border_bottom">
            <div className="pr_top_left">
              <h1>BeyondExams Progression System</h1>
              <p>
                <br />
                At BeyondExams, we have made knowledge free. We have made it exciting. And we have made it useful. For
                everyone!
                <br />
                <br />
                Do you want to find out how? That’s why we have created the{" "}
                <strong>BeyondExams progression system!</strong>
                <br />
                <br />
                Grow with us step-by-step, and pretty soon, you will not only realise your true potential but we will
                also help you share your unique knowledge and skills with the entire world!
                <br />
                <br />
                Because if each one of us doesn’t help make the world a better place, who will?
                <br />
                <br />
                So come along! Take the first step into this exciting journey.
              </p>
            </div>
            <div className="pr_top_right">
              <img src={TierAnimation} alt=""></img>
            </div>
          </div>
          <div className="pr_top">
            <div className="pr_top_left">
              <h1>Performance Tiers</h1>
              <p>
                Within each category of expertise, there are five performance tiers that can be achieved in accordance
                with the quality and quantity of work you produce:{" "}
                {data.map((e, i) => {
                  return <span>{e.badge + (i === data.length - 1 ? "." : ", ")}</span>;
                })}
              </p>
            </div>
          </div>
          <div className="pr_tiers">
            <div className="pr_tier">
              <div className="pr_tier_left">
                <img src={Novice} alt=""></img>
              </div>
              <div className="pr_tier_right">
                <h2>{data[0].badge}</h2>
                <p>{data[0].description ? data[0].description : ""}</p>
                <div className="pr_tier_checkboxes">
                  {data[0].tasks.map((e, i) => (
                    <div className="pr_tier_checkbox" key={i}>
                      <Checkbox
                        checked={e.is_complete ? true : false}
                        name="checkedG"
                        size="small"
                        disabled
                        style={{ color: "#5ac995", padding: "0" }}
                      />
                      <p>{e.task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pr_tier">
              <div className="pr_tier_left">
                <img src={Contributor} alt=""></img>
              </div>
              <div className="pr_tier_right">
                <h2>{data[1].badge}</h2>
                <p>{data[1].description ? data[1].description : ""}</p>
                <div className="pr_tier_checkboxes">
                  {this.state.data[1].tasks.map((e, i) => (
                    <div className="pr_tier_checkbox" key={i}>
                      <Checkbox
                        checked={e.is_complete ? true : false}
                        name="checkedG"
                        size="small"
                        disabled
                        style={{ color: "#5ac995", padding: "0" }}
                      />
                      <p>{e.task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pr_tier">
              <div className="pr_tier_left">
                <img src={Expert} alt=""></img>
              </div>
              <div className="pr_tier_right">
                <h2>{data[2].badge}</h2>
                <p>{data[2].description ? data[2].description : ""}</p>
                <div className="pr_tier_checkboxes">
                  {this.state.data[2].tasks.map((e, i) => (
                    <div className="pr_tier_checkbox" key={i}>
                      <Checkbox
                        checked={e.is_complete ? true : false}
                        name="checkedG"
                        size="small"
                        disabled
                        style={{ color: "#5ac995", padding: "0" }}
                      />
                      <p>{e.task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pr_tier">
              <div className="pr_tier_left">
                <img src={Master} alt=""></img>
              </div>
              <div className="pr_tier_right">
                <h2>{data[3].badge}</h2>
                <p>{data[3].description ? data[3].description : ""}</p>
                <div className="pr_tier_checkboxes">
                  {this.state.data[3].tasks.map((e, i) => (
                    <div className="pr_tier_checkbox" key={i}>
                      <Checkbox
                        checked={e.is_complete ? true : false}
                        name="checkedG"
                        size="small"
                        disabled
                        style={{ color: "#5ac995", padding: "0" }}
                      />
                      <p>{e.task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pr_tier">
              <div className="pr_tier_left">
                <img src={GrandMaster} alt=""></img>
              </div>
              <div className="pr_tier_right">
                <h2>{data[4].badge}</h2>
                <p>{data[4].description ? data[4].description : ""}</p>
                <div className="pr_tier_checkboxes">
                  {this.state.data[4].tasks.map((e, i) => (
                    <div className="pr_tier_checkbox" key={i}>
                      <Checkbox
                        checked={e.is_complete ? true : false}
                        name="checkedG"
                        size="small"
                        disabled
                        style={{ color: "#5ac995", padding: "0" }}
                      />
                      <p>{e.task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pr_tier">
              <div className="pr_tier_left">
                <img src={GrandMaster} alt=""></img>
              </div>
              <div className="pr_tier_right">
                <h2>{data[5]?.badge}</h2>
                <p>{data[5]?.description ? data[4].description : ""}</p>
                <div className="pr_tier_checkboxes">
                  {this.state.data[5]?.tasks.map((e, i) => (
                    <div className="pr_tier_checkbox" key={i}>
                      <Checkbox
                        checked={e.is_complete ? true : false}
                        name="checkedG"
                        size="small"
                        disabled
                        style={{ color: "#5ac995", padding: "0" }}
                      />
                      <p>{e.task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
