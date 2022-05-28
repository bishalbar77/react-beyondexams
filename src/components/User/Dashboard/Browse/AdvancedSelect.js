import React, { useState, useEffect } from "react";
import InfoIcon from "../../../../assets/images/icons/alert-circle-colored.svg";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core/styles";
import Dropdown from "react-multilevel-dropdown";
import { connect } from "react-redux";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { getAllCategories } from "../../../../actions/browseActions";
import axios from "axios";
import baseDomain from "../../../common/baseDomain";
import Tooltip from "@material-ui/core/Tooltip";
import { getLocal } from "../../../common/localStorageAccess";

const useStyles = () => ({
  expandMoreIcon: {
    "@media (max-width:1024px)": {
      display: "none",
    },
  },
  keyboardArrowRightIcon: {
    "@media (max-width:968px)": {
      fontSize: "16px",
    },
  },
});

const AdvancedSelectInput = (props) => {
  const [value, setValue] = useState();
  const { classes } = props;

  const renderArrow = (data) => {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].video_count || data[i].num_modules) {
        } else {
          return <KeyboardArrowRightIcon className={classes.keyboardArrowRightIcon} />;
        }
      }
    }
  };

  const getBreadCrumbs = (parentId) => {
    axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/get_course_breadcrumbs?parent_id=${parentId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        console.log(response);
        let res = response.data.data;
        let value = "";
        res.breadcrumbs.reverse().forEach((e, i) => {
          if (i !== 0) value += "/";
          value += e.title ?? "";
        });
        setValue(value);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    console.log("bread effect");
    getBreadCrumbs(props.value);
  }, [props.value]);

  useEffect(() => {
    if (!props.allCategories.length) {
      props.getAllCategories();
    }
  }, [props]);

  const renderTree = (data) => {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].video_count || data[i].num_modules) {
        } else {
          return (
            <Dropdown.Submenu
              position={data[0].level % 6 > 3 || data[0].level % 6 === 0 ? "left" : "right"}
              className="sub-menu"
            >
              {data.map((e) => {
                return e.video_count || e.num_modules ? null : (
                  <Dropdown.Item
                    className={`dropdown-item ${e.level}`}
                    key={e.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      props.onValue(e.level, e.id);
                      document.querySelector(".advanced-drop-container").click();
                    }}
                  >
                    {e.title}
                    {renderArrow(e.children)}
                    {renderTree(e.children)}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Submenu>
          );
        }
      }
    }
  };

  const inputContainer = {
    display: "flex",
    flexDirection: "column",
  };

  return (
    <FormControl style={inputContainer}>
      <label className="input-label" id="course">
        {props.label}
        <span style={{ color: "#FF0000" }}>*</span>
        <Tooltip
          title="Choose who is your target audience and which subject is your course related to."
          arrow
          enterTouchDelay={1}
        >
          <img src={InfoIcon} alt="" />
        </Tooltip>
      </label>

      <Dropdown
        title={<div className="input-text input-div">{value}</div>}
        buttonClassName="advanced-drop-container"
        menuClassName="home-dropdown-menu advanced-menu"
        position="right"
      >
        {props.allCategories.map((parent) =>
          parent.video_count || parent.num_modules ? null : (
            <Dropdown.Item
              key={parent.id}
              className="dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                getBreadCrumbs(parent.id);
                props.onValue(parent.level, parent.id);
                document.querySelector(".advanced-drop-container").click();
              }}
            >
              {parent.title}
              {renderArrow(parent.children)}
              {renderTree(parent.children)}
            </Dropdown.Item>
          )
        )}
      </Dropdown>
    </FormControl>
  );
};

const mapStatesToProps = (state) => {
  return {
    allCategories: state.browse.allCategories,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllCategories: () => dispatch(getAllCategories()),
  };
};

export default connect(mapStatesToProps, mapDispatchToProps)(withStyles(useStyles)(AdvancedSelectInput));
