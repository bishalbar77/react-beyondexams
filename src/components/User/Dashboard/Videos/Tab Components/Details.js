import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Popper from "@material-ui/core/Popper";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import PanoramaFishEyeOutlinedIcon from "@material-ui/icons/PanoramaFishEyeOutlined";
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import Rating from "@material-ui/lab/Rating";
import React from "react";
// import Bookmark from "../../../../../assets/images/icons/bookmark.svg";
import Group1190 from "../../../../../assets/images/icons/Group-1190.png";
import { Format, VideoDate } from "../../../../common/videocommon.js";
import AddKeyword from "./Detail Component/AddKeyword";
import Klapz from "./Klapz";

function Details({ props, starsCount, giveRate, classes }) {
  const [downy, setDowny] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const [keywords, setKeywords] = React.useState(props.video.keywords.map((key) => key.keyword) || []);
  return (
    <div className="ui segment">
      <div className="flex space-between phone_auto_margin">
        {/* <Rating
          name="star-rating"
          value={starsCount}
          icon={<StarRoundedIcon fontSize="inherit" />}
          size="large"
          emptyIcon={<StarBorderIcon fontSize="inherit" style={{ color: "#febe16" }} />}
          onChange={(event, newValue) => {
            giveRate(newValue);
          }}
        /> */}
        <div className="flex space-between desktop_view">
          <div className="flex viewCount" style={{ paddingLeft: "4px", marginRight: 10 }}>
            {/* <VisibilityOutlinedIcon
              className={classes.icon}
              fontSize="inherit"
            /> */}
            <p>{Format(props.video.total_view)} Views</p>
          </div>

          <div className="flex viewCount">
            <PanoramaFishEyeOutlinedIcon className={classes.fishEye} />
            <p>{VideoDate(props.video.publishedAt)}</p>
          </div>
        </div>
        <Klapz id={props.video.url}>
          <div style={{ textAlign: "center" }}>
            <div className="flex klapz_button">
              <img src={Group1190} className="klapz-icon" alt="" />
              <p>Klapz</p>
            </div>
            <p className="klapz_text">{props.video?.channelTitle}</p>
          </div>
        </Klapz>
      </div>
      <div className="flex phone_view" style={{ marginBottom: 25 }}>
        <div className="viewCount" style={{ paddingLeft: "4px", marginRight: 10 }}>
          {/* <VisibilityOutlinedIcon
              className={classes.icon}
              fontSize="inherit"
            /> */}
          <p>{Format(props.video.total_view)} Views</p>
        </div>

        <div className="flex viewCount">
          <PanoramaFishEyeOutlinedIcon className={classes.fishEye} />
          <p>{VideoDate(props.video.publishedAt)}</p>
        </div>
      </div>
      <div className="flex-only">
        <div className="video-details-div">
          {/* <h4 className="header">
            {props.video.title
              .replace(/&#39;/g, "'")
              .replace(/&amp;/g, "&")
              .replace(/&quot;/g, "'")}
          </h4> */}
          <div id="desc">
            <p style={{ lineHeight: "1.42em", color: "#1D1D1D" }} className="ui description">
              {props.video.description.slice(0, 180)}
            </p>
          </div>
        </div>
        {/* {window.screen.width >= 1200 && (
          <div className="share-div">
            <Share
              share={props.share}
              title={props.video.title
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, "&")
                .replace(/&quot;/g, "'")}
            >
              <ShareIcon />
            </Share>
           
          </div>
        )} */}
      </div>

      {/* <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="left-start"
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <div className="drop-list">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                 
                  <MenuItem onClick={handleClose}>
                    <FlagOutlinedIcon className="menuIcon" /> Report
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ShareIcon className="menuIcon" /> Share
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper> */}
      <div>
        <div style={{ margin: "20px 0" }}>
          <AddKeyword id={props.video.url} handleAddKeyword={(e) => setKeywords([...keywords, e])} />
          <div id="tags" className="tag-container">
            <div className="tag-container-top">
              {keywords.length > 0 ? (
                <>
                  <ul>
                    {keywords
                      ? keywords.length < 6
                        ? keywords.map((tag, index) => (
                            <li
                              key={index}
                              ref={anchorRef}
                              aria-controls={open ? "menu-list-grow" : undefined}
                              aria-haspopup="true"
                              onClick={handleToggle}
                            >
                              {tag}
                            </li>
                          ))
                        : keywords.slice(0, 5).map((tag, index) => (
                            <li
                              key={index}
                              ref={anchorRef}
                              aria-controls={open ? "menu-list-grow" : undefined}
                              aria-haspopup="true"
                              onClick={handleToggle}
                            >
                              {tag}
                            </li>
                          ))
                      : ""}
                  </ul>
                  <ExpandMoreIcon
                    style={
                      downy
                        ? {
                            color: "#77af47",
                            fontSize: "24px",
                            transform: "rotateZ(180deg)",
                            cursor: "pointer",
                          }
                        : {
                            color: "#77af47",
                            fontSize: "24px",
                            cursor: "pointer",
                          }
                    }
                    onClick={() => setDowny(!downy)}
                  />
                </>
              ) : (
                ""
              )}
            </div>
            <ul className={`tag-container-bottom ${!downy ? "tag-container-bottom-hide" : ""}`}>
              {keywords && keywords.length > 5 ? (
                keywords.slice(6, keywords.length).map((tag, index) => (
                  <li
                    key={index}
                    ref={anchorRef}
                    aria-controls={open ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                  >
                    {tag}
                  </li>
                ))
              ) : (
                <li>No extra keywords found...</li>
              )}
            </ul>
          </div>
          {/* <div className="flex-column-only">
              <div className="rating-div">
                <div>
                  <Rating
                    name="star-rating"
                    value={starsCount}
                    icon={<StarRoundedIcon fontSize="inherit" />}
                    size="large"
                    emptyIcon={
                      <StarBorderIcon
                        fontSize="inherit"
                        style={{ color: "#febe16" }}
                      />
                    }
                    onChange={(event, newValue) => {
                      giveRate(newValue);
                    }}
                  />
                  <div className="flex space-between">
                    <div
                      className="flex viewCount"
                      style={{ paddingLeft: "4px" }}
                    >
                      <VisibilityOutlinedIcon
                        className={classes.icon}
                        fontSize="inherit"
                      />
                      <p>{Format(props.video.total_view)}</p>
                    </div>
                    <div className="flex viewCount">
                      <PanoramaFishEyeOutlinedIcon
                        className={classes.fishEye}
                      />
                      <p>{VideoDate(props.video.publishedAt)}</p>
                    </div>
                  </div>
                </div>
                {window.screen.width < 1200 && (
                  <div className="share-div-two">
                    <Share
                      share={props.share}
                      title={props.video.title
                        .replace(/&#39;/g, "'")
                        .replace(/&amp;/g, "&")
                        .replace(/&quot;/g, "'")}
                    >
                      <IconButton>
                        <ShareOutlinedIcon className={classes.black} />
                      </IconButton>
                    </Share>

                    <Klapz>
                      <img src={Group1190} className="klapz-icon" alt="" />
                    </Klapz>
                  </div>
                )}
              </div>
            </div> */}
          {/* <div className="flex-only">
            <div className="video-details-div">
              <h4 className="header">
                {props.video.title
                  .replace(/&#39;/g, "'")
                  .replace(/&amp;/g, "&")
                  .replace(/&quot;/g, "'")}
              </h4>
              <div id="desc">
                <p style={{ lineHeight: "1.42em" }} className="ui description">
                  {props.video.description.slice(0, 180)}
                </p>
              </div>
            </div>
            {window.screen.width >= 1200 && (
              <div className="share-div">
                <Share
                  share={props.share}
                  title={props.video.title
                    .replace(/&#39;/g, "'")
                    .replace(/&amp;/g, "&")
                    .replace(/&quot;/g, "'")}
                >
                  <IconButton>
                    <ShareOutlinedIcon className={classes.black} />
                  </IconButton>
                </Share>
                
              </div>
            )}
          </div> */}

          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            placement="left-start"
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps}>
                <div className="drop-list">
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                      {/* <MenuItem onClick={handleClose}>
                    <DeleteOutlineOutlinedIcon className="menuIcon" /> Delete
                  </MenuItem> */}
                      <MenuItem onClick={handleClose}>
                        <FlagOutlinedIcon className="menuIcon" /> Report
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <ShareOutlinedIcon className="menuIcon" /> Share
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </div>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    </div>
  );
}

export default Details;
