import React from "react";
import { Card, Col, message, Row } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./UserCardBlock.css";

const { Meta } = Card;
function UserCardBlock(props) {
  const renderItems = () =>
    props.articles &&
    props.articles.map((article, i) => (
      <Col lg={8} md={12} xs={24} key={i}>
        <Card
          hoverable
          style={{
            width: 300,
            overflow: "hidden",
          }}
          cover={
            <a href={article.articleUrl}>
              <img
                alt="사진"
                src={`http://localhost:5000/${article.filepath}`}
              />
            </a>
          }
          actions={[
            <button
              style={{
                border: "0",
                outline: "0",
                backgroundColor: "#FAFAFA",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => {
                message.info("현재 개발중에 있습니다. 죄송합니다.");
              }}
            >
              <SettingOutlined key="setting" />
            </button>,
            <button
              style={{
                border: "0",
                outline: "0",
                backgroundColor: "#FAFAFA",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => {
                message.info("현재 개발중에 있습니다. 죄송합니다.");
              }}
            >
              <EditOutlined key="edit" />
            </button>,
            <button
              style={{
                border: "0",
                outline: "0",
                backgroundColor: "#FAFAFA",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => props.deleteArticle(article._id)}
            >
              <DeleteOutlined key="delete" />
            </button>,
          ]}
        >
          <Meta
            title={article.title}
            description={article.description}
            style={{
              width: "100%",
              height: "9vw",
              overflow: "hidden",
            }}
          />
        </Card>
      </Col>
    ));

  //---------------------------------------------------------------------------------------------// return

  return (
    <div
      className="manageImage"
      style={{
        width: "75%",
        margin: "3rem auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Row gutter={[16, 16]}>{renderItems()}</Row>
    </div>
  );
}

export default UserCardBlock;
