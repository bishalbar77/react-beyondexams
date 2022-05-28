import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DoneIcon from "@material-ui/icons/Done";
import Chip from "@material-ui/core/Chip";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import "../../../../assets/css/User/Dashboard/translate.css";

export default class Translate extends Component {
  state = {
    translateFrom: 0,
    translateTo: 0,
    label: "English",
    openFromLanguage: null,
    openToLanguage: null,
    translateArr: [],
    Japanese: false,
    French: false,
    Chinese: false,
    showValue: false,
  };
  translateFromTabChange = (e) => {
    this.setState({
      label: e.currentTarget.textContent,
    });
    this.toggleDropDown("openFromLanguage", null);
  };
  translateToTabChange = (e, val) => {
    this.setState({
      translateTo: val,
    });
  };

  toggleDropDown = (value, bool) => {
    this.setState({ [value]: bool });
  };
  translate = () => {
    this.setState({ showValue: true });
  };
  changeToLanguage = (e, index) => {
    let translateArr = [...this.state.translateArr];
    if (!this.state[e.currentTarget.textContent]) {
      translateArr[index] = {
        label: e.currentTarget.textContent,
        value: "translation",
      };
    } else delete translateArr[index];
    this.setState({
      [e.currentTarget.textContent]: Boolean(
        !this.state[e.currentTarget.textContent]
      ),
      translateArr: translateArr,
    });
  };

  render() {
    return (
      <div className="translate-root">
        <div className="translateLeft">
          <div className="translate_from">
            <Paper square style={{ width: "100%", display: "flex" }}>
              <Tabs
                value={this.state.translateFrom}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.translateFromTabChange}
              >
                <Tab label={this.state.label} />
              </Tabs>
              <IconButton
                aria-label="expand"
                color="primary"
                onClick={(event) =>
                  this.toggleDropDown("openFromLanguage", event.currentTarget)
                }
              >
                <ExpandMoreIcon />
              </IconButton>
              <Menu
                anchorEl={this.state.openFromLanguage}
                keepMounted
                open={Boolean(this.state.openFromLanguage)}
                onClose={() => this.toggleDropDown("openFromLanguage", null)}
              >
                <MenuItem onClick={this.translateFromTabChange}>Hindi</MenuItem>
                <MenuItem onClick={this.translateFromTabChange}>
                  German
                </MenuItem>
                <MenuItem onClick={this.translateFromTabChange}>
                  Spanish
                </MenuItem>
              </Menu>
            </Paper>
          </div>
          <div className="translate_from">
            <div style={{ width: "100%" }}>
              <TextField
                placeholder="Enter text here"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
              />
              <div
                className="flex"
                style={{ marginTop: "20px", justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={this.translate}
                >
                  Translate
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="translateRight">
          <div className="translate_to">
            <Paper
              square
              style={{
                padding: "0 20px",
                height: "48px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Chip
                // variant="outlined"
                variant="outlined"
                label="Select Language"
                color="primary"
                deleteIcon={<ExpandMoreIcon />}
                onDelete={(event) =>
                  this.toggleDropDown("openToLanguage", event.currentTarget)
                }
                onClick={(event) =>
                  this.toggleDropDown("openToLanguage", event.currentTarget)
                }
                style={{ marginRight: "10px" }}
              />

              <Menu
                anchorEl={this.state.openToLanguage}
                keepMounted
                open={Boolean(this.state.openToLanguage)}
                onClose={() => this.toggleDropDown("openToLanguage", null)}
              >
                <MenuItem onClick={(e) => this.changeToLanguage(e, 0)}>
                  Japanese
                  {this.state.Japanese && (
                    <DoneIcon style={{ marginLeft: "8px" }} />
                  )}
                </MenuItem>
                <MenuItem onClick={(e) => this.changeToLanguage(e, 1)}>
                  French
                  {this.state.French && (
                    <DoneIcon style={{ marginLeft: "8px" }} />
                  )}
                </MenuItem>
                <MenuItem onClick={(e) => this.changeToLanguage(e, 2)}>
                  Chinese
                  {this.state.Chinese && (
                    <DoneIcon style={{ marginLeft: "8px" }} />
                  )}
                </MenuItem>
              </Menu>
            </Paper>
          </div>
          <div className="translate_to">
            {this.state.translateArr.length ? (
              this.state.translateArr.map(
                (e, index) =>
                  e && (
                    <TextField
                      key={this.state.showValue ? index : index + 10}
                      label={e.label}
                      multiline
                      rows={4}
                      variant="outlined"
                      fullWidth
                      defaultValue={this.state.showValue ? e.value : " "}
                      style={{ marginBottom: "20px" }}
                    />
                  )
              )
            ) : (
              <TextField
                placeholder="Translation"
                disabled
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                label="translation"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
