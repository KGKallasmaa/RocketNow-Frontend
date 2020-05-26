import React from 'react';
import { isRegularUserLoggedIn } from '../../components/authentication';
import NotLoggedInHomepage from './components/notLoggedInHomePage';
import LoggedInHomepage from './components/loggedInHomePage';

export default class Home extends React.PureComponent {
  render() {
    const userIsLoggedIn = isRegularUserLoggedIn();
    if (!userIsLoggedIn) {
      return <NotLoggedInHomepage />;
    }
    return <LoggedInHomepage />;
  }
}
