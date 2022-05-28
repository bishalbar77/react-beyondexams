import { CircularProgress } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PhoneIcon from "@material-ui/icons/Phone";
import axios from "axios";
import React, { Component } from "react";
import MagicSliderDots from "react-magic-slider-dots";
import "react-magic-slider-dots/dist/magic-dots.css";
import { Redirect, useHistory } from "react-router-dom";
import SliderDots from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import swal from "sweetalert";
import "../../../assets/css/User/Profile/profile.css";
import { ReactComponent as AboutDefault } from "../../../assets/images/icons/about_default.svg";
import { ReactComponent as ProfileFirstEncounterCertificate } from "../../../assets/images/icons/certi_svg.svg";
import { ReactComponent as ProfileFirstEncounterEducation } from "../../../assets/images/icons/education_svg.svg";
import { ReactComponent as ProfileFirstEncounter } from "../../../assets/images/icons/profile-first-encounter.svg";
import baseDomain from "../../common/baseDomain";
import { Get, Post } from "../../common/common";
import Footer from "../../common/Footer";
import { getLocal } from "../../common/localStorageAccess";
import Matomo from "../../common/Matomo";
import CourseCard from "../Dashboard/Browse/CourseCard";
import AboutDialog from "./AboutDialog";
import BioDialog from "./BioDialog";
import CertiDialog from "./CertiDialog";
import ClassDropDown from "./ClassDropDown";
import EducationDialog from "./EducationDialog";
import SkillDialog from "./SkillDialog";
import SocialDialog from "./SocialDialog";

var data = require("./profile.json");

