import React from 'react';
import LazyLoad from 'react-lazyload';

export default (props) => {
  return (
    <div className="col-md-6 col-lg-4 item">
      <div className="box">
        <LazyLoad>
          <img alt={props.name + 'career'} src={props.img} />
        </LazyLoad>
        <h4 className="name">{props.name}</h4>
        <p className="title">{props.title}</p>
        <p className="description">{props.description}</p>
        <div className="social">
          <a href="#">
            <i className="fa fa-envelope" />
          </a>
        </div>
        <br />
        <a
          className="btn btn-primary btn-block btn-sm bg-primary border rounded"
          role="button"
          href="https://forms.gle/sSwYoRUo4tX8rvzz7"
          aria-label={'Apply for the position'}
        >
          Apply now
        </a>
      </div>
      <br />
      <br />
    </div>
  );
};
