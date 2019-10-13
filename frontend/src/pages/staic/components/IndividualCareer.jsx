import React from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";


export default (props) => {
    return(
        <div className="col-md-6 col-lg-4 item">
            <div className="box">
                <LazyLoadImage
                    alt={props.name + "career"}
                    src={props.img}
                />
                <h4 className="name">{props.name}</h4>
                <p className="title">{props.title}</p>
                <p className="description">{props.description}</p>
                <div className="social"><a href="#"><i className="fa fa-envelope"/></a></div>
                <a className="btn btn-primary btn-block btn-sm bg-primary border rounded" role="button"
                   href="https://forms.gle/sSwYoRUo4tX8rvzz7">Apply now
                </a>
            </div>
        </div>
    );
};