import React from "react";
import ReactDomServer from "react-dom/server";
import express from "express";
import { StaticRouter } from "react-router-dom";
import App from "./App";

const app = express();

// 서버 사이드 렌더링 처리할 핸들러 함수
const serverRender = (req, res, next) => {
  // 이 함수는 404 떠야하는 상황에 404 띄우지 않고 서버 사이드 렌더링 해줌
  const context = {};
  const jsx = (
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );
  const root = ReactDomServer.renderToString(jsx); // 렌더링 후
  res.send(root); // 클라이언트에게 결과물 응답
};

app.use(serverRender);

// 5000포트로 서버 가동
app.listen(5000, () => {
  console.log("Running on http://localhost:5000");
});
