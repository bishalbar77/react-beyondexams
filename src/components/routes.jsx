import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "firebase/messaging";

import UserNavbar from "./User/Navbar/navBar";
import SnackBarMUI from "./common/SnackBarMUI";
import { getLocal } from "./common/localStorageAccess";
import { checkAuth } from "./common/common.js";
import firebase from "./common/init-fcm";
import { getUserBadges } from "../actions/browseActions";

import "intro.js/introjs.css";
import "../assets/css/common/default.css";
import "../assets/css/User/Navbar/RightPane.css";
import "../assets/css/common/footer.css";
import Dashboard from "./experiment/dashboard/Dashboard";

const UserLeftPane = lazy(() => import("./User/Navbar/LeftPane"));
const HomeScreen = lazy(() => import("./Home/HomeScreen"));
const VideoRedirect = lazy(() => import("./User/Dashboard/Videos/VideoRedirect"));
const Challenge2021 = lazy(() => import("../components/Redirect/Challenge2021"));
const SetTarget = lazy(() => import("./User/Dashboard/Course/SetTarget/SetTarget"));
const Testimonials = lazy(() => import("./experiment/Testimonials/Testimonials"));
const BrowsingLinks = lazy(() => import("./experiment/BrowsingLinks/BrowsingLinks"));
const YoutubeFeatures = lazy(() => import("./YoutubeFeatures/YoutubeFeatures"));
const Referral = lazy(() => import("./User/Dashboard/Referral/Referral"));
const Cirtificate = lazy(() => import("./User/Dashboard/Course/Cirtificate/Cirtificate"));

const Login = lazy(() => import("./Login/Login"));
const AdminLogin = lazy(() => import("./Login/AdminLogin"));
const Experiment = lazy(() => import("./experiment/Simulation/Experiment"));
const Simulation = lazy(() => import("./experiment/Simulation/Simulation"));
const VideoDub = lazy(() => import("./experiment/Video Dub/VideoDub"));
const Leaderboard = lazy(() => import("./Leaderboard/Leaderboard"));
const UserCourses = lazy(() => import("./Admin/UserCourses"));
const HiddenCourses = lazy(() => import("./Admin/HiddenCourses"));
const YoutubeVideo = lazy(() => import("./Admin/YoutubeVideo"));
const UserCategory = lazy(() => import("./Admin/UserCategory"));

const ChatChannels = lazy(() => import("./Admin/ChatChannels"));
const ProjectSubmission = lazy(() => import("./Admin/ProjectSubmission"));
const UserEnrollments = lazy(() => import("./Admin/UserEnrollments"));
const NoMatchFound = lazy(() => import("./common/Error404"));
const AboutUs = lazy(() => import("./User/Dashboard/AboutUs/AboutUs"));
const ContactUs = lazy(() => import("./User/Dashboard/ContactUs/ContactUs"));
const Profile = lazy(() => import("./User/Profile/profile"));
const Video = lazy(() => import("./User/Dashboard/Videos/Video"));
const Progression = lazy(() => import("./User/Dashboard/Progression/Progression"));
const History = lazy(() => import("./User/Dashboard/History/History"));
const Browse = lazy(() => import("./User/Dashboard/Browse/Browse"));
const PlayList = lazy(() => import("./User/Dashboard/PlayList/PlayList"));
const SearchResults = lazy(() => import("./User/Dashboard/Videos/SearchResults"));
const Search = lazy(() => import("./User/Dashboard/Search/Search"));
const Classroom = lazy(() => import("./User/Dashboard/Classroom/ClassRoom"));
const Chat = lazy(() => import("./User/Dashboard/Chat/Chat"));
const Translate = lazy(() => import("./User/Dashboard/Translate/Translate"));
const CourseDetail = lazy(() => import("./User/Dashboard/Course/CourseDetail"));
const AddNewCourse = lazy(() => import("./User/Dashboard/Browse/NewCourse/AddNewCourse"));
const ProfileResume = lazy(() => import("./experiment/Profile Resume/ProfileResume"));
const ConvertUrl = lazy(() => import("./Convert/ConvertUrl"));
const LandingOne = lazy(() => import("./experiment/Landing Page/LandingOne"));
const LandingTwo = lazy(() => import("./experiment/Landing Page/LandingTwo"));
const LandingThree = lazy(() => import("./experiment/Landing Page/LandingThree"));
const LandingFour = lazy(() => import("./experiment/Landing Page/LandingFour"));
const LandingFive = lazy(() => import("./experiment/Landing Page/LandingFive"));
const LandingSix = lazy(() => import("./experiment/Landing Page/LandingSix"));
const LandingSeven = lazy(() => import("./experiment/Landing Page/LandingSeven"));
const StudentLanding = lazy(() => import("./experiment/Landing Page/Student/Landing"));
const TeacherOne = lazy(() => import("./experiment/Landing Page/Teacher/TeacherOne"));
const TeacherTwo = lazy(() => import("./experiment/Landing Page/Teacher/TeacherTwo"));
const TeacherThree = lazy(() => import("./experiment/Landing Page/Teacher/TeacherThree"));
const StudentOne = lazy(() => import("./experiment/Landing Page/Student/StudentOne"));
const StudentTwo = lazy(() => import("./experiment/Landing Page/Student/StudentTwo"));
const StudentThree = lazy(() => import("./experiment/Landing Page/Student/StudentThree"));
const TeacherLanding = lazy(() => import("./experiment/Landing Page/Teacher/Landing"));
const Activity = lazy(() => import("./User/UserActivity/UserActivity"));
const BootCamp = lazy(() => import("./User/Dashboard/Bootcamp/CourseDetail"));

