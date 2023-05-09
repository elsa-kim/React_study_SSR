import React from "react";
import ReactDomServer from "react-dom/server";
import express from "express";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import path from "path";
import fs from "fs";

// asset-manifest.json에서 파일 경로들을 조회
const manifest = JSON.parse(fs.readFileSync(path.resolve("./build/asset-manifest.json"), "utf8"));

const chunks = Object.keys(manifest.files)
  .filter((key) => /chunk\.js$/.exec(key))
  .map((key) => `<script src="${manifest[key]}"></script>`)
  .join("");

function createPage(root) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
    <meta name="theme-color" content="#000000" />
    <title>React App</title>
    <link href="${manifest["main.css"]}" rel="stylesheet" />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
      ${root}
    </div>
    // <script src="${manifest["runtime~main.js"]}"></script>
    ${chunks}
    <script src="${manifest["main.js"]}"></script>
  </body>
  </html>
  `;
}

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
  res.send(createPage(root)); // 클라이언트에게 결과물 응답
};

const serve = express.static(path.resolve("./build"), {
  index: false, // '/' 경로에서 index.html 보여주지 않도록 설정
});

app.use(serve);
app.use(serverRender);

// 5000포트로 서버 가동
app.listen(4000, () => {
  console.log("Running on http://localhost:4000");
});
