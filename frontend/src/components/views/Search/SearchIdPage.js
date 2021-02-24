import React, { useState } from "react";
import { Button, Form, Input, Radio, Typography, Modal, message } from "antd";
import { withRouter } from "react-router-dom";

import axios from "axios";

//---------------------------------------------------------------------------------------------// Destructuring assignment

const { Title, Text } = Typography;

const lists = [
  { key: 1, value: "아이디 찾기" },
  { key: 2, value: "비밀번호 찾기" },
];

//---------------------------------------------------------------------------------------------// function SearchIdPage

function SearchIdPage(props) {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Item, setItem] = useState("아이디 찾기");

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

  const onNameHandler = (e) => {
    setName(e.currentTarget.value);
  };

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };

  const onItemChange = (e) => {
    setItem(e.target.value);
    if (e.target.value === "비밀번호 찾기") {
      props.history.push("/login/searchPw");
    }
  };

  const success = (value) => {
    Modal.success({
      title: "아이디 찾기 성공",
      content: (
        <p>
          회원님의 아이디는 <Text mark>{value}</Text> 입니다.
        </p>
      ),
      onOk() {
        props.history.push("/login");
        message.info("로그인 페이지로 이동합니다.");
      },
    });
  };

  const warning = () => {
    Modal.warning({
      title: "아이디 찾기 실패",
      content: <p>해당하는 아이디가 존재하지 않습니다.</p>,
      onOk() {
        props.history.go(0);
      },
    });
  };

  //---------------------------------------------------------------------------------------------// onSubmit

  const onSubmit = (e) => {
    if (!Name || !Email) {
      message.error("모두 입력해주세요.");
    } else {
      e.preventDefault();

      let body = {
        name: Name,
        email: Email,
      };

      axios.post("/api/search/id", body).then((response) => {
        // body를 같이 보낼 때는 무조건 post 써라
        if (response.data.success && response.data.result) {
          success(response.data.result.id);
        } else {
          warning();
        }
      });
    }
  };

  //---------------------------------------------------------------------------------------------// return

  return (
    <div className="app">
      <Title level={2}>아이디 찾기</Title>

      <Form style={{ width: "350px", paddingTop: "30px" }} onSubmit={onSubmit}>
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
            onChange={onNameHandler}
            type="text"
            value={Name}
            placeholder="이름 입력"
            style={{ height: "50px" }}
          />
        </Form.Item>

        <Form.Item>
          <Input
            onChange={onEmailHandler}
            type="email"
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
            <span style={{ fontSize: "18px" }}>아이디 찾기</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default withRouter(SearchIdPage);
