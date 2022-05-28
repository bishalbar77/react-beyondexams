import React, { Component } from "react";
// import Slider from "@material-ui/core/Slider";
// import SliderDots from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import MagicSliderDots from "react-magic-slider-dots";
import "react-magic-slider-dots/dist/magic-dots.css";
import "../../../assets/css/User/Profile/profile.css";
import axios from "axios";
import swal from "sweetalert";
import baseDomain from "../../common/baseDomain";
import { getLocal } from "../../common/localStorageAccess";
// import { redirectionArray } from "../../common/redirectionArray";
// import MailOutlineIcon from "@material-ui/icons/MailOutline";
// import ClassNameDropDown from "./ClassNameDropDown";
// import ProfileEducation from "../../../assets/images/icons/profile-education.jpg";
// import ProfileEducationTwo from "../../../assets/images/icons/profile-education-two.jpg";
// import ProfileAbout from "../../../assets/images/icons/profile-about.jpg";
// import ProfileSkills from "../../../assets/images/icons/profile-skills.jpg";
// import ProfileStar from "../../../assets/images/icons/profile-star.jpg";
// import ProfileCertificates from "../../../assets/images/icons/profile-certificates.jpg";
// import ProfileSocial from "../../../assets/images/icons/profile-social.jpg";
// // import ProfileAge from "../../../assets/images/icons/profile-age.jpg";
// import Contact from "../../../assets/images/icons/profile-contact.jpg";
// import Location from "../../../assets/images/icons/profile-location.jpg";
// import ProfileInsta from "../../../assets/images/icons/profile-insta.jpg";
// import ProfileFb from "../../../assets/images/icons/profile-fb.jpg";
// import ProfileTwitter from "../../../assets/images/icons/profile-twitter.jpg";
// import ProfileLinkedIn from "../../../assets/images/icons/profile-linkedin.jpg";
// import ProfileEdit from "../../../assets/images/icons/profile-edit.svg";
// import AboutDialog from "./AboutDialog";
// import EducationDialog from "./EducationDialog";
// import SocialDialog from "./SocialDialog";
// import SkillDialog from "./SkillDialog";
// import CertiDialog from "./CertiDialog";
// import ProfileDob from "../../../assets/images/icons/profile-dob.jpg";
// import { CircularProgress } from "@material-ui/core";
// import { ReactComponent as ProfileFirstEncounter } from "../../../assets/images/icons/profile-first-encounter.svg";
// import { ReactComponent as ProfileFirstEncounterEducation } from "../../../assets/images/icons/profile-first-encounter-education.svg";
// import { ReactComponent as ProfileFirstEncounterCertificate } from "../../../assets/images/icons/profile-first-encounter-certificate.svg";
// import CourseCard from "../Dashboard/Browse/CourseCard"
// // import { withRouter } from 'react-router-dom';
// import { Redirect } from "react-router-dom";

import "./ProfileResume.css";

// modal for certi-image

class Profile extends Component {
  constuctor() {
    this.routeChange = this.routeChange.bind(this);
  }
  state = {
    loading: true,
    profile: {
      avatar: "",
      name: "",
      email: "",

      date: "",
      month: "",
      year: "",
      allCountries: [],
      country_id: null,
      country_name: "",
      state: "",
      phone: null,

      facebook_link: "",
      instagram_link: "",
      twitter_link: "",
      linkedin_link: "",

      education_standard: [],

      domains: [],
      domainsBase: [],

      certificates: [],

      unique_id: "",
    },

    about: false,
    education: false,
    social: false,
    skills: false,
    certificate: false,
    redirect: null,
  };

