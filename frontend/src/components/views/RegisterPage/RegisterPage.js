import React, { useState } from "react";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Typography, message, Modal } from "antd";
import EmailCheckModal from "./CheckModal/EmailCheckModal";
import Axios from "axios";

//---------------------------------------------------------------------------------------------//

const { Title } = Typography;

//---------------------------------------------------------------------------------------------// RegisterPage

function RegisterPage(props) {
  const dispatch = useDispatch();

  const [CheckId, setCheckId] = useState(false);
  const [CheckEmail, setCheckEmail] = useState(false);

  //---------------------------------------------------------------------------------------------// Check Handler

  const onCheckIdHandler = (e) => {
    e.preventDefault();

    const Id = document.getElementById("id").value;

    if (Id.length < 6) {
      message.error("아이디의 길이는 최소 6자리 이상이어야 합니다.");
    } else {
      let body = {
        id: Id,
      };

      Axios.post("/api/users/check_id", body).then((response) => {
        if (response.data.success) {
          message.success("사용가능합니다.");
          setCheckId(true);
        } else {
          message.error("현재 사용중인 아이디입니다.");
        }
      });
    }
  };

  const onCheckEmailHandler = (e) => {
    e.preventDefault();

    const Email = document.getElementById("email").value;
    const Id = document.getElementById("id").value;

    const email_check = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (!Email.match(email_check)) {
      return message.error("올바른 이메일 형식을 입력하세요.");
    }
    let body = {
      email: Email,
      id: Id,
    };

    Axios.post("/api/users/check_email", body).then((response) => {
      if (response.data === false) {
        alert("인증화면 렌딩 실패.");
      } else {
        info(response.data, Email);
        message.success("인증화면으로 이동합니다.");
      }
    });
  };

  const info = (secret, email) => {
    Modal.info({
      title: "이메일 인증하기",
      content: <EmailCheckModal Email={email} />,
      okText: "인증",
      onOk() {
        const secret_code = Number(secret);
        const secret_input = Number(
          document.getElementById("email_secret").value
        );

        if (String(secret_input).length !== 6) {
          message.warning("6자리의 숫자코드를 입력해주세요.");
        } else if (secret_code !== secret_input) {
          message.error("숫자코드가 일치하지 않습니다.");
        } else {
          setCheckEmail(true);
          message.success("이메일 인증을 성공했습니다.");
        }
      },
      onCancel() {
        message.error("이메일 인증을 종료했습니다.");
      },
    });
  };

  //---------------------------------------------------------------------------------------------// return

  return (
    <Formik
      initialValues={{
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={Yup.object().shape({
        id: Yup.string()
          .min(6, "아이디의 길이는 최소 6자리 이상")
          .required("아이디를 입력해주세요."),
        password: Yup.string()
          .min(6, "비밀번호의 길이는 최소 6자리 이상이어야 합니다.")
          .required("비밀번호를 입력해주세요."),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "비밀번호가 일치하지 않습니다.")
          .required("비밀번호 재확인을 입력해주세요."),
        name: Yup.string().required("이름을 입력해주세요."),
        email: Yup.string()
          .email("올바른 이메일 형식이 아닙니다.")
          .required("이메일을 입력해주세요."),
      })}
      //---------------------------------------------------------------------------------------------// onSubmit

      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            id: values.id,
            password: values.password,
            name: values.name,
            email: values.email,
            image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`,
          };

          if (CheckId && CheckEmail) {
            dispatch(registerUser(dataToSubmit)).then((response) => {
              if (response.payload.success) {
                message.success("회원가입을 성공했습니다!");
                props.history.push("/login");
              } else {
                message.error(
                  "이미 사용중인 이메일로는 회원가입을 할 수 없습니다."
                );
              }
            });
          } else {
            message.error("아이디 중복확인 또는 이메일 인증을 해주세요.");
          }

          setSubmitting(false);
        }, 500);
      }}
    >
      {/* //---------------------------------------------------------------------------------------------// Formik 태그 사이 시작*/}

      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;

        /* //---------------------------------------------------------------------------------------------// render */

        return (
          <div className="app" style={{ height: "100%" }}>
            <div style={{ paddingTop: "70px" }}>
              <Title level={2}>SNS품앗이</Title>
            </div>

            <Form
              style={{
                width: "350px",
                paddingTop: "20px",
              }}
              onSubmit={handleSubmit}
            >
              {/* //---------------------------------------------------------------------------------------------// id*/}

              <Form.Item
                required
                label="아이디"
                hasFeedback
                validateStatus={CheckId ? "success" : "warning"}
                style={{ marginBottom: "-10px" }}
              >
                <Input
                  id="id"
                  placeholder="아이디 입력(6~15자)"
                  type="text"
                  value={values.id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.id && touched.id ? "text-input error" : "text-input"
                  }
                  style={{ height: "50px" }}
                />
                <Button
                  onClick={onCheckIdHandler}
                  type="primary"
                  style={{ float: "right" }}
                >
                  <span>중복확인</span>
                </Button>

                {errors.id && touched.id && (
                  <div className="input-feedback">{errors.id}</div>
                )}
              </Form.Item>

              {/* //---------------------------------------------------------------------------------------------// Password*/}

              <Form.Item
                required
                label="비밀번호"
                hasFeedback
                validateStatus={
                  errors.password && touched.password ? "error" : "success"
                }
              >
                <Input
                  id="password"
                  placeholder="비밀번호 입력(최소 6자리 이상)"
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

              {/* //---------------------------------------------------------------------------------------------// confirmPassword*/}

              <Form.Item required label="비밀번호 확인" hasFeedback>
                <Input
                  id="confirmPassword"
                  placeholder="비밀번호 확인"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword
                      ? "text-input error"
                      : "text-input"
                  }
                  style={{ height: "50px" }}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="input-feedback">{errors.confirmPassword}</div>
                )}
              </Form.Item>

              {/* //---------------------------------------------------------------------------------------------// name*/}

              <Form.Item required label="이름">
                <Input
                  id="name"
                  placeholder="이름 입력"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.name && touched.name
                      ? "text-input error"
                      : "text-input"
                  }
                  style={{ height: "50px" }}
                />
                {errors.name && touched.name && (
                  <div className="input-feedback">{errors.name}</div>
                )}
              </Form.Item>

              {/* //---------------------------------------------------------------------------------------------// Email*/}

              <Form.Item
                required
                label="본인 확인 이메일"
                hasFeedback
                validateStatus={CheckEmail ? "success" : "warning"}
              >
                <Input
                  id="email"
                  placeholder="이메일 입력"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email
                      ? "text-input error"
                      : "text-input"
                  }
                  disabled={CheckEmail ? true : false}
                  style={{ height: "50px" }}
                />
                <Button
                  onClick={onCheckEmailHandler}
                  type="primary"
                  style={{ float: "right" }}
                >
                  <span>인증하기</span>
                </Button>
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </Form.Item>

              {/* //---------------------------------------------------------------------------------------------// submit*/}

              <Form.Item>
                <Button
                  onClick={handleSubmit}
                  type="primary"
                  disabled={isSubmitting}
                  style={{
                    minWidth: "100%",
                    height: "50px",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>가입하기</span>
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      }}
      {/* //---------------------------------------------------------------------------------------------// Formik 태그 사이 끝*/}
    </Formik>
  );
}

export default RegisterPage;
