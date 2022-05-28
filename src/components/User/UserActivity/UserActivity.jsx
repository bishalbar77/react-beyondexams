import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@material-ui/core";
import "./UserActivity.css";
import Notes from "./Notes/Notes";
import Questions from "./Questions/Questions";
import NotFound from "./NotFound/NotFound";
import { Get } from "../../common/common";
import { useParams } from "react-router-dom";
import Courses from "./Courses/Courses";

const UserActivity = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState(null);
  const params = useParams();

  useEffect(() => {
    let state = params.step;
    state = state ? Number(state) : 0;

    if (!(state >= 0 && state < 5)) state = 0;
    setTabIndex(state);

    getData();
  }, []);

  const getData = async () => {
    let res = await Get(true, `get_user_all_details?slug=${params.slug}`);
    console.log(res);
    setData(res.data.data);
  };

  return (
    data && (
      <section style={{ flex: "1 1 0", minWidth: "0" }}>
        <div className="tab_slide_container">
          <div className="header_banner">
            <h1>Activity Status</h1>
            {/* <div className="activity_user">
            <img src={data?.avatar} alt="" />
            <h4 className="hide_in_phone">{data?.name}</h4>
          </div> */}
          </div>
          <Tabs
            value={tabIndex}
            onChange={(e, val) => setTabIndex(val)}
            className="search_tab_header"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Courses Enrolled in" />
            <Tab label="Courses completed" />
            <Tab label="Courses created" />
            <Tab label="Notes" />
            <Tab label="Questions/Answers" />
          </Tabs>
        </div>
        <div className="activity_content_container">
          {tabIndex === 0 && data ? (
            data?.enrollments.length > 0 ? (
              <Courses courses={data?.enrollments ?? []} />
            ) : (
              <NotFound
                text={`Whoops, ${data.name} hasn't enrolled in any course yet.`}
                btnText="Explore Courses"
                // btnLink="/explore-by-topics"
              />
            )
          ) : undefined}
          {tabIndex === 1 ? (
            <NotFound text={`Whoops, ${data.name} hasn't completed any course yet.`} btnText="Explore Courses" />
          ) : undefined}
          {tabIndex === 2 ? (
            data?.user_courses.length > 0 ? (
              <Courses courses={data?.user_courses ?? []} />
            ) : (
              <NotFound text={`Whoops, ${data.name} hasn't created any course yet.`} btnText="Create Course" />
            )
          ) : undefined}

          {tabIndex === 3 ? (
            data?.annotations.length > 0 ? (
              <Notes notes={data?.annotations ?? []} />
            ) : (
              <NotFound text={`Whoops, ${data.name} hasn't created any notes yet.`} btnText="+ Create a Note" />
            )
          ) : undefined}

          {tabIndex === 4 ? (
            data?.questions.length > 0 ? (
              <Questions questions={data?.questions ?? []} answers={data?.answers ?? []} getData={getData} />
            ) : (
              <NotFound text={`Whoops, ${data.name} hasn't answer any question yet.`} btnText="" />
            )
          ) : undefined}
        </div>
      </section>
    )
  );
};

export default UserActivity;
