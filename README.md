# 서버 사이드 렌더링

UI를 서버에서 렌더링 하는 것을 의미

- 리액트 프로젝트는 기본적으로 클라이언트 사이드 렌더링 ; UI 렌더링을 브라우저에서 모두 처리

### 서버 사이드 렌더링 장점

- 검색 엔진이 웹 애플리케이션의 페이지를 원활하게 수집 가능
- 초기 렌더링 성능 개선

### 서버 사이드 엔더링 단점

- 서버 리소스가 사용되어 서버 과부하 발생 가능 => 캐싱과 로드 밸런싱 통해 성능 최적화해줘야 함
- 프로젝트 구조 좀 더 복잡해질 수 있고, 데이터 미리 불러오기나 코드 스플리팅과의 호환 등 고려할 사항이 많아져 개발의 어려움 생김

## 서버 사이드 렌더링과 코드 스플리팅 충돌

별도 호환 작업 없이 두 기술 함께 적용시 페이지에 깜박임 발생
=> 이슈 해결 : 라우트 경로마다 코드 스플리팅된 파일 중에서 필요한 모든 파일을 브라우저에서 렌더링 하기 전 미리 불러와야 함
ex) Loadable Components 라이브러리에서 제공하는 기능 사용해 서버 사이드 렌더링 후 필요한 파일의 경로 추출해 렌더링 결과에 스크립트/스타일 태그 삽입
