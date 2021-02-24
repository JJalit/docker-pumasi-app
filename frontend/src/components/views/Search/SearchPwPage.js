import React, { useState } from "react";
import { Button, Form, Input, Radio, Typography, Modal, message } from "antd";
import { withRouter } from "react-router-dom";
import SearchModal from "./SearchModal/SearchModal";
import SuccessModal from "./SearchModal/SuccessModal";
import axios from "axios";

//---------------------------------------------------------------------------------------------// Destructuring assignment

const { Title } = Typography;

const lists = [
  { key: 1, value: "아이디 찾기" },
  { key: 2, value: "비밀번호 찾기" },
];

//---------------------------------------------------------------------------------------------// function SearchIdPage

function SearchPwPage(props) {
  const [Id, setId] = useState("");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Item, setItem] = useState("비밀번호 찾기");

  //---------------------------------------------------------------------------------------------// handler

  const renderRadioBox = () =>
    lists.map((item, index) => (
      <Radio.Button
        key={index}
        value={item.value}
        style={{
          width: "175px",
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {item.value}
      </Radio.Button>
    ));

  const onIdHandler = (e) => {
    setId(e.currentTarget.value);
  };

  const onNameHandler = (e) => {
    setName(e.currentTarget.value);
  };

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };

  const onItemChange = (e) => {
    setItem(e.target.value);
    if (e.target.value === "아이디 찾기") {
      props.history.push("/login/searchId");
    }
  };

  //---------------------------------------------------------------------------------------------// Modal

  const success = (secret, userData) => {
    //비밀번호 찾기 모달

    Modal.info({
      title: "비밀번호 찾기",
      content: <SearchModal UserData={userData} />,
      okText: "확인",
      onOk() {
        const secret_code = Number(secret);
        const secret_input = Number(document.getElementById("pw_secret").value);

        if (String(secret_input).length !== 6) {
          message.warning("6자리의 숫자코드를 입력해주세요.");
        } else if (secret_code !== secret_input) {
          message.error("숫자코드가 일치하지 않습니다.");
        } else {
          //비밀번호 변경 모달

          Modal.success({
            title: "비밀번호 변경",
            content: <SuccessModal />,
            okText: "변경",

            onOk() {
              const change_password = document.getElementById("change_password")
                .value;
              const check_change_password = document.getElementById(
                "check_change_password"
              ).value;

              if (change_password.length < 6) {
                message.error(
                  "비밀번호의 길이는 최소 6자리 이상이어야 합니다."
                );
              } else if (change_password !== check_change_password) {
                message.error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
              } else {
                let body = {
                  user_id: userData.id,
                  new_pw: change_password,
                };

                axios.post("/api/search/pw/change", body).then((response) => {
                  if (response.data.success) {
                    message.success("비밀번호가 성공적으로 변경되었습니다.");
                    props.history.push("/login");
                  } else {
                    message.error("비밀번호 변경을 실패했습니다.");
                  }
                });
              }
            },
            onCancel() {
              props.history.go(0);
              message.error("비밀번호 찾기를 종료했습니다.");
            },
          });
        }
      },
      onCancel() {
        props.history.go(0);
        message.error("비밀번호 찾기를 종료했습니다.");
      },
    });
  };

  const warning = () => {
    Modal.warning({
      title: "비밀번호 찾기 실패",
      content: <p>입력한 정보가 올바르지 않습니다.</p>,
      onOk() {
        props.history.go(0);
      },
    });
  };

  //---------------------------------------------------------------------------------------------// onSubmit

  const onSubmit = (e) => {
    if (!Id || !Name || !Email) {
      message.error("모두 입력해주세요.");
    } else {
      e.preventDefault();

      let body = {
        id: Id,
        name: Name,
        email: Email,
      };

      axios.post("/api/search/pw", body).then((response) => {
        // body를 같이 보낼 때는 무조건 post 써라
        if (response.data === false) {
          warning();
        } else {
          success(response.data.secret, response.data.result);
        }
      });
    }
  };
  //---------------------------------------------------------------------------------------------// return

  return (
    <div className="app">
      <Title level={2}>비밀번호 찾기</Title>

      <form style={{ width: "350px", paddingTop: "30px" }} onSubmit={onSubmit}>
        <Form.Item>
          <Radio.Group
            onChange={onItemChange}
            value={Item}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {renderRadioBox()}
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Input
            onChange={onIdHandler}
            value={Id}
            placeholder="아이디 입력"
            style={{ height: "50px" }}
          />
        </Form.Item>

        <Form.Item>
          <Input
            onChange={onNameHandler}
            value={Name}
            placeholder="이름 입력"
            style={{ height: "50px" }}
          />
        </Form.Item>

        <Form.Item>
          <Input
            onChange={onEmailHandler}
            value={Email}
            placeholder="이메일 입력"
            style={{ height: "50px" }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              minWidth: "100%",
              height: "50px",
            }}
            onClick={onSubmit}
          >
            <span style={{ fontSize: "18px" }}>비밀번호 찾기</span>
          </Button>
        </Form.Item>
      </form>
    </div>
  );
}

export default withRouter(SearchPwPage);
