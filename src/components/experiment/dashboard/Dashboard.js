import React from 'react';
import styles from "./Dashboard.module.css";
import Dropdown from "react-multilevel-dropdown";
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
// import SearchIcon from '@material-ui/icons/Search';
import AppsIcon from '@material-ui/icons/Apps';
// import Dropdown from 'react-dropdown';
// import 'react-dropdown/style.css';
import Badges from "./asset/badges.png";
import Keys from "./asset/keys1.png";
import Streaks from "./asset/streaks.png";
import Apps from "./asset/apps.svg";
import { ReactComponent as Edit } from './asset/edit.svg';
import InviteCard from './invite/InviteCard';
import MyGoal from './myGoal/MyGoal';
import Projects from './projects/Projects';
import NewUser from './newUser/NewUser';
import Activities from './activity/Activities';
import Courses from './courses/Courses';
import Certificates from './certificate/Certificates';
import Leaderboard from './leaderBoard/Leaderboard';
import SearchIcon from "./asset/search.svg";
import CoursesIcon from "./asset/videoFooter.svg";
import ChatIcon from "./asset/chatFooter.svg";
import { getLocal, setLocal } from "../../common/localStorageAccess";

const user = localStorage.getItem("access_token");

function Dashboard() {

  const [value, setValue] = React.useState('goals');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className={styles.dashboard}>
        {user ? (
        <>
        <div className={styles.dashboardContainer}>
            <div className={styles.profileImage}>
                <div className={styles.profileIcon}>
                    <img src="https://media.istockphoto.com/photos/portrait-of-a-mature-man-with-a-little-smile-at-the-camera-right-side-picture-id1277873802?s=2048x2048" alt="profile" />
                    {/* <img src={localStorage.getItem("avatar")} alt="profile" /> */}
                </div>
                <p><span>{<Edit />}</span> Edit</p>
            </div>

            <div className={styles.profileBox}>
                <div className={styles.profileHeading}>
                    <h3>Good Morning, {localStorage.getItem("first_name")}</h3>
                    <span>👋🏻</span>
                </div>
                <p>Nice to have you back, what an exciting day, Get ready and continue your lesson today</p>
                <div className={styles.profileIcons}>
                    <img src={Badges} alt="Badges" />
                    <img src={Keys} alt="keys" />
                    <img src={Streaks} alt="streak" />
                </div>
            </div>
        </div>
        
        <div className={styles.dropdownDiv}>
            <select className={styles.dropdown} value={value} onChange={handleChange}>
                <option value="goals">My Goals</option>
                <option value="activities">Activities</option>
                <option value="courses">My Courses</option>
                <option value="leaderboard">Leaderboard</option>
                <option value="certificates">My Certificates</option>
                {/* <option value="chat">My Chat</option> */}
                <option value="projects">Projects</option>
            </select>
            {/* <Dropdown title="select an option" position="right">
                <Dropdown.Item>
                    <HomeRoundedIcon />
                    My Goals
                </Dropdown.Item>
                <Dropdown.Item>
                    Activities
                </Dropdown.Item>
                <Dropdown.Item>
                    Leaderboard
                </Dropdown.Item>
            </Dropdown> */}
        </div>

        <div className={styles.hrLine} />

        {/* <MyGoal /> */}
        {/* <Projects /> */}
        {/* <Activities /> */}
        {/* <Courses /> */}

        {value === "goals" && <MyGoal />}
        {value === "activities" && <Activities />}
        {value === "courses" && <Courses />}
        {value === "projects" && <Projects />}
        {value === "certificates" && <Certificates />}
        {value === "leaderboard" && <Leaderboard />}

        <div>
            {/* <InviteCard /> */}
        </div>
        </>

        ) : (
            <NewUser />
        )}

        <div className={styles.footerCurve}>
            <div>
                <div className={styles.appsIconDiv}>
                    <img className={styles.appsIcon} src={Apps} alt="" />
                </div>
            </div>
        </div>
        <div className={styles.footer}>
            <div className={styles.footerOption}>
                {/* <SearchIcon /> */}
                <img src={SearchIcon} alt="" />
                <p>Search</p>
            </div>
            <div className={styles.footerOption}>
                {/* <HomeRoundedIcon /> */}
                <img src={ChatIcon} alt="" />
                <p>Chat</p>
            </div>
            <div className={styles.footerOption}>
                {/* <AppsIcon className={styles.appsIcon} /> */}
                <p className={styles.dashboardText}>Dashboard</p>
            </div>
            <div className={styles.footerOption}>
                {/* <PlayCircleOutlineIcon /> */}
                <img src={CoursesIcon} alt="" />
                <p>Courses</p>
            </div>
            <div className={styles.footerOption}>
                <img src="https://media.istockphoto.com/photos/portrait-of-a-mature-man-with-a-little-smile-at-the-camera-right-side-picture-id1277873802?s=2048x2048" alt="" style={{ height: '22px', width: '22px', borderRadius: '100px', objectFit: "cover" }} />
                <p>Profile</p>
            </div>
        </div>
    </div>
  )
}

export default Dashboard;