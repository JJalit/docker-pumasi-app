/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { auth } from "../_actions/user_actions";
import { useSelector, useDispatch } from "react-redux";

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    let user = useSelector((state) => state.user); // useSelector는 redux store에 있는 user의 데이터 값을 가져오기 위함(조회 기능)

    const dispatch = useDispatch();

    //
    useEffect(() => {
      //To know my current status, send Auth request
      dispatch(auth()).then((response) => {
        // 로그인 하지 않은 상태

        if (!response.payload.isAuth) {
          if (option) {
            props.history.push("/login");
          }

          // 로그인 한 상태
        } else {
          //supposed to be Admin page, but not admin person wants to go inside
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          }
          //Logged in Status, but Try to go into log in page
          else {
            if (option === false) {
              props.history.push("/");
            }
          }
        }
      });
    }, []);

    return <SpecificComponent {...props} user={user} />;
  }
  return AuthenticationCheck;
}
