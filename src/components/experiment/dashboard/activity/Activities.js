import React, { useEffect } from 'react';
import "./Activities.css";
import ActivityIcon from "../asset/activities.svg";
import ActivityScreenIcon from "../asset/activityScreenIcon.svg";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import TextField from '@mui/material/TextField';
import ActivityChart from "./chart/ActivityChart";
import InviteCard from '../invite/InviteCard';
import axios from "axios";
import baseDomain from "../../../common/baseDomain";

function Activities() {

  const [value, setValue] = React.useState(new Date());

  useEffect(() => {
    axios
    .get(`${baseDomain.route}${baseDomain.subRoute}/get_all_daily_streaks`)
    .then((res) => {
        console.log(res.data.data);
        // setDetails(res.data.data);
    })
    .catch((e) => {
        console.log(e);
        // swal("Error", e.response.data.message, "error");
    });
  }, [])

  return (
    <div className="activities">
        <div className="activityHeading">
            <img src={ActivityIcon} alt="icon" />
            <p>Your Learning Activity</p>
        </div>

        <ActivityChart />

        <div className="activityImage">
            <img src={ActivityScreenIcon} alt="" />
            <p>Start learning and track your learning activity</p>
            <div className="activityBtn">
                <AddOutlinedIcon fontSize="large" className="addBtn"/>
                <p>Start a new course</p>
            </div>
        </div>

        <div className="activityCalandar">
            <div className="calendarHeading">
                <h3>Activity Calendar</h3>
                <p>View</p>
            </div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    // openTo="year"
                    value={value}
                    onChange={(newValue) => {
                    setValue(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        </div>
        <InviteCard />
    </div>
  )
}

export default Activities;