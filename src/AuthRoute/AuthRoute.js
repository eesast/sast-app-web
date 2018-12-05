import React from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthConsumer } from "../AuthContext/AuthContext";

const AuthRoute = ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {({ isTokenValid, ...restContext }) => (
      <Route
        {...rest}
        render={props =>
          isTokenValid() ? (
            <Component {...props} />
          ) : (
            <Redirect push to="/login" />
          )
        }
      />
    )}
  </AuthConsumer>
);

export default AuthRoute;
