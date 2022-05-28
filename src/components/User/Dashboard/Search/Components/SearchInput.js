import React, { Component } from 'react';
import SearchIcon from "@material-ui/icons/Search";

export default class SearchInput extends Component {
    state = {
        term: this.props.q
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.searchSubmit(this.state.term);
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.q !== this.props.q) {
            this.setState({ term: this.props.q })
        }
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    className="home-search-input"
                    placeholder="What do you want to learn today?"
                    autoComplete="off"
                    value={this.state.term}
                    onChange={(e) => {
                        this.setState({ term: e.target.value });
                    }}
                />
                <button type="submit" className={this.state.term ? "search_icon bg-color-yellow" : "search_icon"}>
                    <SearchIcon />
                </button>
            </form>
        )
    }
}