const useStyles2 = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

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

    courses: null,

    bio: false,
    about: false,
    education: false,
    social: false,
    skills: false,
    certificate: false,
    redirect: null,
    userData: null,
    slug: "",
  };

  componentDidMount = async () => {
    window.scrollTo(0, 0);
    let access_token = getLocal("access_token");
    let params = this.props.match.params;
    let userDetails;
    let countryRequest = axios.get(`${baseDomain.route}${baseDomain.subRoute}/${data.api.countries}`);
    if (params.slug && params.slug !== "null") {
      this.getData(params.slug);
      userDetails = axios.get(`${baseDomain.route}${baseDomain.subRoute}/${data.api.userSlug}`, {
        params: {
          slug: params.slug,
        },
      });
    } else {
      userDetails = axios.get(`${baseDomain.route}${baseDomain.subRoute}/${data.api.userProfile}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json;charset=UTF-8",
        },
      });
    }
    await axios
      .all([countryRequest, userDetails])
      .then(
        axios.spread((...response) => {
          let user = response[1].data.data[0];
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
          for (let i = 0; i < user.domains.length / 3; i++) domains_base.push(i * 3);
          let education_standard_base = [];
          for (let i = 0; i < user.education_standard.length / 3; i++) education_standard_base.push(i * 3);

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
            courses: response[1].data.data[1],
            slug: params.slug,
          });
        })
      )
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };
  getData = async (slug) => {
    let res = await Get(true, `get_user_all_details?slug=${slug}`);
    console.log(res);
    this.setState({ userData: res.data.data });
  };
  openDialog = (e) => {
    this.setState({ [e]: true });
  };
  handleClose = (e) => {
    this.setState({ [e]: false });
  };
  getMonth = (month) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[parseInt(month) - 1];
  };
  sliderColor = (i) => {
    if (i === 0) return "slider-one";
    else if (i === 1) return "slider-two";
    else return "slider-three";
  };
  update = async () => {
    await this.componentDidMount();
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.location !== this.props.location) {
      window.scrollTo(0, 0);
      this.setState({ loading: true });
      this.componentDidMount();
    }
  };
  handleClick = (url) => {
    if (url === "fb") {
      window.open("https://www.facebook.com/" + this.state.profile.facebook_link, "_blank").focus();
    } else if (url === "insta") {
      window.open("https://www.instagram.com/" + this.state.profile.instagram_link, "_blank").focus();
    } else if (url === "twitter") {
      window.open("https://twitter.com/" + this.state.profile.twitter_link, "_blank").focus();
    } else if (url === "linkedin") {
      window.open("https://www.linkedin.com/in/" + this.state.profile.linkedin_link, "_blank").focus();
    }
  };

  // routeChange=(slug)=> {
  //   let path = `dashboard/course?course=${slug}`;
  //   this.props.history.location(path);
  // }
  render() {
    try {
      let profile = this.state.profile;

      if (this.state.redirect) {
        return <Redirect to={this.state.redirect} />;
      }

      return (
        <Matomo pageTitle="Profile">
          {!this.state.loading ? (
            <div className="root" id="profile">
              {/* <ProfileFirstEncounter style={{ fill: "blue" }} /> */}

              {this.state.bio && (
                <BioDialog
                  open={this.state.bio}
                  handleClose={this.handleClose}
                  bio={this.state.userData?.bio}
                  update={this.update}
                />
              )}
              <AboutDialog
                open={this.state.about}
                handleClose={this.handleClose}
                profile={this.state.profile}
                update={this.update}
              />
              <EducationDialog
                open={this.state.education}
                handleClose={this.handleClose}
                profile={this.state.profile}
                update={this.update}
              />
              <SocialDialog
                open={this.state.social}
                handleClose={this.handleClose}
                profile={this.state.profile}
                update={this.update}
              />
              <SkillDialog
                open={this.state.skills}
                handleClose={this.handleClose}
                profile={this.state.profile}
                update={this.update}
              />
              <CertiDialog
                open={this.state.certificate}
                handleClose={this.handleClose}
                profile={this.state.profile}
                update={this.update}
              />
              <div className="profile-root">
                <ProfileHeader profile={profile} openDialog={this.openDialog} />

                <div className="profile-grid">
                  <About profile={profile} openDialog={this.openDialog} bio={this.state.userData?.bio ?? ""} />
                  <Activities
                    profile={profile}
                    enrolled={this.state.userData?.enrollments?.length ?? 0}
                    completed={0}
                    created={this.state.userData?.user_courses?.length ?? 0}
                    notes={this.state.userData?.notes?.length ?? 0}
                    questions={this.state.userData?.questions?.length ?? 0}
                    answers={this.state.userData?.answers?.length ?? 0}
                    slug={this.state.slug}
                    badge={this.state.userData?.student_details?.badge?.badge ?? ""}
                  />
                  <Skills profile={profile} sliderColor={this.sliderColor} openDialog={this.openDialog} />
                  <Certificate profile={profile} getMonth={this.getMonth} openDialog={this.openDialog} />
                  <Education profile={profile} openDialog={this.openDialog} />
                  <Social profile={profile} openDialog={this.openDialog} handleClick={this.handleClick} />

                  {this.state.courses ? (
                    <div className="profile-grid-div-six ">
                      <div className="flex">
                        <img
                          src={require(`../../../assets/images/icons/${data.images.profileEducation}`)}
                          className="p_d_img"
                          alt=""
                        />
                        <h3>{data.title.courses}</h3>
                      </div>
                      <div className="filterPageGrid">
                        <div className="grid-six-card-list LeftContainerGrid">
                          {this.state.courses.map((e) => (
                            <CourseCard
                              course={e}
                              key={e.id}
                              openProfile={() => {}}
                              redirect={() =>
                                this.setState({
                                  redirect: `/dashboard/course/${encodeURIComponent(e.slug)}`,
                                })
                              }
                              // redirect={() => this.routeChange(e.slug)}
                              isActive={true}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <Footer />
            </div>
          ) : (
            <div className="loader">
              <CircularProgress />
            </div>
          )}
        </Matomo>
      );
    } catch (e) {
      swal("OOPS some error occurred!", "We will fix this soon.", "warning");
      Post(0, "save_error_log", { subject: e.message, error_log: e.stack });
      return <></>;
    }
  }
}

const ProfileHeader = ({ profile, openDialog }) => {
  console.log(profile);
  return (
    <div className="profile-top profile-container">
      <div className="profile-flex">
        <div
          className="profile-image"
          style={{
            backgroundImage: `url(${profile.avatar})`,
          }}
        />
        <div className="profile-name flex-column-start">
          <h2>{profile.name}</h2>
          <section className="flex-flex-768">
            <p className="flex" style={{ fontSize: 12 }}>
              <MailOutlineIcon
                fontSize="small"
                style={{
                  color: "#febe16",
                  marginRight: "5px",
                  heigh: 15,
                  width: 15,
                }}
              />
              {profile.email}
            </p>
            {profile.phone && (
              <p className="flex" style={{ fontSize: 12 }}>
                <PhoneIcon
                  fontSize="small"
                  style={{
                    color: "#febe16",
                    marginRight: "5px",
                    height: 15,
                    width: 15,
                  }}
                />
                {profile.phone}
              </p>
            )}

            {profile.country_name && (
              <p className="flex" style={{ fontSize: 12 }}>
                {profile.country_name}
              </p>
            )}
          </section>
        </div>
      </div>
      <div>
        <ClassDropDown />
      </div>
      {profile.unique_id === localStorage.getItem("uid") && (
        <img
          className="profile-edit"
          src={require(`../../../assets/images/icons/${data.images.profileEdit}`)}
          alt=""
          onClick={() => openDialog("about")}
        />
      )}
    </div>
  );
};

const About = ({ profile, openDialog, bio }) => {
  return (
    <div className="profile-grid-div-one profile-grid-common">
      <div className="flex">
        <img src={require(`../../../assets/images/icons/${data.images.profileAbout}`)} className="p_d_img" alt="" />
        <h3>{data.title.about}</h3>
      </div>

      <p
        style={{
          width: "80%",
          padding: "10px",
          // textAlign: "center",
        }}
      >
        {bio}
      </p>

      {profile.unique_id === localStorage.getItem("uid") && (
        <img
          className="profile-edit"
          src={require(`../../../assets/images/icons/${data.images.profileEdit}`)}
          alt=""
          onClick={() => openDialog("bio")}
        />
      )}
      <div className="profile-gradient-one" />
      <div className="profile-gradient-two" />
      {bio === "" && profile.unique_id === localStorage.getItem("uid") && (
        <div className="profile-first-encounter" onClick={() => openDialog("bio")}>
          <AboutDefault
            style={{
              fill: "#686868",
              width: "122px",
              height: "69px",
            }}
          />
        </div>
      )}
    </div>
  );
};

const Activities = ({ profile, enrolled, completed, created, notes, questions, answers, slug, badge }) => {
  const history = useHistory();
  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // appendDots: (dots) => {
    //   return <MagicSliderDots dots={dots} numDotsToShow={2} dotWidth={30} />;
    // },
  };
  return (
    <div className="profile-grid-div-one profile-grid-common" style={{ paddingBottom: 15 }}>
      <div className="profile_content">
        <div className="flex-auto">
          <div className="flex">
            <img src={require(`../../../assets/images/${data.images.logo}`)} className="p_d_img" alt="" />
            <h3>{data.title.activity}</h3>
          </div>
          <div className="flex-auto">
            <p className="badge-header">Badges</p>
            <div className="flex-badge flex">
              <div className="badge purple-badge">{badge}</div>
              {/* <div className="badge red-badge">😅 Badge 2</div> */}
            </div>
          </div>
        </div>

        <div className="profile-gradient-one" />
        <div className="profile-gradient-two" />

        <div style={{ position: "relative", zIndex: 5 }}>
          <section className="activity_section_small">
            <SliderDots {...settings}>
              <div className="node_container">
                <ActivityNode
                  color={"#77AF44"}
                  bgColor={"#DCFEBE"}
                  title={"Courses Enrolled in"}
                  value={enrolled}
                  viewLink={`/dashboard/activity/${slug}/0`}
                />
                <ActivityNode
                  color={"#FEBE16"}
                  bgColor={"#FFF5DA"}
                  title={"Courses Completed"}
                  value={completed}
                  viewLink={`/dashboard/activity/${slug}/1`}
                />
                <ActivityNode
                  color={"#77AF44"}
                  bgColor={"#DCFEBE"}
                  title={"Courses Created"}
                  value={created}
                  viewLink={`/dashboard/activity/${slug}/2`}
                />
              </div>
              <div className="node_container">
                <ActivityNode
                  color={"#FEBE16"}
                  bgColor={"#FFF5DA"}
                  title={"Public Notes"}
                  value={notes}
                  viewLink={`/dashboard/activity/${slug}/3`}
                />
                <ActivityNode
                  color={"#77AF44"}
                  bgColor={"#DCFEBE"}
                  title={"Questions Asked"}
                  value={questions}
                  viewLink={`/dashboard/activity/${slug}/4`}
                />
                <ActivityNode
                  color={"#77AF44"}
                  bgColor={"#DCFEBE"}
                  title={"Questions Answered"}
                  value={answers}
                  viewLink={`/dashboard/activity/${slug}/4`}
                />
              </div>
            </SliderDots>
          </section>
          <section className="activity_section_big">
            <ActivityNode
              color={"#77AF44"}
              bgColor={"#DCFEBE"}
              title={"Courses Enrolled in"}
              value={enrolled}
              viewLink={`/dashboard/activity/${slug}/0`}
            />
            <ActivityNode
              color={"#FEBE16"}
              bgColor={"#FFF5DA"}
              title={"Courses Completed"}
              value={completed}
              viewLink={`/dashboard/activity/${slug}/1`}
            />
            <ActivityNode
              color={"#77AF44"}
              bgColor={"#DCFEBE"}
              title={"Courses Created"}
              value={created}
              viewLink={`/dashboard/activity/${slug}/2`}
            />
            <ActivityNode
              color={"#FEBE16"}
              bgColor={"#FFF5DA"}
              title={"Public Notes"}
              value={notes}
              viewLink={`/dashboard/activity/${slug}/3`}
            />
            <ActivityNode
              color={"#77AF44"}
              bgColor={"#DCFEBE"}
              title={"Questions Asked"}
              value={questions}
              viewLink={`/dashboard/activity/${slug}/4`}
            />
            <ActivityNode
              color={"#77AF44"}
              bgColor={"#DCFEBE"}
              title={"Questions Answered"}
              value={answers}
              viewLink={`/dashboard/activity/${slug}/4`}
            />
          </section>
        </div>
      </div>
      <section className="profile_activity_footer_container_sudo">
        <div
          className="profile_activity_footer_container"
          onClick={() => history.push(`/dashboard/activity/${slug}/0`)}
        >
          <div>view all activities</div>
        </div>
      </section>
    </div>
  );
};

export const ActivityNode = ({ color, bgColor, title, value, viewLink, titleColor }) => {
  const history = useHistory();
  return (
    <div className="activity_node">
      <div className="activity_count" style={{ backgroundColor: bgColor, color: color }}>
        {value < 10 ? `0${value}` : value}
      </div>
      <p className="activity_title" style={{ color: titleColor ? titleColor : "#686868" }}>
        {title}
      </p>
      {viewLink && (
        <div className="activity_view" onClick={() => history.push(viewLink)}>
          view
        </div>
      )}
    </div>
  );
};
export const HomeActivityNode = ({ color, bgColor, title, value, viewLink, titleColor }) => {
  const history = useHistory();
  return (
    <div className="activity_node">
      <div className="home_activity_count" style={{ backgroundColor: bgColor, color: color }}>
        {value < 10 ? `0${value}` : value}
      </div>
      <p className="home_activity_title" style={{ color: titleColor ? titleColor : "#686868" }}>
        {title}
      </p>
      {viewLink && (
        <div className="activity_view" onClick={() => history.push(viewLink)}>
          view
        </div>
      )}
    </div>
  );
};

const Skills = ({ profile, sliderColor, openDialog }) => {
  return (
    <div className="profile-grid-div-two profile-grid-common">
      {profile.unique_id === localStorage.getItem("uid") && (
        <img
          className="profile-edit"
          src={require(`../../../assets/images/icons/${data.images.profileEdit}`)}
          alt=""
          onClick={() => openDialog("skills")}
        />
      )}
      <div className="profile-gradient-one" />
      <div className="profile-gradient-two" />

      <div className="flex">
        <img src={require(`../../../assets/images/icons/${data.images.profileSkills}`)} className="p_d_img" alt="" />
        <h3>{data.title.skills}</h3>
      </div>
      {profile.domains.length ? (
        <div style={{ position: "relative", zIndex: 5 }}>
          {profile.domains_base.map((element, index) => (
            <div className="relative" key={index}>
              <div className="slide-div-in profile_skill_grid" style={{ marginTop: 20 }}>
                {profile.domains.slice(element, element + 3).map((e, i) => (
                  <div className="flex" style={{ alignItems: "flex-start" }} key={i}>
                    <div style={{ marginRight: 10 }}>
                      <img
                        alt=""
                        src={require(`../../../assets/images/icons/${data.images.whiteStar}`)}
                        className="profile_skill_star"
                      />
                    </div>
                    <div style={{ width: "100%" }}>
                      <h4 style={{ fontSize: 14, fontWeight: 500 }} className=" " title={e.name}>
                        {e.name}
                      </h4>
                      <Slider
                        disabled
                        value={parseInt(e.pivot.experience) * 20}
                        key={index}
                        className={sliderColor(i)}
                      />
                      <p style={{ color: "#686868", fontSize: 14 }}>
                        {(() => {
                          let experience = "";
                          switch (parseInt(e.pivot.experience)) {
                            case 1:
                              experience = "Novice";
                              break;
                            case 2:
                              experience = "Beginner";
                              break;
                            case 3:
                              experience = "Intermediate";
                              break;
                            case 4:
                              experience = "Awesome";
                              break;
                            case 5:
                              experience = "Expert";
                              break;
                          }
                          return experience;
                        })()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : profile.unique_id === localStorage.getItem("uid") ? (
        <div className="profile-first-encounter" onClick={() => openDialog("skills")}>
          <ProfileFirstEncounter
            style={{
              fill: "#686868",
              width: "122px",
              height: "69px",
            }}
          />
        </div>
      ) : (
        <div className="profile-first-encounter">
          <p>Data not available</p>
        </div>
      )}
    </div>
  );
};

const Certificate = ({ profile, getMonth, openDialog }) => {
  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots) => {
      return <MagicSliderDots dots={dots} numDotsToShow={4} dotWidth={30} />;
    },
  };

  return (
    <div className="profile-grid-div-three profile-grid-common">
      <div className="profile-gradient-one" />
      <div className="profile-gradient-two" />
      {profile.unique_id === localStorage.getItem("uid") && (
        <img
          className="profile-edit"
          src={require(`../../../assets/images/icons/${data.images.profileEdit}`)}
          alt=""
          onClick={() => openDialog("certificate")}
        />
      )}
      <div className="flex">
        <img
          src={require(`../../../assets/images/icons/${data.images.profileCertificates}`)}
          className="p_d_img"
          alt=""
        />
        <h3>{data.title.certificate}</h3>
      </div>
      {profile.certificates.length ? (
        <div style={{ position: "relative", zIndex: 5 }}>
          <div className="certi_profile_phone">
            <SliderDots {...settings}>
              {profile.certificates.map((e, i) => (
                <CertificateCard e={e} getMonth={getMonth} key={i} />
              ))}
            </SliderDots>
          </div>
          <div className="certi_profile_desktop">
            {profile.certificates.map((e, i) => (
              <CertificateCard e={e} getMonth={getMonth} key={i} />
            ))}
          </div>
        </div>
      ) : profile.unique_id === localStorage.getItem("uid") ? (
        <div className="profile-first-encounter" onClick={() => openDialog("certificate")}>
          <ProfileFirstEncounterCertificate
            style={{
              fill: "#686868",
              width: "122px",
              // height: "59px",
            }}
          />
        </div>
      ) : (
        <div className="profile-first-encounter">
          <p>Data not available</p>
        </div>
      )}
    </div>
  );
};

const CertificateCard = ({ e, getMonth }) => {
  return (
    <div className="flex" style={{ justifyContent: "center", margin: "auto", alignItems: "start" }}>
      <div className="certi_icon">
        <img src={require(`../../../assets/images/icons/${data.images.medalWhite}`)} alt="" />
      </div>
      <div className="certi-div">
        <div className="slide-div-in">
          <ImageCertificate img={e.image} />
          <div className="certi-details">
            <div>
              <div className="certi-details-left">
                <p title={e.description}>{e.description}</p>
              </div>
              <div className="flex space-between">
                <p className="certi-organization" alt={e.organization}>
                  {e.organization}
                </p>
                <p className="certi-date">
                  {e.issuing_date.slice(0, 2) +
                    "-" +
                    getMonth(parseInt(e.issuing_date.slice(3, 5))) +
                    "-" +
                    e.issuing_date.slice(6, 10)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Education = ({ profile, openDialog }) => {
  return (
    <div className="profile-grid-div-four profile-grid-common">
      {profile.unique_id === localStorage.getItem("uid") && (
        <img
          className="profile-edit"
          src={require(`../../../assets/images/icons/${data.images.profileEdit}`)}
          alt=""
          onClick={() => openDialog("education")}
        />
      )}
      <div className="profile-gradient-one" />
      <div className="profile-gradient-two" />
      <div className="flex">
        <img src={require(`../../../assets/images/icons/${data.images.profileEducation}`)} className="p_d_img" alt="" />
        <h3>{data.title.education}</h3>
      </div>
      {profile.education_standard.length ? (
        <div style={{ position: "relative", zIndex: 5 }}>
          {profile.education_standard_base.map((element, index) => (
            <div className="profile_education" key={index}>
              {profile.education_standard.slice(element, element + 3).map((e, i) => (
                <div className="flex profile-content-div" key={e.id} style={{ alignItems: "start" }}>
                  <img
                    alt=""
                    src={require(`../../../assets/images/icons/${data.images.educationWhite}`)}
                    className="educationIcon"
                  />
                  <div>
                    <h4 style={{ color: "#000" }} className="" title={e.institute_name.name}>
                      {e.institute_name.name}
                    </h4>
                    <p style={{ color: "#000" }} title={e.standard_name.name}>
                      {e.standard_name.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : profile.unique_id === localStorage.getItem("uid") ? (
        <div className="profile-first-encounter" onClick={() => openDialog("education")}>
          <ProfileFirstEncounterEducation
            style={{
              fill: "#686868",
              width: "122px",
              // height: "59px",
            }}
          />
        </div>
      ) : (
        <div className="profile-first-encounter">
          <p>Data not available</p>
        </div>
      )}
    </div>
  );
};

const Social = ({ profile, handleClick, openDialog }) => {
  return (
    <div className="profile-grid-div-five profile-grid-common">
      {profile.unique_id === localStorage.getItem("uid") && (
        <img
          className="profile-edit"
          src={require(`../../../assets/images/icons/${data.images.profileEdit}`)}
          alt=""
          onClick={() => openDialog("social")}
        />
      )}
      <div className="profile-gradient-one" />
      <div className="profile-gradient-two" />
      <div className="flex">
        <img src={require(`../../../assets/images/icons/${data.images.profileSocial}`)} className="p_d_img" alt="" />
        <h3>{data.title.social}</h3>
      </div>

      <div className="social_container">
        <SocialCard
          title={"Facebook"}
          icon={require(`../../../assets/images/icons/${data.images.profileFb}`)}
          onClick={() => handleClick("fb")}
          link={profile.facebook_link}
        />
        <SocialCard
          title={"Instagram"}
          icon={require(`../../../assets/images/icons/${data.images.profileInsta}`)}
          onClick={() => handleClick("insta")}
          link={profile.instagram_link}
        />
        <SocialCard
          title={"Twitter"}
          icon={require(`../../../assets/images/icons/${data.images.profileTwitter}`)}
          onClick={() => handleClick("twitter")}
          link={profile.twitter_link}
        />
        <SocialCard
          title={"LinkedIn"}
          icon={require(`../../../assets/images/icons/${data.images.profileLinkedIn}`)}
          onClick={() => handleClick("linkedin")}
          link={profile.linkedin_link}
        />
      </div>
    </div>
  );
};

const SocialCard = ({ icon, title, link, onClick }) => {
  return (
    <div className="flex profile-content-div" style={{ alignItems: "start" }}>
      <img alt="" src={icon} className="social_icon" />
      <div>
        <h4 style={{ color: "#000" }}>{title}</h4>
        {link ? (
          <p className="profile-social-link" onClick={onClick}>
            {link}
          </p>
        ) : (
          <p className="profile-social-link">-</p>
        )}
      </div>
    </div>
  );
};

export function ImageCertificate({ img }) {
  const classes2 = useStyles2();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <img src={img} className="certi-img" alt="" onClick={handleOpen} />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes2.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <img src={img} alt="certificate" className="certi-d-img" />
        </Fade>
      </Modal>
    </>
  );
}

export default Profile;
// export default withRouter(Profile);
