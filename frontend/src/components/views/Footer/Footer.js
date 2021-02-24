import React from "react";

function Footer() {
  return (
    <div
      style={{
        height: "200px",
        backgroundColor: "#fafbfc",
        borderTop: "1px solid #e4e8eb",
      }}
    >
      <div
        style={{
          width: "85%",
          margin: "1rem auto",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <h2>SNS 품앗이</h2>
        <div
          style={{
            float: "right",
            fontSize: "0.3rem",
            border: "1px solid #e4e8eb",
          }}
        >
          <p>회사명 : 짜릿컴퍼니 | 대표 : 이재하</p>
          <p>주소 : 서울 강남구 테헤란로 483 짜릿빌딩 7층</p>
          <p>사업자등록번호 : 778-74-00313</p>
          <p>통신판매업신고 : 제2020-서울서초-2598호</p>
          <p>고객센터 : 평일 12:00 ~ 17:00</p>
          <p>대표번호 : 010-5421-6518</p>
          <p>help@snspumasi.co.kr</p> <p>공지사항 | 개인정보취급방침</p>
          <p>SNS품앗이 이용약관 | 네이버 이용약관</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
