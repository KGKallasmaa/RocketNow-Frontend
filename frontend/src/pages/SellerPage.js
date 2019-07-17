import React from "react";


export default class SellerPage extends React.Component {
    state = {
        seller_info: [],
        query: '',
        loading: true
    };

    //Getting initial data
    componentDidMount() {
        const name = this.props.match.params.name;
        this.setState({name: name})
    }

    render() {
        return (
            <div>
                <h1>Welcome to the sellers page of {this.state.name}</h1>
            </div>
        );
    }
}