class LoginNavigation extends Component {
  state = {
    userLeftNav: {
      page: 0,
    },
    mentorLeftNav: {
      page: 0,
    },
    isCollapsed: false,
    isOpened: false,
    browseTourActive: false,
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
  setBrowseTour = (bool) => {
    this.setState({ browseTourActive: bool });
  };

  componentDidMount = async () => {
    if (getLocal("uid")) {
      await checkAuth();
      this.props.getUserBadges();
      if (firebase.messaging.isSupported()) {
        const messaging = firebase.messaging();
        messaging.onMessage((payload) => {
          console.log("Notification received", payload);
          this.props.showSuccess(payload.notification.title);
        });
      }
    } else {
      this.props.getUserBadges();
    }
  };

  render() {
    return (
      // <Mato>
      <Suspense
        fallback={
          <div className="init-loader">
            <div></div>
          </div>
        }
      >
        <Switch>
          <Route exact path="/experiment/Landing/1" render={(props) => <LandingOne />} />
          <Route exact path="/experiment/Landing/2" render={(props) => <LandingTwo />} />
          <Route exact path="/experiment/Landing/3" render={(props) => <LandingThree />} />
          <Route exact path="/experiment/Landing/4" render={(props) => <LandingFour />} />
          <Route exact path="/experiment/Landing/5" render={(props) => <LandingFive />} />
          <Route exact path="/experiment/Landing/6" render={(props) => <LandingSix />} />
          <Route exact path="/experiment/Landing/7" render={(props) => <LandingSeven />} />
          <Route exact path="/experiment/Landing/student" render={(props) => <StudentLanding />} />
          <Route exact path="/experiment/Landing/teacher/1" render={(props) => <TeacherOne />} />
          <Route exact path="/experiment/Landing/teacher/2" render={(props) => <TeacherTwo />} />
          <Route exact path="/experiment/Landing/teacher/3" render={(props) => <TeacherThree />} />
          <Route exact path="/experiment/Landing/student/1" render={(props) => <StudentOne />} />
          <Route exact path="/experiment/Landing/student/2" render={(props) => <StudentTwo />} />
          <Route exact path="/experiment/Landing/student/3" render={(props) => <StudentThree />} />
          <Route exact path="/experiment/Landing/teacher" render={(props) => <TeacherLanding />} />
          <Route exact path="/challenge2021" component={Challenge2021} />

          <Route path="/">
            <UserNavbar toggleLeftNav={this.toggleLeftNav} browseTourActive={this.state.browseTourActive} />
            <UserLeftPane
              leftNav={this.state}
              LeftNavCollapsed={this.LeftNavCollapsed}
              toggleLeftNav={this.toggleLeftNav}
              toggleLeftNavCollapsed={this.toggleLeftNavCollapsed}
            />
            <SnackBarMUI />

            <Switch>
              <Route exact path="/" render={(props) => <HomeScreen {...props} setBrowseTour={this.setBrowseTour} />} />

              <Route exact path="/youtube-features" component={YoutubeFeatures} />

              <Route
                exact
                path="/create-your-own-course"
                render={(props) => <HomeScreen {...props} setBrowseTour={this.setBrowseTour} />}
                setBrowseTour={this.setBrowseTour}
              />

              <Route exact path="/experiment/testimonials" component={Testimonials} />
              <Route exact path="/experiment/browsing-links" component={BrowsingLinks} />
              <Route
                path="/training-bootcamps/3-months-website-development-bootcamp"
                render={(props) => <BootCamp {...props} slug="reactjs-babd7" />}
              />
              <Route
                path="/training-bootcamps/3-months-data-science-bootcamp"
                render={(props) => <BootCamp {...props} slug="learn-business-analytics-ef173" />}
              />

              <Route exact path="/login" component={Login} />
              <Route exact path="/private-login" component={AdminLogin} />
              <Route exact path="/convert-url" component={ConvertUrl} />
              <Route path="/add-new-course/:parent/:level/:type/:step" component={AddNewCourse} />
              <Route path="/dashboard">
                <div className="dashboard-grid">
                  <Route exact path="/dashboard">
                    <Redirect to="/explore-by-topics" />
                  </Route>
                  <Route path="/dashboard/history" render={(props) => <History {...props} />} />
                  <Route path="/dashboard/course/:slug" component={CourseDetail} />
                  <Route
                    exact
                    path="/dashboard/classroom/:className?/:id?"
                    render={(props) => <Classroom {...props} />}
                  ></Route>

                  <Route exact path="/dashboard/videos/:id" component={Video} />
                  <Route exact path="/dashboard/videos" component={Video} />
                  <Route exact path="/dashboard/progression" component={Progression} />
                  <Route
                    exact
                    path="/dashboard/videos/searchresults"
                    render={(props) => <SearchResults {...props} />}
                  />
                  <Route exact path="/dashboard/search" render={(props) => <Search {...props} />} />
                  <Route exact path="/dashboard/activity/:slug/:step" component={Activity} />
                  <Route exact path="/dashboard/translate" render={(props) => <Translate {...props} />} />
                  <Route
                    exact
                    path="/dashboard/browse"
                    render={(props) => <Browse setBrowseTour={this.setBrowseTour} {...props} />}
                  ></Route>
                  <Route exact path="/dashboard/contact-us">
                    <ContactUs />
                  </Route>
                  <Route exact path="/dashboard/about-us">
                    <AboutUs />
                  </Route>
                  <Route exact path="/dashboard/playlist/:level">
                    <PlayList />
                  </Route>

                  <Route exact path="/dashboard/profile/:slug?" render={(props) => <Profile {...props} />}></Route>
                  <Route exact path="/dashboard/experiment/:slug?" render={(props) => <Dashboard />}></Route>

                  <Route exact path="/dashboard/experiment">
                    <Experiment />
                  </Route>
                  <Route exact path="/dashboard/experiment/simulation/:title">
                    <Simulation />
                  </Route>
                  <Route exact path="/dashboard/experiment/videoDub">
                    <VideoDub />
                  </Route>
                  <Route
                    exact
                    path="/dashboard/experiment/profile-resume/:slug?"
                    render={(props) => <ProfileResume {...props} />}
                  ></Route>
                  <Route exact path="/dashboard/Teacher-Leaderboard">
                    <Leaderboard type="teacher" />
                  </Route>
                  <Route exact path="/dashboard/Student-Leaderboard">
                    <Leaderboard type="student" />
                  </Route>
                  <Route exact path="/dashboard/user-courses">
                    <UserCourses type="student" />
                  </Route>
                  <Route exact path="/dashboard/hidden-courses">
                    <HiddenCourses type="student" />
                  </Route>
                  <Route exact path="/dashboard/user-enrollments">
                    <UserEnrollments type="student" />
                  </Route>
                  <Route exact path="/dashboard/project-submissions">
                    <ProjectSubmission type="student" />
                  </Route>
                  <Route exact path="/dashboard/youtube-video-rankings">
                    <YoutubeVideo type="student" />
                  </Route>
                  <Route exact path="/dashboard/course-enrollments">
                    <UserCategory type="student" />
                  </Route>
                  <Route exact path="/dashboard/chat-rooms">
                    <ChatChannels type="student" />
                  </Route>
                </div>
              </Route>
              <Route exact path="/set-target" component={SetTarget} />
              <Route
                exact
                path="/explore-by-topics"
                render={(props) => <Browse setBrowseTour={this.setBrowseTour} {...props} />}
              ></Route>
              <Route
                exact
                path="/explore-by-classes"
                render={(props) => <Browse setBrowseTour={this.setBrowseTour} {...props} />}
              ></Route>
              {/* <Route exact path="chat" render={(props) => <Chat {...props} />}></Route> */}
              <Route exact path="/chat/:className?/:id?" render={(props) => <Chat {...props} />}></Route>
              {/* Referral System  */}
              <Route exact path="/refer-a-friend" component={Referral} />

              {/* Course Cirtificates */}
              <Route exact path="/course/:course_slug/cirtificate" component={Cirtificate} />

              <Route exact path="/:id">
                <VideoRedirect />
              </Route>
              <Route component={NoMatchFound} />
            </Switch>
          </Route>
        </Switch>
      </Suspense>
      /* </Mato> */
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getUserBadges: () => dispatch(getUserBadges()),
    showSuccess: (message) =>
      dispatch({
        type: "SHOW_SUCCESS",
        message,
      }),
  };
};
export default connect(null, mapDispatchToProps)(LoginNavigation);

// function Mato({ children }) {
//   const { enableLinkTracking } = useMatomo();

//   enableLinkTracking();

//   return <>{children}</>;
// }
