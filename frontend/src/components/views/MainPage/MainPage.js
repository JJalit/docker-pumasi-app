import React from "react";
import { Card, Col, Row } from "antd";
import "./MainPage.css";
const { Meta } = Card;

function MainPage() {
  return (
    <div
      className="mainImage"
      style={{
        width: "75%",
        margin: "3rem auto",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        minHeight: "80vh",
        flexDirection: "column",
      }}
    >
      <div>
        <Row gutter={[16, 16]}>
          <Col lg={8} md={8} xs={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                hoverable
                cover={
                  <a href="/blog">
                    <img alt="blog" src="/images/blog.png" />
                  </a>
                }
              >
                <Meta title="Naver Blog" description="네이버 블로그 품앗이" />
              </Card>
            </div>
          </Col>
          <Col lg={8} md={8} xs={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                hoverable
                cover={
                  <a href="/instagram">
                    <img alt="instagram" src="/images/instagram.png" />
                  </a>
                }
              >
                <Meta title="Instagram" description="인스타그램 품앗이" />
              </Card>
            </div>
          </Col>
          <Col lg={8} md={8} xs={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                hoverable
                cover={
                  <a href="/facebook">
                    <img alt="facebook" src="/images/facebook.png" />
                  </a>
                }
              >
                <Meta title="Facebook" description="페이스북 품앗이" />
              </Card>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={[16, 16]}>
          <Col lg={12} xs={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                hoverable
                cover={
                  <a href="/youtube">
                    <img alt="youtube" src="/images/youtube.png" />
                  </a>
                }
              >
                <Meta title="Youtube" description="유튜브 품앗이" />
              </Card>
            </div>
          </Col>
          <Col lg={12} md={8} xs={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                hoverable
                cover={
                  <a href="/clubhouse">
                    <img alt="clubhouse" src="/images/clubhouse.jpg" />
                  </a>
                }
              >
                <Meta title="Clubhouse" description="클럽하우스 품앗이" />
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default MainPage;
