import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import routes from './routes.js'
import socketService from './services/socketService';

export function App() {
  socketService.setup();
  return (
    <Router>
      <main className="app">
        <Switch>
          {routes.map(route => <Route key={route.path} exact component={route.component} path={route.path} />)}
        </Switch>
      </main>
    </Router>
  );
}

