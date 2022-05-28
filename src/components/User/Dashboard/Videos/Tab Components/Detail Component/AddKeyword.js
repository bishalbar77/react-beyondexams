import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import swal from "sweetalert";
import baseDomain from "../../../../../common/baseDomain";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: "60px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: "1px solid #C4C4C4",
    borderRadius: "24px",
    height: "42px",
    background: "#FAFAFA",
  },

  input: {
    marginLeft: theme.spacing(2),
    flex: 1,
    padding: "6px 0 4px",
    fontSize: "14px",
  },

  iconButtonDiv: {
    marginRight: "2px",
    height: "36px",
    width: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#DDD4FE",
    "&:hover": {
      background: "var(--color1)",
      color: "white",
    },
    "&:hover svg": {
      background: "var(--color1)",
      color: "white",
    },
  },
  BgActive: {
    background: "var(--color1)",
  },
  IconButton: {
    transform: "rotate(-38deg)",
    padding: "6px 4px 6px 9px",
  },
  IconButtonActive: {
    transform: "rotate(-38deg)",
    padding: "6px 4px 6px 9px",
    color: "white",
  },
}));

export default function CustomizedInputBase(props) {
  const classes = useStyles();
  const [tags, setTags] = React.useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // axios({
    //   url: `${baseDomain.route}${baseDomain.subRoute}/get_keywords_of_videos`,
    //   method: "GET",
    //   params: {
    //     video_url: props.id,
    //   },
    // })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
    axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/add_keyword_to_video`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
      data: {
        keyword: tags,
        video_url: props.id,
      },
    })
      .then(() => {
        swal("Success", "Keyword added successfully.", "success");
        props.handleAddKeyword(tags);
        setTags("");
      })
      .catch((e) => {
        console.log(e);
        swal("Error", e.response.data.message, "error");
      });
  };
  const handleChange = (e) => {
    setTags(e.target.value);
  };
  return (
    <Paper
      elevation={0}
      component="form"
      onSubmit={handleSubmit}
      className={`${classes.root} ${tags ? classes.rootBgActive : classes.rootBg}`}
      data-tut="keyword"
    >
      <InputBase
        onChange={handleChange}
        value={tags}
        className={classes.input}
        placeholder="Add a relevant keyword to the video"
        required
      />
      <div className={`${classes.iconButtonDiv} ${tags ? classes.BgActive : ""}`}>
        <IconButton type="submit" className={tags ? classes.IconButtonActive : classes.IconButton}>
          <SendIcon fontSize="small" style={{ fontSize: "18px" }} />
        </IconButton>
      </div>
    </Paper>
  );
}
