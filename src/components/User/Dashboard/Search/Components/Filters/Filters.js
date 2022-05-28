import React, { Component } from "react";
import "./filters.css";
import { IconButton } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import CheckBox from "./CheckBox";

var jsonData = require("../../search.json");

export default class Filters extends Component {
  state = {
    showTopics: true,
    showLevel: true,
    showLanguage: true,
    showFeatures: true,
    topics: [],
  };
  handleChange = (e, type, id) => {
    this.props.handleChange(e, type, id);
  };
  // componentDidMount = async () => {
  //     let topics = await Get(0, "get_all_courses");
  //     console.log(topics.data.data);
  //     this.setState({ topics: topics.data.data.topics });
  // }
  render() {
    const { showLevel, showLanguage, showFeatures } = this.state;
    const { state } = this.props;
    return (
      <>
        <h3>{jsonData.filter.filterBy}</h3>
        <div className="search_divider"></div>

        {/* <div className="search_filter">
                    <div className="search_filter_top">
                        <h4>Topic</h4>
                        <IconButton onClick={() => { this.setState({ showTopics: !showTopics }) }}>
                            {!showTopics ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                        </IconButton>
                    </div>
                    {showTopics && <div className="search_filters">
                        {this.props.topics.map((e) => (
                            <CheckBox title={e.title} selected={state[e.title] ? true : false} handleChange={this.handleChange} id={e.id} key={e.id} num={e.num_topics} type="topic" />
                        ))}
                    </div>}
                </div> */}
        <div className="search_filter">
          <div className="search_filter_top">
            <h4>{jsonData.filter.features}</h4>
            <IconButton
              onClick={() => {
                this.setState({ showFeatures: !showFeatures });
              }}
            >
              {!showFeatures ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </div>
          {showFeatures && (
            <div className="search_filters">
              <CheckBox
                title={jsonData.filter.courses}
                selected={state.Courses ? true : false}
                handleChange={(e) => {
                  this.props.handleFeaturesChange(e);
                }}
                num={null}
              />
              <CheckBox
                title={jsonData.filter.videos}
                selected={state.Videos ? true : false}
                handleChange={(e) => {
                  this.props.handleFeaturesChange(e);
                }}
                num={null}
              />
              <CheckBox
                title={jsonData.filter.notes}
                selected={state.Notes ? true : false}
                handleChange={(e) => {
                  this.props.handleFeaturesChange(e);
                }}
                num={null}
              />
              <CheckBox
                title={jsonData.filter.pdf}
                selected={state["Reading Material"] ? true : false}
                handleChange={(e) => {
                  this.props.handleFeaturesChange(e);
                }}
                num={null}
              />
              <CheckBox
                title={jsonData.filter.qa}
                selected={state["Q & A"] ? true : false}
                handleChange={(e) => {
                  this.props.handleFeaturesChange(e);
                }}
                num={null}
              />
            </div>
          )}
        </div>
        <div className="search_divider"></div>

        <div className="search_filter">
          <div className="search_filter_top">
            <h4>{jsonData.filter.level}</h4>
            <IconButton
              onClick={() => {
                this.setState({ showLevel: !showLevel });
              }}
            >
              {!showLevel ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </div>
          {showLevel && (
            <div className="search_filters">
              <CheckBox
                title={jsonData.filter.beginner}
                selected={state.Beginner ? true : false}
                handleChange={this.handleChange}
                id={0}
                type="level"
              />
              <CheckBox
                title={jsonData.filter.intermediate}
                selected={state.Intermediate ? true : false}
                handleChange={this.handleChange}
                id={1}
                type="level"
              />
              <CheckBox
                title={jsonData.filter.advance}
                selected={state.Advance ? true : false}
                handleChange={this.handleChange}
                id={2}
                type="level"
              />
            </div>
          )}
        </div>

        <div className="search_divider"></div>

        <div className="search_filter">
          <div className="search_filter_top">
            <h4>{jsonData.filter.language}</h4>
            <IconButton
              onClick={() => {
                this.setState({ showLanguage: !showLanguage });
              }}
            >
              {!showLanguage ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </div>
          {showLanguage && (
            <div className="search_filters">
              <CheckBox title={jsonData.filter.english} selected={true} handleChange={this.handleChange} />
            </div>
          )}
        </div>
        <div className="search_divider"></div>
      </>
    );
  }
}
