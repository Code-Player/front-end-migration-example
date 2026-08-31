# Vue → React 점진적 마이그레이션 예제

Turborepo 안의 Vue/React 앱을 Nginx의 단일 포트로 묶은 예제입니다. 두 구현은 같은 화면을 제공하므로 URL을 이동하며 프레임워크별 결과를 비교할 수 있습니다.

| 공개 URL | 담당 앱 |
| --- | --- |
| `/page-1`, `/page-2` | Vue (Nginx가 결정) |
| `/page-3`, `/page-4` | React (Nginx가 결정) |
| `/vue/page-1` ~ `/vue/page-4` | Vue 구현 직접 비교 |
| `/react/page-1` ~ `/react/page-4` | React 구현 직접 비교 |

화면 안의 `Page N로 이동` 버튼은 `/page-N`으로 이동합니다. 따라서 어느 프레임워크가 해당 화면을 제공할지는 프론트엔드 코드가 아니라 `nginx/nginx.conf`의 공개 라우트가 최종 결정합니다. 마이그레이션할 때 해당 `location`의 upstream만 Vue에서 React로 변경하면 URL이나 버튼을 수정할 필요가 없습니다.

## Docker Compose (권장)

```bash
docker compose up --build
```

브라우저에서 `http://localhost:3000`을 엽니다. 외부에는 Nginx의 3000 포트만 노출되고 Vue(4173), React(4174)는 Docker 네트워크 안에서만 접근됩니다.

설정을 변경한 뒤 기존 컨테이너가 실행 중이라면 Nginx 설정이 다시 로드되도록 컨테이너를 재생성합니다.

```bash
docker compose down
docker compose up --build --force-recreate
```

## 로컬 PM2

```bash
yarn install
yarn pm2:start
nginx -c "$PWD/nginx/nginx.local.conf" -p "$PWD"
```

PM2는 Vue를 4173, React를 4174에서 관리합니다. 로컬 Nginx가 `http://localhost:3000`이라는 하나의 포트에서 경로별로 전달합니다. 종료 시 `yarn pm2:stop`을 실행하고 Nginx 프로세스도 종료하세요.

## 개발

```bash
yarn install
yarn dev
```

개발 서버는 Vue 4173, React 4174에서 실행됩니다. 운영과 동일한 단일 URL 라우팅을 확인하려면 Docker Compose 또는 로컬 Nginx를 사용하세요.

## 마이그레이션 시 고려할 문제

이 구조는 페이지 단위의 점진적 마이그레이션에 적합하지만 Vue와 React는 서로 독립된 애플리케이션입니다. 프레임워크 간 이동은 SPA 내부 라우팅이 아니라 문서 전체를 다시 불러오는 방식이라는 점을 고려해야 합니다.

### 전체 페이지 새로고침

Vue와 React 사이를 이동하면 JavaScript가 다시 실행되고 메모리 상태, 스크롤 위치, 열려 있던 모달 및 작성 중인 폼 데이터가 초기화될 수 있습니다. 편집 화면처럼 유지해야 하는 상태는 URL, 서버 세션 또는 별도 저장소에 보관해야 합니다.

### 클라이언트 상태 공유

Pinia, Vuex, Redux처럼 각 앱의 메모리에 저장된 상태는 다른 앱과 공유되지 않습니다. 두 앱에서 공통으로 필요한 검색 조건, 필터, 사용자 선택 정보는 URL, 쿠키, `sessionStorage`, `localStorage` 또는 서버 상태로 관리해야 합니다. 민감한 데이터는 브라우저 저장소에 직접 보관하지 않습니다.

### 인증과 권한

두 앱이 각각 인증 초기화와 토큰 갱신을 수행하면 API 중복 호출, 갱신 경쟁 또는 로그아웃 상태 불일치가 발생할 수 있습니다. 인증 쿠키, 사용자 조회 API, 토큰 갱신 및 로그아웃 규칙을 공통으로 정의해야 합니다. 가능하면 동일 도메인의 HttpOnly 쿠키나 서버 세션을 사용하는 것이 단순합니다.

### 디자인 시스템 중복

Vue 컴포넌트와 React 컴포넌트를 직접 공유하기는 어렵기 때문에 버튼, 입력 요소, 접근성 및 반응형 동작이 서로 달라질 수 있습니다. 색상, 간격, 글꼴 같은 디자인 토큰과 공통 CSS는 별도 workspace 패키지로 공유하고 컴포넌트 구현만 프레임워크별로 관리하는 것이 좋습니다.

### 동일 페이지의 이중 유지보수

마이그레이션 중에는 동일 페이지의 Vue와 React 구현을 함께 수정해야 할 수 있습니다. 두 구현의 기능이 달라지는 것을 방지하기 위해 페이지 상태를 `Vue 운영 → React 개발 → 검증 → React 전환 → Vue 제거` 순서로 관리하고, 전환이 끝난 Vue 코드는 오래 유지하지 않는 것이 좋습니다.

### Nginx 설정 오류

Nginx 설정이 페이지의 실제 담당 앱을 결정하므로 설정 변경 자체가 기능 배포에 해당합니다. 잘못된 upstream, trailing slash, 정적 자산 경로 또는 이전 컨테이너 설정 때문에 404나 빈 화면이 발생할 수 있습니다. `nginx -t`와 공개 URL별 응답 테스트를 CI/CD에 포함하는 것이 좋습니다.

### 정적 자산과 서비스 워커 충돌

두 앱이 `/assets`, `/favicon.ico`, `/manifest.json` 같은 경로를 함께 사용하면 자산이 충돌할 수 있습니다. 이 예제처럼 `/vue/assets`와 `/react/assets`로 base path를 분리해야 합니다. 서비스 워커를 사용한다면 한 앱의 worker가 다른 앱의 요청을 가로채지 않도록 scope도 제한해야 합니다.

### 로그와 오류 추적 분리

사용자 흐름이 Vue에서 React로 넘어가면 오류 추적과 성능 측정이 끊길 수 있습니다. 두 앱에 동일한 사용자 세션 ID, trace ID, 배포 버전 규칙 및 source map 정책을 적용해야 전체 이동 경로를 추적할 수 있습니다.

### SEO와 중복 URL

공개 서비스에서는 `/page-1`, `/vue/page-1`, `/react/page-1`이 동일 콘텐츠로 인식될 수 있습니다. 직접 비교용 URL은 개발 환경에서만 제공하거나 검색 엔진 접근을 막고, 운영 공개 URL에는 canonical URL과 페이지별 title 및 meta 정보를 설정해야 합니다.

### 배포 순서와 버전 불일치

Nginx가 아직 배포되지 않은 React 페이지로 먼저 전환되면 장애가 발생합니다. 다음 순서로 배포하는 것이 안전합니다.

1. React 신규 페이지를 먼저 배포합니다.
2. `/react/page-N` 직접 경로와 health check로 검증합니다.
3. Nginx의 `/page-N` upstream을 React로 변경합니다.
4. 오류율과 응답 시간을 모니터링합니다.
5. 문제가 없으면 기존 Vue 구현을 제거합니다.

Nginx upstream을 다시 Vue로 변경할 수 있는 롤백 설정도 함께 준비해야 합니다.

## 적용하기 적합한 경우

이 방식은 페이지 경계가 명확하고 페이지 간 공유 상태가 적으며 전체 새로고침을 허용할 수 있는 서비스에 적합합니다. 복잡한 폼, 실시간 데이터 또는 앱 전체에 걸친 전역 상태가 많다면 공통 애플리케이션 셸이나 micro-frontend 구조도 함께 검토해야 합니다.
