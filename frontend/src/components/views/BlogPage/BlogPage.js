import React, { useEffect, useState } from "react";
import "../../utils/LandingPage.css";
import { continents } from "./Sections/Datas";
import Checkbox from "../../utils/CheckBox";
import SearchFeature from "../../utils/SearchFeature";
import { Button } from "antd";

import Axios from "axios";
function BlogPage() {
  const [tiles, setTiles] = useState([]);
  const [Filters, setFilters] = useState({
    filter: [],
  });
  const [SearchTerm, setSearchTerm] = useState("");
  const mediaId = "블로그";

  useEffect(() => {
    getTiles();
  }, []);

  const getTiles = (body) => {
    Axios.post(`/api/article/getImages?id=${mediaId}`, body).then(
      (response) => {
        if (response.data.success) {
          setTiles(response.data.tileInfo);
        } else {
          alert("이미지 불러오기에 실패했습니다.");
        }
      }
    );
  };

  const showFilteredResults = (filters) => {
    let body = {
      filters: filters,
    };

    getTiles(body);
  };

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };
    newFilters[category] = filters;

    showFilteredResults(newFilters);
  };

  const updateSearchTerm = (newSearchTerm) => {
    let body = {
      filters: Filters,
      searchTerm: newSearchTerm,
    };

    setSearchTerm(newSearchTerm);
    getTiles(body);
  };

  const refreshHandler = () => {
    let body = {
      filters: Filters,
      refreshBtn: true,
    };

    getTiles(body);
  };

  return (
    <div style={{ width: "85%", margin: "1rem auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* CheckBox */}

        <div>
          <Checkbox
            list={continents}
            handleFilters={(filters) => handleFilters(filters, "filter")}
            style={{ marginBottom: "15px" }}
          />
        </div>
        <div id="headertitle">
          <h2>Naverblog</h2>
        </div>

        <div>
          <SearchFeature refreshFunction={updateSearchTerm} />
        </div>
      </div>
      <hr />

      <div className="refresh" onClick={refreshHandler}>
        <Button
          type="primary"
          id="refresh"
          style={{
            width: "100%",
            backgroundColor: "#40a9ff",
          }}
        >
          새로고침
        </Button>
      </div>

      {/* User Tiles Section */}
      <section id="tiles-list" className="tiles">
        {tiles.map(function (tile, index) {
          return (
            <article key={index}>
              <span className="image">
                <img
                  src={`http://localhost:5000/${tile.filepath}`}
                  alt="filepath"
                />
              </span>
              <a
                href={tile.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="content">
                  <h2>{tile.title}</h2>
                  <p>{tile.description}</p>
                </div>
              </a>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default BlogPage;
