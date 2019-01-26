import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { AuthConsumer } from "../AuthContext/AuthContext";

export interface IAuthRouteProps extends RouteProps {
  component: any;
  authenticate?: string[];
}

// TODO: TypeScript related JSX problem -> any
const AuthRoute: (props: IAuthRouteProps) => any = ({
  component: Component,
  authenticate,
  ...rest
}) => (
  <AuthConsumer>
    {({ auth, userInfo }) => (
      <Route
        // tslint:disable-next-line: jsx-no-lambda
        render={props => {
          if (!auth) {
            return <Redirect push={true} to="/login" />;
          }

          if (
            !authenticate ||
            (authenticate && authenticate.includes(userInfo.role))
          ) {
            return <Component {...props} />;
          } else {
            return <Redirect push={true} to="/login" />;
          }
        }}
        {...rest}
      />
    )}
  </AuthConsumer>
);

export default AuthRoute;
