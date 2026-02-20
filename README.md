# 🍔 오늘 뭐먹지? (WhatLunch)

- 매일 반복되는 점심 메뉴 고민, “오늘 뭐 먹지?”
- 간단한 선택 또는 랜덤 추천을 통해 주변의 맛있는 점심 메뉴를 제안해주는 서비스입니다.

![ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/dbf6c0ed-a9a9-403a-a45b-e954a1c58ce8)

---

## 🔗 배포 주소

https://whatlunch.vercel.app/

---

## ✨ 주요 기능

- **룰렛 페이지**
  - WebSocket 기반 실시간 룰렛 및 실시간 채팅
  - 룰렛 결과에 따라 카카오맵으로 음식점 위치 표시

- **마이페이지**
  - 도트 기반 음식 아이템 선택
  - 즐겨찾기한 메뉴 목록 관리
  - 계정 설정 및 정보 관리 기능 제공

---

## 🛠 사용 기술

### 🎨 Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)<br>
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)<br>
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)<br>
![Sass](https://img.shields.io/badge/Sass-/CC6699?style=flat&logo=sass&logoColor=white)<br>
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=flat&logo=react-query&logoColor=white)<br>
![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat&logo=zoo&logoColor=white)<br>

### 🔧 Backend

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) – 확장성 높은 서버 애플리케이션 프레임워크  
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) – 유저 정보, 즐겨찾기한 메뉴 목록 등

### ⚙️ Infra / Tooling

![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) – 프론트엔드 배포 플랫폼 <br>
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat&logo=githubactions&logoColor=white) – CI/CD 파이프라인 자동화 <br>

### 🤖 AI / External API

