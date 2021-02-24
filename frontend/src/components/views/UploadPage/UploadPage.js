import React, { useState } from "react";
import {
  Typography,
  Button,
  Form,
  message,
  Input,
  Select,
  Row,
  Col,
  Radio,
  Alert,
} from "antd";
import Dropzone from "react-dropzone";
import Axios from "axios";
import { useSelector } from "react-redux";
import { InboxOutlined } from "@ant-design/icons";

//---------------------------------------------------------------------------------------------// Destructuring assignment

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

//---------------------------------------------------------------------------------------------// list

const lists = [
  { key: 1, value: "블로그" },
  { key: 2, value: "인스타그램" },
  { key: 3, value: "페이스북" },
  { key: 4, value: "유튜브" },
  { key: 5, value: "클럽하우스" },
];

const MediaData = ["블로그", "인스타그램", "페이스북", "유튜브", "클럽하우스"];

const FilterData = {
  블로그: ["서이추", "공감", "댓글", "체류시간"],
  인스타그램: ["좋아요", "팔로우", "댓글"],
  페이스북: ["좋아요", "좋아하는 페이지", "친구추가", "댓글"],
  유튜브: ["구독", "댓글", "조회수", "좋아요"],
  클럽하우스: ["팔로우"],
};

//---------------------------------------------------------------------------------------------// State

function UploadPage(props) {
  const user = useSelector((state) => state.user);
  const [FilePath, setFilePath] = useState("");
  const [ImageTitle, setImageTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [ArticleUrl, setArticleUrl] = useState("");
  const [Item, setItem] = useState(0);
  const [Media, setMedia] = useState(FilterData[MediaData[0]]);
  const [Filter, setFilter] = useState(FilterData[MediaData[0]][0]);

  //---------------------------------------------------------------------------------------------// handler

  const onTitleChange = (e) => {
    setImageTitle(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onArticleUrlChange = (e) => {
    setArticleUrl(e.currentTarget.value);
  };

  const onItemChange = (e) => {
    setItem(e.target.value);
  };
  const MediaHandler = (value) => {
    setMedia(FilterData[value]);
    setFilter(FilterData[value][0]);
  };

  const FilterHandler = (value) => {
    setFilter(value);
  };

  //---------------------------------------------------------------------------------------------// onDrop, renderRadioBox

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    Axios.post("/api/article/uploadfiles", formData, config).then(
      (response) => {
        if (response.data.success) {
          setFilePath(response.data.url);
        } else {
          alert("사진 업로드를 실패했습니다.");
        }
      }
    );
  };

  const renderRadioBox = () =>
    lists.map((item) => (
      <Radio.Button key={item.key} value={item.value}>
        {item.value}
      </Radio.Button>
    ));

  //---------------------------------------------------------------------------------------------// onSubmit

  const onSubmit = (e) => {
    if (!ImageTitle || !Description || !ArticleUrl || !Filter) {
      message.error("모두 입력해주세요.");
      console.log(Media, Filter, Item);
    } else {
      e.preventDefault(); // refresh되는 것을 막는다. Why ? => 이후의 로직 실행이 안됨

      const variables = {
        writer: user.userData._id,
        title: ImageTitle,
        description: Description,
        filepath: FilePath,
        articleUrl: ArticleUrl,
        media: Item,
        filter: Filter,
      };

      Axios.post("/api/article/uploadImage", variables).then((response) => {
        if (response.data.success) {
          message.success("성공적으로 업로드를 했습니다.");

          props.history.push("/");
        } else {
          message.error("게시물 업로드에 실패 했습니다.");
        }
      });
    }
  };

  //---------------------------------------------------------------------------------------------// return

  return (
    <div style={{ width: "100%", padding: "3rem 4rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Title level={2}>게시물 등록하기</Title>
      </div>
      <br />
      <Form
        onSubmit={onSubmit}
        labelCol={{
          span: 4,
        }}
        layout="horizontal"
      >
        <Row gutter={[16, 16]}>
          <Col lg={12} sm={24}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {/* Image */}
              {FilePath && (
                <div>
                  <img
                    style={{
                      width: "295.5px",
                      height: "295.5px",
                      border: "1px solid lightgray",
                    }}
                    src={`http://localhost:5000/${FilePath}`}
                    alt="thumbnail"
                  />
                </div>
              )}
              <br />
              {/* Drop Zone */}
              <div>
                <Dropzone
                  onDrop={onDrop}
                  multiple={false}
                  maxSize={100000000000}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      style={{
                        width: "320px",
                        height: "120px",
                        display: "flex",
                        border: "1px solid #40a9ff",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        cursor: "pointer",
                      }}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <p>
                        <InboxOutlined
                          style={{ fontSize: "40px", color: "#40a9ff" }}
                        />
                      </p>
                      <span>사진 불러오기</span>
                    </div>
                  )}
                </Dropzone>
              </div>
              <div style={{ paddingTop: "20px" }}>
                <Alert
                  message="주의사항"
                  description="양식에 알맞지 않은 게시물은 별도 통보 없이 삭제됩니다."
                  type="info"
                  showIcon
                />
              </div>
            </div>
          </Col>
          <Col lg={12} sm={24}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Form.Item>
                <Radio.Group onChange={onItemChange} value={Item}>
                  {renderRadioBox()}
                </Radio.Group>
              </Form.Item>

              <Form.Item style={{ width: "80%" }}>
                <Input
                  onChange={onTitleChange}
                  value={ImageTitle}
                  placeholder="게시물 제목"
                />
              </Form.Item>

              <Form.Item style={{ width: "80%" }}>
                <TextArea
                  onChange={onDescriptionChange}
                  value={Description}
                  placeholder="게시물 내용"
                />
              </Form.Item>

              <Form.Item style={{ width: "80%" }}>
                <Input
                  onChange={onArticleUrlChange}
                  value={ArticleUrl}
                  placeholder="게시물 URL (반드시 앞에 'https://'를 붙여주세요.)"
                />
              </Form.Item>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Form.Item>
                  <Select
                    defaultValue={MediaData[0]}
                    style={{ width: 120 }}
                    onChange={MediaHandler}
                  >
                    {MediaData.map((media) => (
                      <Option key={media}>{media}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Select
                    style={{ width: 120 }}
                    onChange={FilterHandler}
                    value={Filter}
                  >
                    {Media.map((filter) => (
                      <Option key={filter}>{filter}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <Form.Item>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button type="primary" size="large" onClick={onSubmit}>
                    게시물 등록
                  </Button>
                </div>
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default UploadPage;
