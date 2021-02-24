import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Icon, Input, Button, Checkbox, Typography } from "antd";
import { useDispatch } from "react-redux";

//---------------------------------------------------------------------------------------------// Destructuring assignment

const { Title } = Typography;

//---------------------------------------------------------------------------------------------// function LoginPage

function LoginPage(props) {
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(rememberMeChecked);

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const initialId = localStorage.getItem("rememberMe")
    ? localStorage.getItem("rememberMe")
    : "";

  //---------------------------------------------------------------------------------------------// return

  return (
    <Formik
      initialValues={{
        id: initialId,
        password: "",
      }}
      validationSchema={Yup.object().shape({
        id: Yup.string().required("아이디를 입력해주세요."),
        password: Yup.string()
          .min(6, "비밀번호의 길이는 최소 6자리 이상입니다.")
          .required("비밀번호를 입력해주세요."),
      })}
      //---------------------------------------------------------------------------------------------// onSubmit

      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            id: values.id,
            password: values.password,
          };

          dispatch(loginUser(dataToSubmit))
            .then((response) => {
              if (response.payload.loginSuccess) {
                window.localStorage.setItem("userId", response.payload.userId);

                if (rememberMe === true) {
                  window.localStorage.setItem("rememberMe", values.id); //?
                } else {
                  localStorage.removeItem("rememberMe");
                }
                props.history.push("/");
              } else {
                setFormErrorMessage(
                  "가입하지 않은 아이디이거나, 잘못된 비밀번호입니다."
                );
              }
            })

            .catch((err) => {
              setFormErrorMessage(
                "가입하지 않은 아이디이거나, 잘못된 비밀번호입니다."
              );
              setTimeout(() => {
                setFormErrorMessage("");
              }, 3000);
            });
          setSubmitting(false);
        }, 500);
      }}
    >
      {/* //---------------------------------------------------------------------------------------------// Formik 태그 사이 시작*/}

      {(props) => {
        // formik의 props들을 Destructuring assignment 구문으로 꺼내옴
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;

        //---------------------------------------------------------------------------------------------// render
        return (
          <div className="app">
            <Title level={2}>SNS품앗이</Title>

            <form
              onSubmit={handleSubmit}
              style={{ width: "350px", paddingTop: "30px" }}
            >
              {/* //---------------------------------------------------------------------------------------------// email */}

              <Form.Item required>
                <Input
                  id="id"
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="아이디"
                  type="text"
                  value={values.id === "undefined" ? "" : values.id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.id && touched.id ? "text-input error" : "text-input"
                  }
                  style={{ height: "50px" }}
                />
                {errors.id && touched.id && (
                  <div className="input-feedback">{errors.id}</div>
                )}
              </Form.Item>

              {/* //---------------------------------------------------------------------------------------------// password*/}

              <Form.Item required>
                <Input
                  id="password"
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="비밀번호"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password
                      ? "text-input error"
                      : "text-input"
                  }
                  style={{ height: "50px" }}
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>

              {formErrorMessage && (
                <label>
                  <p
                    style={{
                      color: "#ff0000bf",
                      fontSize: "0.8rem",
                      border: "1px solid",
                      padding: "1rem",
                      borderRadius: "10px",
                    }}
                  >
                    {formErrorMessage}
                  </p>
                </label>
              )}

              {/* //---------------------------------------------------------------------------------------------// rememberMe*/}

              <Form.Item>
                <Checkbox
                  id="rememberMe"
                  onChange={handleRememberMe}
                  checked={rememberMe}
                >
                  자동로그인
                </Checkbox>
                <div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{
                      minWidth: "100%",
                      height: "50px",
                      marginBottom: "20px",
                    }}
                    disabled={isSubmitting}
                    onSubmit={handleSubmit}
                  >
                    <span style={{ fontSize: "18px" }}>로그인</span>
                  </Button>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <a href="/register">회원 가입</a>
                  </div>
                  <div>|</div>
                  <div>
                    <a href="/login/searchId">아이디 찾기</a>
                  </div>
                  <div>|</div>
                  <div>
                    <a href="/login/searchPw">비밀번호 찾기</a>
                  </div>
                </div>
              </Form.Item>
            </form>
          </div>
        );
      }}

      {/* //---------------------------------------------------------------------------------------------// Formik 태그 사이 끝*/}
    </Formik>
  );
}

export default withRouter(LoginPage);
