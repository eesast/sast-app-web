import React from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthConsumer } from "../AuthContext/AuthContext";

const AuthRoute = ({ component: Component, authenticate, ...rest }) => (
  <AuthConsumer>
    {({ decodeToken, isTokenValid, ...restContext }) => (
      <Route
        {...rest}
        render={props =>
          isTokenValid() &&
          (authenticate ? authenticate.includes(decodeToken().role) : true) ? (
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
