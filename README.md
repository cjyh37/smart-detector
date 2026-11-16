# 스마트 디텍터 소개·배포 페이지

**소개 페이지: https://cjyh37.github.io/smart-detector/**

**English: https://cjyh37.github.io/smart-detector/en/**

시험 시작 후 새로 수신된 무선 신호를 알려주는 무료 Android 감독 보조 앱을 소개합니다. 이 저장소는 소개 웹사이트와 배포용 APK를 위한 저장소입니다. Android 앱 소스 코드는 포함하지 않습니다.

## APK 올리기 — 권장 방법

1. [새 Release 만들기](https://github.com/cjyh37/smart-detector/releases/new)를 엽니다.
2. `v1.0.0-beta.1` 같은 새 태그와 제목을 적습니다.
3. **Attach binaries** 영역에 배포할 `.apk` 파일을 끌어 놓습니다. 파일 이름은 자유입니다. 여러 APK를 첨부한다면 `smart-detector.apk`가 우선 선택됩니다.
4. **Publish release**를 누릅니다. 베타라면 **Set as a pre-release**도 사용할 수 있습니다.
5. [Actions](https://github.com/cjyh37/smart-detector/actions/workflows/pages.yml) 배포가 완료되면 소개 페이지의 다운로드 버튼이 자동으로 활성화됩니다.

이미 공개한 Release의 첨부 파일만 교체했을 때는 위 Actions 화면에서 **Run workflow**를 눌러 페이지 정보를 갱신하세요. 파일을 올리지 않은 임시 Release는 만들 필요가 없습니다.

## APK 올리기 — 파일 업로드로 간단하게

[저장소에 파일 올리기](https://github.com/cjyh37/smart-detector/upload/main)에서 APK **하나**를 최상위 폴더에 업로드하고 main에 커밋해도 됩니다. `downloads/` 폴더에 올리는 방식도 지원합니다. 파일명은 자유이며 페이지를 수정할 필요가 없습니다.

- 저장소에 직접 올린 APK가 Release 첨부 파일보다 우선합니다.
- 교체할 때 이전 APK를 제거해 하나만 남겨 주세요. 파일이 여러 개이거나 비어 있으면 배포가 중단되고 이전 정상 페이지가 유지됩니다.
- 큰 파일이나 버전별 배포 이력은 Releases를 이용해 주세요.
- 운영자가 관리하는 서명으로 서명한 배포용 APK를 올리세요. 이 페이지는 APK를 생성하거나 서명하지 않습니다.

## 수정과 배포

- `index.html`: 한국어 소개, 사용 방법, FAQ, 기관 문의.
- `en/index.html`: 같은 내용의 영어 페이지. 기본 주소는 한국어이며 상단 언어 선택으로 전환합니다. 두 페이지는 JavaScript 없이도 읽을 수 있습니다.
- `styles.css`: 반응형 레이아웃과 앱의 파란색 디자인.
- `app.js`: 한국어·영어 설명용 화면 체험, 다운로드 상태, 링크 공유. APK 정보는 두 언어 모두 사이트 루트의 `download.json`을 사용합니다.
- `scripts/build.py`: 공개할 파일만 `dist/`로 복사하고 업로드된 APK를 연결.
- `.github/workflows/pages.yml`: main 변경 또는 Release 공개 시 GitHub Pages 배포.

브라우저에서는 GitHub API를 호출하지 않습니다. 다운로드 정보는 배포 시 생성하므로 방문자가 많아져도 GitHub API의 방문자별 호출 한도에 의존하지 않습니다. 다운로드할 파일이 없을 때는 ‘APK 준비 중’으로 표시합니다. 설명용 화면은 실제 무선 신호를 수신하지 않습니다.

```powershell
python -m unittest discover -s scripts -p 'test_*.py' -v
python scripts/build.py
python -m http.server 8765 --bind 127.0.0.1 --directory dist
```

웹사이트에 가입, 분석 추적기, 외부 글꼴 호출은 없습니다. Pretendard 글꼴은 SIL Open Font License로 사용하며 라이선스를 `assets/OFL.txt`에 포함합니다. 기관 문의는 GitHub 공개 이슈로 연결됩니다.

소개 내용을 바꿀 때는 한국어와 영어 페이지를 함께 수정하세요. 영어 설치 안내에는 실제 앱에서 찾을 수 있도록 한국어 버튼명도 표시했습니다. 공유 제목·설명·이미지와 기관 문의 양식도 언어별로 제공하며, 언어 전환 시 현재 섹션 링크를 유지합니다. 영어 공유 이미지는 `python scripts/make_social.py --lang en`으로 다시 생성할 수 있습니다.
