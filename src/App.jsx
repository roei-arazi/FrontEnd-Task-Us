import React from 'react';
import {Route, Router, Switch} from 'react-router-dom'
import routes from './routes.js'



export function App() {
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

