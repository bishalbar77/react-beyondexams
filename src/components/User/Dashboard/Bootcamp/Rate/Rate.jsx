import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";
import styles from "./Rate.module.css";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded";
import { Post } from "../../../../common/common";
import Rating from "@material-ui/lab/Rating";

const useStyles = (theme) => ({
  paper: {
    borderRadius: "16px",
    width: "650px",
    padding: "5px",
    paddingBottom: "40px",
  },
  rating: {
    fontSize: "2.5rem",
  },
});
const labels = {
  1: "Very Bad",
  2: "Bad",
  3: "Average",
  4: "Good, what i expected",
  5: "Loved It !",
};

class Rate extends Component {
  state = {
    value: this.props.value ?? 4,
    hover: -1,
    review: "",
  };
  onSubmit = async () => {
    this.props.setLoading();
    await Post(1, "add_category_rating", {
      rating: this.state.value,
      category_id: this.props.course.id,
    });
    if (this.state.review) {
      await Post(1, "add_category_review", {
        review: this.state.review,
        category_id: this.props.course.id,
      });
    }
    this.props.handleClose("update");
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        open={this.props.open}
        onClose={() => this.props.handleClose()}
        classes={{ paper: classes.paper }}
        maxWidth="lg"
        scroll="body"
      >
        <div className={styles.top}>
          <IconButton onClick={() => this.props.handleClose()}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <div className={styles.mid}>
          <h3>Rate your experience to this course </h3>
          <p>{labels[this.state.hover !== -1 ? this.state.hover : this.state.value]}</p>
          <Rating
            value={this.state.value}
            className={classes.rating}
            icon={<StarRoundedIcon fontSize="inherit" />}
            emptyIcon={<StarBorderRoundedIcon style={{ color: "#febe16" }} fontSize="inherit" />}
            onChange={(event, value) => {
              this.setState({ value });
            }}
            onChangeActive={(event, hover) => {
              this.setState({ hover });
            }}
          />
          <textarea
            placeholder="Tell us more about your experience."
            className={styles.txt}
            rows={4}
            onChange={(e) => {
              this.setState({ review: e.target.value });
            }}
          ></textarea>
          <button onClick={this.onSubmit}>save & Continue</button>
        </div>
      </Dialog>
    );
  }
}
export default withStyles(useStyles)(Rate);
