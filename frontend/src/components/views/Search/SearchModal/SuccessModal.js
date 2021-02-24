import React from "react";
import { Input, Typography } from "antd";

const { Text } = Typography;

function SuccessModal() {
  return (
    <div>
      <div
        style={{
          paddingTop: "30px",
        }}
      >
        <span style={{ paddingBottom: "30px" }}>
          <Text type="warning">변경하려는 비밀번호를 입력해주세요.</Text>
          <p>
            <Text type="secondary">영문 또는 숫자로 6~20자 입력</Text>
          </p>
        </span>
        <div style={{ paddingBottom: "25px" }}>
          <Input
            type="password"
            minLength="6"
            placeholder="새 비밀번호"
            id="change_password"
          />
        </div>
        <div>
          <Input
            type="password"
            minLength="6"
            placeholder="새 비밀번호 확인"
            id="check_change_password"
          />
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
