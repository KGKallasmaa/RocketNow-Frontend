import React from "react";


export default class SellerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seller_info: [],
            query: '',
            loading: true
        };
    }

    //Getting initial data
    componentDidMount() {
        const name = this.props.match.params.name;
        this.setState({name: name})
    }

    render() {
        return (
            <div>
                <h1>This page is still under construction</h1>
                <h6>Welcome to the sellers page of {this.state.name}</h6>
            </div>
        );
    }
}
