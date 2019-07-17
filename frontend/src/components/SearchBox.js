import {Input} from 'antd';
import React from 'react';
import Redirect from "react-router-dom/es/Redirect";


const Search = Input.Search;


export default class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goods: [],
            query: ((this.props.query !== null)?this.props.query:''),
            redirect: false
        };
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch = (query) => {
        this.setState({
            query: query,
            redirect: true
        });

    };

    renderRedirect = () => {
        if (this.state.redirect === true) {
            const query = this.state.query;
            const redirect_url = '/search/' + query;
            return <Redirect to={redirect_url}/>
        }
    };

    //Todo: make search box size relative

    render() {
        const query = this.state.query;
        return (
            <div className="global-search" style={{width: 500, minWidth: 100}}>
                <Search
                    placeholder="Search ..."
                    onSearch={this.handleSearch}
                    size="large"
                    autosize={true}
                    onChange={event => {this.setState({query:event.target.value})}}
                    value={query}
                    compact = {true}
                    enterButton
                />
                {this.renderRedirect()}
            </div>
        );
    }
}