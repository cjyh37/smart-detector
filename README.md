# 스마트 디텍터 홈페이지

공정한 평가환경을 위한 무료 Android 감독 보조 앱과 전용기기 연구 방향을 소개하는 한국어·영어 정적 사이트입니다. Android 앱 소스는 포함하지 않습니다.

- 홈페이지: https://smartdetector.fwth.ai/
- Google Play: https://play.google.com/store/apps/details?id=ai.fwth.smartdetector
- 문의: smartdetector@fwth.ai

## 로컬 실행

Node.js 24와 Python 3을 사용합니다.

```sh
npm ci
npm run dev
```

빌드 결과를 확인하려면 다음 명령을 사용합니다.

```sh
npm run build
npm test
npm run preview
```

기존 `python scripts/build.py` 명령도 새 Astro 빌드로 연결됩니다. `npm ci`를 먼저 실행해야 합니다.

## 구조

- `src/layouts/SiteLayout.astro`: 공통 내비게이션, 푸터, 검색·공유 메타 태그
- `src/views/`: 홈, 앱, 연구, 기관 활용, 소개, 문의, 연구노트 화면
- `src/components/`: 앱 화면 시안, 보고서 확대 보기, 튜토리얼, 설치 버튼, FAQ 등 공통 구성
- `src/content/journal/ko/`, `en/`: 언어별 Markdown 글
- `src/data/site.ts`: 공통 문구, 경로, 문의 유형, 페이지 메타데이터
- `src/styles/global.css`: 반응형 디자인
- `src/scripts/`: 화면 전환, 공유, 문의 내용 작성 보조
- `assets/`: 제공된 앱·보고서 시안, 기존 화면 자료, 브랜드 이미지, 자체 호스팅 글꼴과 공개 자료
- `src/pages/sitemap.xml.ts`: 실제 페이지와 번역 쌍으로 생성하는 사이트맵

공통 페이지 7개와 글 5편을 한국어·영어로 제공합니다. 새 글은 각 언어 폴더에 Markdown 파일을 추가합니다. `lang`, `slug`, `title`, `description`, `category`, `date`, `readTime`, `order`를 지정하고 번역끼리는 같은 slug를 사용합니다. 현재 템플릿은 한국어·영어가 모두 있는 글을 기준으로 합니다.

## 검색 정보 관리

각 페이지에 고유한 제목·설명, canonical, 한국어·영어 hreflang, 공유 메타데이터를 제공합니다. 글에는 화면의 작성자·작성일과 연결되는 BlogPosting 구조화 데이터가 있으며, 하위 페이지에는 BreadcrumbList를 제공합니다.

`sitemap.xml`은 실제 페이지와 번역 쌍, 최종 수정일을 포함합니다. 공통 페이지를 의미 있게 수정했을 때는 `src/data/site.ts`의 `pageUpdatedAt`을, 글을 수정했을 때는 해당 Markdown의 `updated: "YYYY-MM-DD"`를 갱신합니다. 최초 작성일 `date`는 유지합니다. 단순 재배포를 이유로 날짜를 바꾸지 않습니다.

시사·시험 안내 글에는 확인 기준일과 공식 출처를 표시합니다. 시험 연도, 조사·처분의 진행 상태와 최종 결정, 정부 대책과 제품 기능을 구분해 작성합니다. 기사 변경 후에는 한국어·영어 번역과 관련 링크를 함께 검토합니다.

## 문의와 측정

문의는 실제 이메일 주소로 연결됩니다. 작성 보조 기능은 내용 복사 또는 `mailto:` 연결만 제공하며, 웹 서버에 문의 내용을 저장하거나 접수 완료로 표시하지 않습니다. 긴 내용은 복사 후 이메일로 발송하도록 안내합니다.

웹 GA4는 운영 도메인에서만 실행됩니다. 설치 버튼 클릭은 `google_play_click`, 이메일 연결은 `contact_email_click`로 구분하며 실제 설치나 접수로 간주하지 않습니다. 문의 원문과 이메일 주소를 이벤트로 보내지 않습니다.

`download.json`은 Google Play 주소를 유지합니다. APK 업로드가 웹의 설치 목적지를 바꾸지 않습니다. 현재 iOS는 개발 중이며 하드웨어는 구상·연구 준비 단계입니다.

## 배포

GitHub Actions는 `main` 기준으로 의존성 설치, 정적 빌드, 링크·메타데이터 검사 후 `dist/`를 GitHub Pages에 배포합니다. 로컬 검토 브랜치에서 수정해도 공개 사이트에 반영되지 않습니다.

배포에는 명시적으로 준비한 공개 자산과 빌드된 페이지만 포함합니다. 내부 기획, 작업 메모, 문의 데이터, 비밀값을 공개 저장소나 `assets/`에 넣지 마세요.

기존 `scripts/test_build.py`는 이전 자산 생성 API의 호환성 검사입니다. 새 사이트의 실제 배포 결과는 `scripts/test_site.py`, 문의 URL 처리는 `scripts/contact.test.mjs`에서 검사합니다.
