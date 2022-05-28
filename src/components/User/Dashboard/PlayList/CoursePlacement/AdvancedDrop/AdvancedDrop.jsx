import { Dialog, Menu, MenuItem, Slide } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import cx from "classnames";
import NestedMenuItem from "material-ui-nested-menu-item";
import React, { useState } from "react";
import { connect } from "react-redux";
import { getAllCategories } from "../../../../../../actions/browseActions";
import Arrow from "../../../../../../assets/images/icons/solid-bottom-arrow.svg";
import styles from "./AdvancedDrop.module.css";
import baseDomain from "../../../../../common/baseDomain";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const AdvancedDrop = (props) => {
  const [menuPosition, setMenuPosition] = useState(null);
  const [inView, setInView] = useState("base");
  const [outView, setOutView] = useState(null);
  const [slideDirection, setSlideDirection] = useState(null);
  const [allSmallCategories, setAllSmallCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [dropData, setDropData] = useState(null);

  React.useEffect(() => {
    props.inputRef.current.onclick = handleClick;
  });

  React.useEffect(() => {
    setInView("base");
    console.log(dropData);
    if (dropData == null) getTopics();
    else {
      if (props.classification === "classes") {
        setAllCategories([...dropData?.courses]);
        setAllSmallCategories({
          id: "base",
          children: [...dropData?.courses],
        });
      } else {
        setAllCategories([...dropData?.topics]);
        setAllSmallCategories({
          id: "base",
          children: [...dropData?.topics],
        });
      }
    }
  }, [props.classification, dropData]);

  const handleClick = (event) => {
    if (menuPosition) {
      return;
    }
    event.preventDefault();
    setMenuPosition({
      top: props.inputRef.current.offsetTop + props.inputRef.current.offsetHeight + 21,
      left: props.inputRef.current.offsetLeft,
    });
  };

  const handleItemClick = (e) => {
    if (e.level < 2) {
      setOpenSnackBar(true);
      return;
    }
    setMenuPosition(null);
    props.onSmallCLose();
    props.handleItemClick(e);
  };

  const checkSub = (e) => {
    let isSub = false;
    Array.isArray(e.children) &&
      e.children.forEach((e) => {
        if (e.video_count || e.num_modules) {
        } else isSub = true;
      });

    return isSub;
  };

  const getTopics = async () => {
    await axios
      .get(`${baseDomain.route}${baseDomain.subRoute}/get_all_courses`)
      .then((response) => {
        console.log("get topics");
        setDropData(response.data.data);
        // setAllCategories(response.data.data.topics);
        // setAllSmallCategories({
        //   id: "base",
        //   children: response.data.data.topics,
        // });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const dropTree = (ele) => {
    return (
      <NestedMenuItem
        label={ele.title}
        parentMenuOpen={!!menuPosition}
        onClick={() => handleItemClick(ele)}
        key={ele.id}
      >
        {Array.isArray(ele.children) &&
          ele.children.map((e) => {
            if (!e?.children) {
              return (
                <MenuItem key={e.id} onClick={() => handleItemClick(e)}>
                  {e.title}
                </MenuItem>
              );
            } else {
              let isSub = checkSub(e);
              return isSub ? (
                dropTree(e)
              ) : (
                <MenuItem key={e.id} onClick={() => handleItemClick(e)}>
                  {e.title}
                </MenuItem>
              );
            }
          })}
      </NestedMenuItem>
    );
  };

  const smallDropTree = (data, preId) => {
    let dropKey = data?.id;
    return (
      data.children && (
        <div
          className={cx(
            styles.dropContainer,
            outView == dropKey ? (slideDirection === "right" ? styles.toRightOut : styles.toLeftOut) : "",
            inView == dropKey
              ? slideDirection === "right"
                ? styles.toRightIn
                : data.children[0].level > 1
                ? styles.toLeftIn
                : ""
              : ""
          )}
          style={inView === dropKey ? { left: 0 } : null}
        >
          <div className={styles.scrollContainer}>
            {preId && (
              <div className={styles.back}>
                <span
                  className={styles.primary_btn}
                  onClick={() => {
                    setInView(preId);
                    setSlideDirection("right");
                    setOutView(data.id);
                  }}
                >
                  Back
                </span>

                {/* <img src={Arrow} alt="" /> */}
              </div>
            )}
            {preId && data.children[0].level > 2 ? (
              <div className={styles.parentEle}>
                <span className={styles.primary_btn} onClick={() => handleItemClick(data)}>
                  Create Course here
                </span>
              </div>
            ) : null}
            {data.children?.map((e, i) => {
              if (e.title === "IT & Software") {
                console.log(e);
              }
              if (checkSub(e) || e.level === 1) {
                return (
                  <React.Fragment key={i}>
                    {smallDropTree(e, data.id)}
                    <div
                      onClick={() => {
                        setInView(e.id);
                        setSlideDirection("left");
                        setOutView(data.id);
                      }}
                      className={styles.parentDrop}
                    >
                      <div>{e.title}</div>
                      <img src={Arrow} alt="" style={{ width: "8px" }} />
                    </div>
                  </React.Fragment>
                );
              } else
                return (
                  <div key={e.id} className={styles.childDrop} onClick={() => handleItemClick(e)}>
                    {e.title}
                  </div>
                );
            })}
          </div>
        </div>
      )
    );
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

  return (
    <div>
      <Menu
        open={!!menuPosition}
        onClose={() => {
          setMenuPosition(null);
          props.onSmallCLose();
        }}
        anchorReference="anchorPosition"
        anchorPosition={menuPosition}
        disableAutoFocusItem
        className={styles.bigDrop}
      >
        {Array.isArray(allCategories) &&
          allCategories.map((e) => {
            if (e?.children) {
              // let isSub = checkSub(e);
              let isSub = true;
              return isSub ? (
                dropTree(e)
              ) : (
                <MenuItem key={e.id} onClick={() => handleItemClick(e)}>
                  {e.title}
                </MenuItem>
              );
            } else
              return e.video_count || e.num_modules ? null : (
                <MenuItem onClick={() => handleItemClick(e)} key={e.id}>
                  {e.title}
                </MenuItem>
              );
          })}
      </Menu>

      <Snackbar open={openSnackBar} autoHideDuration={1500} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning">
          Please select an inner level!
        </Alert>
      </Snackbar>

      {/* ============SMALL DROP============ */}
      <Dialog
        onClose={props.onSmallCLose}
        aria-labelledby="simple-dialog-title"
        open={props.isSmall}
        className={styles.smallDrop}
        TransitionComponent={Transition}
        fullScreen
      >
        <div onClick={() => props.onSmallCLose()} className={styles.smallClose}>
          <div>Close</div>
          <img src={Arrow} alt="" />
        </div>
        <div className={styles.content}>{smallDropTree(allSmallCategories, null)}</div>
      </Dialog>
    </div>
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

export default connect(mapStatesToProps, mapDispatchToProps)(AdvancedDrop);
