# 🛰️ NASA GIBS 위성사진 지도 플랫폼 프로젝트 설계서 (PROJECT_SPEC.md)

## 1. 프로젝트 개요
본 프로젝트는 **NASA GIBS (Global Imagery Browse Services) API**를 활용하여 세계 지도의 특정 지역 및 날짜별 최신 위성사진을 오버레이로 보여주는 웹 플랫폼 MVP입니다.

- **목적**: 사용자가 원하는 날짜와 지역(한국, 미국 등 주요 도시/국가)의 위성 관측 이미지를 지도 위에서 손쉽게 조회 및 조작(확대/축소, 드래그)
- **특징**: API Key 없이 무료로 사용할 수 있는 NASA GIBS WMTS 타일 서비스 연동

---

## 2. 기술 스택 (Technology Stack)

### 프론트엔드 (Client)
- **Framework**: React (Vite, TypeScript)
- **Map Engine**: Leaflet.js (`leaflet`, `react-leaflet`)
- **Icons / UI**: Lucide-react, Vanilla CSS (Modern Slate Dark/Light Theme)

### 백엔드 (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Role**:
  1. NASA GIBS 레이어 메타데이터 및 추천 preset 좌표(한국, 미국 등) 제공 API (`/api/layers`, `/api/presets`)
  2. Nominatim OpenStreetMap Geocoding API 프록시 (`/api/search?q={query}`)
  3. CORS 처리 및 API 서버 헬스체크 (`/api/health`)

---

## 3. NASA GIBS API 연동 방식 (WMTS Tile Layer)

### 타일 URL 구조 (EPSG:3857 Web Mercator)
```http
https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/{Layer}/default/{Time}/{TileMatrixSet}/{z}/{y}/{x}.jpg
```

### 주요 파라미터 정의
1. **Layer**:
   - `MODIS_Terra_CorrectedReflectance_TrueColor` (MODIS 테라 트루컬러 위성영상 - 일별)
   - `VIIRS_SNPP_CorrectedReflectance_TrueColor` (VIIRS 수오미 NPP 트루컬러 위성영상)
   - `MODIS_Aqua_CorrectedReflectance_TrueColor` (MODIS 아쿠아 트루컬러 위성영상)
2. **Time**: `YYYY-MM-DD` 형식 (예: `2024-05-20`, 오늘 또는 지정 날짜)
3. **TileMatrixSet**: `GoogleMapsCompatible_Level9` (최대 Zoom 9까지 지원)
4. **Tile 좌표**: `{z}/{y}/{x}` (Leaflet 타일 레이어 자동 매핑)

---

## 4. 시스템 아키텍처 & 폴더 구조

```text
school/
├── server/                    # Node.js Express 백엔드
│   ├── index.js               # Express 서버 메인 엔트리
│   ├── routes/
│   │   ├── api.js             # GIBS 레이어, Presets, 검색 프록시 라우터
│   └── package.json           # 백엔드 의존성
│
├── src/                       # React 프론트엔드
│   ├── components/
│   │   ├── MapContainer.tsx   # Leaflet 지도 및 NASA GIBS Tile Layer 오버레이
│   │   ├── DatePickerBar.tsx  # 날짜 선택 및 이전/다음날 이동 컴포넌트
│   │   ├── LayerSelector.tsx  # 위성 레이어 선택 (MODIS Terra, VIIRS 등)
│   │   ├── SearchBar.tsx      # 지역 검색 & Preset 빠른 선택 (서울, 뉴욕 등)
│   │   └── ControlPanel.tsx   # 통합 컨트롤 패널
│   ├── types/
│   │   └── satellite.ts       # 레이어, 좌표, 상태 타입 정의
│   ├── services/
│   │   └── apiService.ts      # 백엔드 API 통신 서비스
│   ├── App.tsx                # 메인 레이아웃 및 상태 관리
│   └── main.tsx               # 앱 진입점
│
├── PROJECT_SPEC.md            # 전체 프로젝트 설계 문서 (본 파일)
├── package.json               # 클라이언트 패키지 설정
└── vite.config.ts             # Vite 설정
```

---

## 5. API 엔드포인트 설계 (Express Backend)

| Method | Endpoint | 설명 | 비고 |
|---|---|---|---|
| `GET` | `/api/health` | 서버 상태 확인 | OK 응답 |
| `GET` | `/api/layers` | 사용 가능한 NASA GIBS 위성 레이어 목록 반환 | MODIS Terra, VIIRS 등 |
| `GET` | `/api/presets` | 빠른 이동용 Preset 주요 좌표 (서울, 뉴욕, 도쿄, 파리 등) | MVP 기본 지역 제공 |
| `GET` | `/api/search?q={query}` | OpenStreetMap Nominatim 프록시 검색 API | CORS 회피 및 위치 좌표 검색 |

---

## 6. UI / UX 와이어프레임

```text
+-----------------------------------------------------------------------------------+
| 🛰️ NASA GIBS Satellite Explorer                            [날짜: 2024-05-20] [🔍] |
+-----------------------------------------------------------------------------------+
|  [컨트롤 패널]                                                                    |
|  1. 📅 날짜 선택: [< 이전날] [ 2024-05-20 📅 ] [다음날 >]                         |
|  2. 🛰️ 레이어 선택: (•) MODIS Terra TrueColor  ( ) VIIRS SNPP  ( ) MODIS Aqua    |
|  3. 📍 빠른 지역 이동: [서울] [뉴욕] [도쿄] [파리]                                  |
|  4. 🔍 위치 검색: [ 서울특별시                         ] [검색]                     |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                                                                   |
|                      [ Leaflet 지도 + NASA GIBS 위성 오버레이 ]                    |
|                                                                                   |
|                                📍 선택된 위치                                     |
|                                                                                   |
|  [+]                                                                              |
|  [-]                                                                              |
|                                                                                   |
+-----------------------------------------------------------------------------------+
| ℹ️ NASA Earthdata GIBS Open Data API | EPSG:3857 | Zoom: 4 | Lat: 37.56, Lng: 126.97|
+-----------------------------------------------------------------------------------+
```

---

## 7. 핵심 개발 절차 (Next Steps)
1. **[사용자 승인]** 본 설계서(PROJECT_SPEC.md) 검증 및 승인
2. **[의존성 설치]** Express 백엔드 생성 (`server/`) 및 클라이언트 의존성(`leaflet`, `react-leaflet`, `@types/leaflet`) 설치
3. **[백엔드 구축]** Express API 서버 (`/api/layers`, `/api/presets`, `/api/search`) 구현
4. **[프론트엔드 구축]** Leaflet Map & NASA GIBS TileLayer, DatePicker, Search/Preset UI 통합
5. **[검증 & 스크린샷]** 백엔드/프론트엔드 동시 실행, 브라우저 subagent 테스트 및 캡처
