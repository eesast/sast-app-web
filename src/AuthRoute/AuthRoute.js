import React from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthConsumer } from "../AuthContext/AuthContext";

const AuthRoute = ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {({ auth, ...restContext }) => (
      <Route
        {...rest}
        render={props =>
          auth ? <Component {...props} /> : <Redirect push to="/login" />
        }
      />
    )}
  </AuthConsumer>
);

export default AuthRoute;
