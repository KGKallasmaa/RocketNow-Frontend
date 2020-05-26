import React from 'react';
import { AddToCart } from '../../../components/modifyCart';
import LazyLoad from 'react-lazyload';

const recommendStyle = { maxWidth: '100%' };

export default React.memo((props) => {
  const good = props.good;
  const maxDiscriptionLenght = 80;
  const description =
    good.description.length > maxDiscriptionLenght
      ? good.description.substring(0, maxDiscriptionLenght - 3) + '...'
      : good.description;
  const good_url = '/goods/' + good.nr + '/' + good.title;
  return (
    <div className="col-sm-6 col-md-5 col-lg-4 item">
      <div className="box" style={recommendStyle}>
        <a href={good_url} aria-label={'View recommended good: ' + good.title}>
          <LazyLoad>
            <img alt={good.title} src={good.main_image_cloudinary_secure_url} width={'250px'} />
          </LazyLoad>
        </a>
        <br />
        <h3 className="name">{good.title}</h3>
        <p className="description">{description}</p>
        <AddToCart title={good.title} quantity={1} good_id={good._id} />
      </div>
    </div>
  );
});
