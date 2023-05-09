# 서버 사이드 렌더링

UI를 서버에서 렌더링 하는 것을 의미

- 리액트 프로젝트는 기본적으로 클라이언트 사이드 렌더링 ; UI 렌더링을 브라우저에서 모두 처리

### 서버 사이드 렌더링 장점

- 검색 엔진이 웹 애플리케이션의 페이지를 원활하게 수집 가능
- 초기 렌더링 성능 개선

### 서버 사이드 렌더링 단점

- 서버 리소스가 사용되어 서버 과부하 발생 가능 => 캐싱과 로드 밸런싱 통해 성능 최적화해줘야 함
- 프로젝트 구조 좀 더 복잡해질 수 있고, 데이터 미리 불러오기나 코드 스플리팅과의 호환 등 고려할 사항이 많아져 개발의 어려움 생김

## 서버 사이드 렌더링과 코드 스플리팅 충돌

별도 호환 작업 없이 두 기술 함께 적용시 페이지에 깜박임 발생
=> 이슈 해결 : 라우트 경로마다 코드 스플리팅된 파일 중에서 필요한 모든 파일을 브라우저에서 렌더링 하기 전 미리 불러와야 함
ex) Loadable Components 라이브러리에서 제공하는 기능 사용해 서버 사이드 렌더링 후 필요한 파일의 경로 추출해 렌더링 결과에 스크립트/스타일 태그 삽입

## 서버 사이드 렌더링 구현

웹팩 설정 커스터마이징해줘야 함 ; yarn eject 명령어 실행해 웹팩 관련 설정 밖으로 꺼내기

### 엔트리 만들기

엔트리(entry) : 웹팩에서 프로젝트 불러올 때 가장 먼저 불러오는 파일(index.js)로, 서버 사이드 렌더링을 할땐 서버를 위한 엔트리 파일 따로 생성해야 함

- 서버에서 리액트 컴포넌트 렌더링할 때 ReactDOMServer의 renderToString 함수 사용, 이 함수에 JSX 넣어 호출하면 렌더링 결과를 문자열로 반환

### 서버 사이드 렌더링 전용 웹팩 환경 설정

1. config/paths.js 파일의 module.exports 부분에 두 줄 추가 :

```
ssrIndexJs: resolveApp('src/index.server.js'), // 서버 사이드 렌더링 엔트리
ssrBuild: resolveApp('dist') // 웹팩 처리 후 저장 경로
```

2. 웹팩 환경 설정 파일 작성 :
   config 디렉터리에 webpack.config.server.js 파일 생성

3. 로더 설정 :
   웹팩 로더는 파일 불러올 때 확장자에 맞게 필요한 처리 해줌
   - 자바스크립트는 babel 사용해 트랜스파일링, CSS는 모든 CSS 코드 결합, 이미지 파일은 파일을 다른 경로에 따로 저장하고 그 파일에 대한 경로를 자바스크립트에서 참조할 수 있게 해줌

### 빌드 스크립트 작성

- scrips 경로의 build.js 스크립트는 클라이언트에서 사용할 빌드 파일을 만드는 작업함, 비슷한 형식으로 서버에서 사용할 빌드 파일 만드는 build.server.js 스크립트 작성하기
- 코드 작성 후 node scripts/build.server.js 명령어 실행해 빌드 잘 되는지 확인
- node dist/server.js 명령어 실행해 작성한 결과물 잘 작동하는지 확인
- package.json에서 스크립트를 생성해 편하게 명령어 입력

```
"scripts": {
    "start": "node scripts/start.js",
    "build": "node scripts/build.js",
    "test": "node scripts/test.js",
    "start:server": "node dist/server.js",
    "build:server": "node scripts/build.server.js"
  },
```

### 서버 코드 작성

Express라는 Node.js 웹 프레임워크 사용해 웹 서버 만들기 ; 해당 프레임워크가 사용률 높고, 추후 정적 파일들 호스팅할때도 쉽게 구현 가능하기 때문 - yarn add express

### 정적 파일 제공

1. Express에 내장되어 있는 static 미들웨어를 사용해 서버를 통해 build에 있는 JS, CSS 정적 파일들에 접근할 수 있도록 해 줌

```
const serve = express.static(path.resolve('./build'), {
  index: false // "/" 경로에서 index.html을 보여 주지 않도록 설정
});

app.use(serve); // 순서 중요, serverRender 전에 위치해야 함
app.use(serverRender);
```

2. JS와 CSS 파일 불러오도록 html에 코드 삽입
   불러와야 하는 파일 이름은 매번 빌드할 때마다 바뀌기 때문에 빌드 후 만들어지는 asset-manifest.json 파일 참고해 불러오도록 작성
   ; yarn buil 명령어 실행 후 build 디렉터리의 asset-manifest.json
