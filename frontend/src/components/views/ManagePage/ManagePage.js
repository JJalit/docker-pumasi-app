import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCardBlock from "./Sections/UserCardBlock";
import { Typography, message, Empty, Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { confirm } = Modal;

function ManagePage(props) {
  const [Article, setArticle] = useState([]);

  //---------------------------------------------------------------------------------------------// useEffect

  useEffect(() => {
    if (props.user.userData && props.user.userData._id) {
      let userId = props.user.userData._id;
      axios
        .post(`/api/article/articles_by_id?id=${userId}`)
        .then((response) => {
          setArticle(response.data);
        })
        .catch((err) => alert(err));
    }
  }, [props.user.userData]);

  //---------------------------------------------------------------------------------------------// deleteFromDB

  let deleteFromDB = (articleId) => {
    confirm({
      title: "이 게시물을 삭제하겠습니까?",
      icon: <ExclamationCircleOutlined />,
      content: "삭제하면 복구할 수 없습니다.",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk() {
        axios.delete(`/api/article/delete?id=${articleId}`).then((response) => {
          if (response.data.success) {
            message.success("해당 게시물을 삭제했습니다.");
            props.history.go();
          } else {
            message.error("해당 게시물을 삭제하는데 실패했습니다.");
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  //---------------------------------------------------------------------------------------------// return

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Title level={2}>게시물 관리하기</Title>
      </div>
      <div>
        {Article.length > 0 ? (
          <UserCardBlock articles={Article} deleteArticle={deleteFromDB} />
        ) : (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              marginTop: 50,
              height: 240,
            }}
            description={<span>등록한 게시물이 없어요!</span>}
          >
            <Button type="primary" href="/article/upload">
              바로 등록하기
            </Button>
          </Empty>
        )}
      </div>
    </div>
  );
}

export default ManagePage;
