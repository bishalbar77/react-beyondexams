import React, { useEffect, useState } from 'react';
import "./Projects.css";
import ProjectsIcon from "../asset/projectsPurple.svg";
import { Tabs, Tab } from "@material-ui/core";
import ProjectsCard from './ProjectsCard';
import Frame from "../asset/Frame.svg";
import axios from "axios";
import baseDomain from "../../../common/baseDomain";

function Projects() {

  const [tabIndex, setTabIndex] = useState(0);
  const [projectsPending, setProjectsPending] = useState([]);
  const [projectsSubmitted, setProjectsSubmitted] = useState([]);

  const userSlug = localStorage.getItem("slug");

  useEffect(() => {
    axios
    .get(`${baseDomain.route}${baseDomain.subRoute}/get_user_project_details`, {params: {slug: userSlug}})
    .then((res) => {
        console.log(res.data.data);
        setProjectsPending(res.data.data.project_pending)
        setProjectsSubmitted(res.data.data.project_submitted)
    })
    .catch((e) => {
        console.log(e);
        // swal("Error", e.response.data.message, "error");
    });
  }, [])

  return (
    <div className="projects">
        <div className="projectsHeading">
            <img src={ProjectsIcon} alt="icon" />
            <p>Projects</p>
        </div>

        <div className="card">
            <div className="cardContainer">
                <Tabs
                value={tabIndex}
                onChange={(e, val) => setTabIndex(val)}
                className="cardTabs"
                // centered
                scrollButtons="off"
                >
                    <Tab label="In Progress" />
                    <Tab label="Completed" />
                </Tabs>

                {tabIndex === 0 ? (
                    <>
                        {projectsPending.map && projectsPending.map((project, id) => {
                            return (
                                <div key={id}>
                                    <ProjectsCard  
                                        img={project.category.image_url}
                                        name={project.category.title}
                                        btnText="Submit"
                                        number={60}
                                    />
                                    <hr style={{ color: "#e0e0e088" }}/>
                                </div>
                            )
                        })}
                    </>
                ) : undefined}

                {tabIndex === 1 ? (
                    <>
                        {projectsSubmitted.map && projectsSubmitted.map((project, id) => {
                            return (
                                <div key={id}>
                                    <ProjectsCard  
                                        img={project.category.image_url}
                                        name={project.category.title}
                                        btnText="View Submission"
                                        number={100}
                                    />
                                    <hr style={{ color: "#e0e0e088" }}/>
                                </div>
                            )
                        })}
                    </>
                ) : undefined}
            </div>
        </div>
    </div>
  )
}

export default Projects;