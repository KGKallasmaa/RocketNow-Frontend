import React from 'react';
import ReactDOM from 'react-dom';
import Asd from './asd';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Asd />, div);
  ReactDOM.unmountComponentAtNode(div);
});
