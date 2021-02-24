import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import MainPage from "./views/MainPage/MainPage";
import BlogPage from "./views/BlogPage/BlogPage";
import InstagramPage from "./views/InstagramPage/InstagramPage";
import FacebookPage from "./views/FacebookPage/FacebookPage";
import YoutubePage from "./views/YoutubePage/YoutubePage";
import ClubhousePage from "./views/ClubhousePage/ClubhousePage";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import UploadPage from "./views/UploadPage/UploadPage";
import ManagePage from "./views/ManagePage/ManagePage";
import SearchIdPage from "./views/Search/SearchIdPage";
import SearchPwPage from "./views/Search/SearchPwPage";

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          <Route exact path="/" component={Auth(MainPage, null)} />
          <Route exact path="/blog" component={Auth(BlogPage, null)} />
          <Route
            exact
            path="/instagram"
            component={Auth(InstagramPage, null)}
          />
          <Route exact path="/facebook" component={Auth(FacebookPage, null)} />
          <Route exact path="/youtube" component={Auth(YoutubePage, null)} />
          <Route
            exact
            path="/clubhouse"
            component={Auth(ClubhousePage, null)}
          />

          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route
            exact
            path="/article/upload"
            component={Auth(UploadPage, true)}
          />
          <Route
            exact
            path="/article/manage"
            component={Auth(ManagePage, true)}
          />
          <Route
            exact
            path="/login/searchId"
            component={Auth(SearchIdPage, false)}
          />
          <Route
            exact
            path="/login/searchPw"
            component={Auth(SearchPwPage, false)}
          />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
