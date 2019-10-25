import React from 'react';


export default class CategoryPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const category = this.props.match.params.category;
        return (
            <div>
               Welcome to {category} page. The page is still under development.
            </div>
        );
    }
}