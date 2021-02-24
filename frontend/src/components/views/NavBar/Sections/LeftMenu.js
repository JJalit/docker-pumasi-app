import React from "react";
import { Menu } from "antd";
import {
  FacebookOutlined,
  YoutubeOutlined,
  InstagramOutlined,
  BoldOutlined,
  BankOutlined,
} from "@ant-design/icons";
// import { useSelector } from "react-redux";

const SubMenu = Menu.SubMenu;
// const user = useSelector((state) => state.user);

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="home">
        <a href="/">모아보기</a>
      </Menu.Item>
      <SubMenu key="category" title="SNS 카테고리">
        <Menu.Item key="blog">
          <a href="/blog">
            <BoldOutlined />
            네이버 블로그
          </a>
        </Menu.Item>
        <Menu.Item key="instagram">
          <a href="/instagram">
            <InstagramOutlined />
            인스타그램
          </a>
        </Menu.Item>
        <Menu.Item key="facebook">
          <a href="/facebook">
            <FacebookOutlined />
            페이스북
          </a>
        </Menu.Item>
        <Menu.Item key="youtube">
          <a href="/youtube">
            <YoutubeOutlined />
            유튜브
          </a>
        </Menu.Item>
        <Menu.Item key="clubhouse">
          <a href="/clubhouse">
            <BankOutlined />
            클럽하우스
          </a>
        </Menu.Item>
      </SubMenu>
      <Menu.Item key="upload">
        <a href="/article/upload">게시물 등록</a>
      </Menu.Item>
      <Menu.Item key="manage">
        <a href="/article/manage">게시물 관리</a>
      </Menu.Item>
      <Menu.Item key="charge">
        <a href="/charge">충전하기</a>
      </Menu.Item>
      <Menu.Item key="setting">
        <a href="/setting">공지사항</a>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;