![CodeRabbit](https://img.shields.io/badge/CodeRabbit-6B4EFF?style=flat&logo=codereview&logoColor=white) – AI 기반 코드 리뷰 자동화 <br>
![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-000000?style=flat&logo=githubcopilot&logoColor=white) – AI 코드 리뷰 및 보조 개발 <br>

---

## 📈 성과

- Server Component의 API 순차 호출로 초기 렌더링(LCP) 지연 → 병렬 호출로 구조 개선, LCP 2.34s → 0.91s(약 61% 단축)
- 룰렛 결과 모달 이미지 로딩 병목을 분석하고 렌더링 구조 개선으로 1.86s → 22ms 단축
- S3 업로드 구조를 적용해 Base64 저장 방식의 DB 부하를 개선하고 업로드, 렌더링 성능 개선

---

## 📷 미리보기

### 🏠 랜딩페이지

- 현재 시각 및 날씨(기분)에 따른 메뉴 추천 제공
- 룰렛 페이지 진입을 위한 메인 화면
  ![랜딩gif](https://github.com/user-attachments/assets/b0468e45-ad9c-4a60-8fea-d96e87996436)

---

### 🔐 로그인 / 회원가입

- 자체 로그인 및 Google 소셜 로그인 지원
  ![로그인 gif](https://github.com/user-attachments/assets/cb5f841a-6d96-4e6b-9676-3ee6379f2633)

---

### 🎯 룰렛 페이지

- **WebSocket** 기반 실시간 룰렛 및 채팅 기능 제공
- 룰렛 결과에 따라 카카오맵이 실시간으로 갱신됨

![ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/dbf6c0ed-a9a9-403a-a45b-e954a1c58ce8)

---

### 🎯 룰렛 솔로 페이지

- **게스트** 사용자도 이용 가능
- 룰렛과 카카오맵을 통해 주변 음식점 확인 가능

  ![혼자하기 gif](https://github.com/user-attachments/assets/3a592f6d-6d13-4209-bef0-1ae0070612ab)

---

### 👤 마이페이지

- 찜한 메뉴, 계정 설정, 음식 도트 아이템 관리 등 개인화된 사용자 정보 제공
  ![마이페이지 gif](https://github.com/user-attachments/assets/b2b94f86-97bd-43e3-88c2-3caed0658c89)

---

## 🚀 시작하기

### 1. 프로젝트에 필요한 패키지 설치

```bash
yarn install
```

### 2-1. 개발 서버 실행

```bash
yarn dev
```

### 2-2. 브라우저에서 실행

```bash
http://localhost:3000
```

---

## ⭐ 팀 협업 브랜치

이슈 추적 시스템을 사용하여 **`feature/{이슈번호}-{기능이름}`** 형태로 하게되면 이슈와 PR이 연결되어 어떤 이슈가 있었는지 확인할 수 있음!

(예: **`feature/10-home`**)

- 소문자 사용
- 하이픈 또는 슬래시 사용(**`”-”, “/”`**)

## 🚀 Git 브랜치 네이밍 컨벤션 가이드

| 브랜치 타입 | 규칙 및 목적         | 예시                             | 설명                                                                      |
| ----------- | -------------------- | -------------------------------- | ------------------------------------------------------------------------- |
| `main`      | 프로덕션 환경 배포용 | `main`                           | 항상 안정적인 프로덕션 코드를 유지하며, 직접 커밋 불가                    |
| `develop`   | 통합 개발 브랜치     | `develop`                        | 개발 중인 모든 기능 브랜치들이 머지되는 주된 개발 브랜치                  |
| `feature/`  | 새로운 기능 개발     | `feature/{이슈번호}-{기능 이름}` | 특정 기능 개발을 위한 브랜치로, 이슈 트래커와 연동하여 관리 용이          |
| `fix/`      | 일반 버그 수정       | `fix/{이슈번호}-{버그이름}`      | `develop` 또는 `feature` 브랜치에서 발견된 일반적인 버그를 수정할 때 사용 |
| `hotfix/`   | 긴급 버그 수정       | `hotfix/{이슈번호}-{버그이름}`   | `main` 브랜치(운영 환경)에서 발생한 긴급 버그를 수정할 때 사용            |
| `style/`    | 스타일 개발          | `style/{이슈번호}-{버그이름}`    | 기능 변경 없이 코드 스타일, 포맷팅, 리팩토링 등을 개선하는 데 사용        |
| `release/`  | 릴리즈 준비          | `release/{버전번호}`             | 다음 버전 릴리즈를 위해 develop에서 분기하며, 최종 테스트 및 QA를 진행    |

---

## 🗓️ 프로젝트 기간

**2025.11 ~ 2026.02 (약 4 달)**

---

## 🧑‍🤝‍🧑 팀 소개 및 역할 분담

| 멤버                                                                                                                                        | 역할 및 기여                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <img src="https://avatars.githubusercontent.com/u/192767726?v=4" width="100"><br><a href="https://github.com/ramong26">@김수연</a>          | **Frontend - 성능 최적화 담당**<br>- 마이페이지 성능 최적화 (Server Component 병렬 호출로 초기 렌더링 61% 단축)<br>- 채팅 UI 개발 및 반응형 디자인<br>- 전체 스타일 리팩토링 및 CSS 최적화                         |
| <img src="https://avatars.githubusercontent.com/u/120624055?v=4" width="100"><br><a href="https://github.com/Parkchanyoung0710">@박찬영</a> | **Frontend - 기능 개발 & SEO 담당**<br>- Next.js 페이지 구조 설계 및 메타데이터 최적화<br>- SEO 랜딩 페이지, sitemap, robots.txt 구현<br>- 이미지 로딩 성능 최적화 (1.86s → 22ms)<br>- 캐러셀, 배달 플랫폼 UI 개발 |

---

## ⚔️ 차별점

- **실시간 소통과 추천 경험**  
  WebSocket 기반의 실시간 룰렛과 채팅 기능을 통해 여러 사용자가 동시에 참여하며 음식 추천 결과를 함께 확인하고, 실시간으로 의견을 나눌 수 있습니다. 기존의 단순 추천 서비스와 달리, 친구나 동료들과 함께 소통하며 더 즐겁고 몰입감 있는 추천 경험을 제공합니다.

- **위치 기반 맞춤 추천**  
  사용자의 현재 위치 정보를 활용하여 주변에 있는 음식점을 우선적으로 검색하고 추천합니다. 이를 통해 사용자는 멀리 있는 식당이 아닌, 실제로 바로 방문할 수 있는 가까운 음식점 정보를 빠르게 확인할 수 있습니다.

- **개인화된 마이페이지**  
  최근 선택한 메뉴, 즐겨찾기한 음식, 나만의 메뉴 선호도 등 다양한 개인화 정보를 한눈에 확인할 수 있는 마이페이지를 제공합니다. 사용자는 자신의 취향과 기록을 바탕으로 더욱 맞춤화된 추천을 받을 수 있으며, 계정 설정 및 관리도 간편하게 할 수 있습니다.

- **확장성과 유지보수성을 고려한 아키텍처**  
  NestJS와 MongoDB 기반의 백엔드, Next.js 기반의 프론트엔드 구조로, 서비스 확장과 유지보수가 용이하도록 설계되었습니다.
