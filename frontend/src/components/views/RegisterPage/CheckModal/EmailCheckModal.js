import React from "react";
import { Input, Typography } from "antd";

const { Text } = Typography;

function EmailCheckModal(props) {
  return (
    <div>
      <div
        style={{
          paddingTop: "30px",
        }}
      >
        <p>
          <Text mark>{props.Email} </Text>이메일 주소로 전송된 <br />
          6자리 숫자코드를 입력해주세요
        </p>
        <Input
          type="text"
          maxLength="6"
          id="email_secret"
          placeholder="숫자코드 입력"
        />
      </div>
    </div>
  );
}

export default EmailCheckModal;