  componentDidMount = async () => {
    window.scrollTo(0, 0);
    let access_token = getLocal("access_token");
    let params = this.props.match.params;
    let userDetails;
    let countryRequest = axios.get(
      `${baseDomain.route}${baseDomain.subRoute}/get_all_countries`
    );
    if (params.slug && params.slug !== "null") {
      userDetails = axios.get(
        `${baseDomain.route}${baseDomain.subRoute}/get_user_from_slug`,
        {
          params: {
            slug: params.slug,
          },
        }
      );
    } else {
      userDetails = axios.get(
        `${baseDomain.route}${baseDomain.subRoute}/get_user_profile`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/json;charset=UTF-8",
          },
        }
      );
    }
    await axios
      .all([countryRequest, userDetails])
      .then(
        axios.spread((...response) => {
          console.log("axios response", response);
          let user = response[1].data.data[0];
          console.log(user);
          if (user.unique_id === localStorage.getItem("uid") && user.slug) {
            localStorage.setItem("slug", user.slug);
          }
          let countryName = "";
          for (let i = 0; i < 242; i++) {
            if (response[0].data.data[i].id === user.country_id) {
              countryName = response[0].data.data[i].name;
              break;
            }
          }
          let domains_base = [];
          for (let i = 0; i < user.domains.length / 3; i++)
            domains_base.push(i * 3);
          let education_standard_base = [];
          for (let i = 0; i < user.education_standard.length / 3; i++)
            education_standard_base.push(i * 3);

          this.setState({
            loading: false,
            profile: {
              avatar: user.avatar,
              name: user.name,
              email: user.email,

              date: user.dob?.slice(8, 10),
              month: user.dob?.slice(5, 7),
              year: user.dob?.slice(0, 4),

              allCountries: response[0].data.data,
              country_id: user.country_id,
              country_name: countryName,
              state: user.state,
              phone: user.phone,

              facebook_link: user.facebook_link,
              instagram_link: user.instagram_link,
              twitter_link: user.twitter_url,
              linkedin_link: user.linkedin_url,

              education_standard: user.education_standard,
              education_standard_base: education_standard_base,

              domains: user.domains,
              domains_base: domains_base,

              certificates: user.certificates,

              unique_id: user.unique_id,
            },
          });
        })
      )
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };
  getMonth = (month) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNames[parseInt(month) - 1];
  };
  update = () => {
    this.componentDidMount();
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.location !== this.props.location) {
      window.scrollTo(0, 0);
      this.setState({ loading: true });
      this.componentDidMount();
    }
  };

  // routeChange=(slug)=> {
  //   let path = `dashboard/course?course=${slug}`;
  //   this.props.history.location(path);
  // }
  render() {
    console.log("profile resume state", this.state);
    return (
      <>
        <div className="resume">
          <div className="resume_left">
            <div className="resume_profile">
              <img src={this.state.profile.avatar} alt="profile_pic" />
            </div>
            <div className="resume_content">
              <div className="resume_item resume_info">
                <div className="title">
                  <p className="bold">{this.state.profile.name}</p>
                  {/* <p className="regular">Designer</p> */}
                </div>
                <ul>
                  <li>
                    <div className="icon">
                      <i className="fas fa-map-signs"></i>
                    </div>
                    <div className="data">
                      {this.state.profile.country_name
                        ? this.state.profile.country_name
                        : "-"}
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fas fa-mobile-alt"></i>
                    </div>
                    <div className="data">
                      {this.state.profile.phone || "-"}
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <a
                      href={`mailto:${this.state.profile.email}`}
                      className="data"
                      style={{ width: "80%", cursor: "pointer" }}
                    >
                      {this.state.profile.email || "-"}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="resume_item resume_skills">
                <div className="title">
                  <p className="bold">skills</p>
                </div>
                <ul>
                  {this.state.profile.domains.map((skill) => (
                    <li key={skill.id}>
                      <div className="skill_name">{skill.name}</div>
                      {/* <div></div> */}
                      <div className="skill_progress">
                        <span
                          style={{
                            width: `${
                              (parseInt(skill.pivot.experience) / 5) * 100
                            }%`,
                          }}
                        ></span>
                      </div>
                      <div className="skill_per">
                        {(parseInt(skill.pivot.experience) / 5) * 100}%
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="resume_item resume_social">
                <div className="title">
                  <p className="bold">Social</p>
                </div>
                <ul>
                  <li>
                    <div className="icon">
                      <i className="fab fa-facebook-square"></i>
                    </div>
                    <div className="data">
                      <p className="semi-bold">Facebook</p>
                      <p>{this.state.profile.facebook_link || "-"}</p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fab fa-twitter-square"></i>
                    </div>
                    <div className="data">
                      <p className="semi-bold">Twitter</p>
                      <p>{this.state.profile.twitter_link || "-"}</p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fab fa-instagram"></i>
                    </div>
                    <div className="data">
                      <p className="semi-bold">Instagram</p>
                      <p>{this.state.profile.instagram_link || "-"}</p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fab fa-linkedin"></i>
                    </div>
                    <div className="data">
                      <p className="semi-bold">Linkedin</p>
                      <p>
                        {this.state.profile.linkedin_link &&
                        this.state.profile.linkedin_link.indexOf(
                          "www.linkedin.com"
                        ) !== -1
                          ? this.state.profile.linkedin_link
                              .split("https://www.linkedin.com/in/")[1]
                              .split("/")[0]
                          : this.state.profile.linkedin_link || "-"}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="resume_right">
            {/* <div className="resume_item resume_about">
            <div className="title">
                <p className="bold">About us</p>
            </div>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis illo fugit officiis distinctio culpa officia totam atque exercitationem inventore repudiandae?</p>
        </div>
        <div className="resume_item resume_work">
            <div className="title">
                <p className="bold">Work Experience</p>
            </div>
            <ul>
                <li>
                    <div className="date">2013 - 2015</div>
                    <div className="info">
                        <p className="semi-bold">Lorem ipsum dolor sit amet.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>
                    </div>
                </li>
                <li>
                    <div className="date">2015 - 2017</div>
                    <div className="info">
                        <p className="semi-bold">Lorem ipsum dolor sit amet.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>
                    </div>
                </li>
                <li>
                    <div className="date">2017 - Present</div>
                    <div className="info">
                        <p className="semi-bold">Lorem ipsum dolor sit amet.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>
                    </div>
                </li>
            </ul>
        </div> */}
            {this.state.profile.education_standard &&
            this.state.profile.education_standard.length > 0 ? (
              <div className="resume_item resume_education">
                <div className="title">
                  <p className="bold">Education</p>
                </div>
                <ul>
                  {this.state.profile.education_standard.map((study) => (
                    <li key={study.id}>
                      <div className="date">2010 - 2013</div>
                      <div className="info">
                        <p className="semi-bold">{study.standard_name.name} <br /> {study.institute_name.name}</p>
                        {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p> */}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="resume_item resume_hobby">
              <div className="title">
                <p className="bold">Hobby</p>
              </div>
              <ul>
                <li>
                  <i className="fas fa-book"></i>
                </li>
                <li>
                  <i className="fas fa-gamepad"></i>
                </li>
                <li>
                  <i className="fas fa-music"></i>
                </li>
                <li>
                  <i className="fab fa-pagelines"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
// export default withRouter(Profile);
