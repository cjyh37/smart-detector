export type Lang = 'ko' | 'en';
export type PageKey = 'home' | 'app' | 'research' | 'institutions' | 'journal' | 'about' | 'contact';
export const SITE = 'https://smartdetector.fwth.ai';
export const PLAY = 'https://play.google.com/store/apps/details?id=ai.fwth.smartdetector';
export const EMAIL = 'help@fwth.ai';
export const PRIVACY = 'https://cjyh37.github.io/privacy-policy/smart-detector/';
export const pageKeys: PageKey[] = ['home', 'app', 'research', 'institutions', 'journal', 'about', 'contact'];
// Update only when the page's content, links or structured data materially change.
export const pageUpdatedAt: Record<PageKey, string> = {
  home: '2026-11-27', app: '2026-11-27', research: '2026-11-27',
  institutions: '2026-11-27', journal: '2026-11-27', about: '2026-11-27', contact: '2026-11-27',
};
export function path(lang: Lang, page = '', slug = '') {
  const parts = [lang === 'en' ? 'en' : '', page === 'home' ? '' : page, slug].filter(Boolean);
  return '/' + (parts.length ? parts.join('/') + '/' : '');
}
export const labels = {
  ko: { brand: '스마트 디텍터', home: '홈', app: '무료 앱', research: '연구 방향', institutions: '기관 활용', journal: '연구노트', about: '브랜드 소개', contact: '문의', install: 'Google Play에서 무료 설치', installShort: '앱 무료 설치', learn: '앱 살펴보기', privacy: '개인정보처리방침', menu: '메뉴', skip: '본문으로 바로가기', share: '페이지 공유', ios: 'iOS 개발 중', status: '구상·연구 준비 단계', read: '글 읽기' },
  en: { brand: 'Smart Detector', home: 'Home', app: 'Free app', research: 'Research', institutions: 'Institutions', journal: 'Journal', about: 'About us', contact: 'Contact', install: 'Get it free on Google Play', installShort: 'Get the free app', learn: 'Explore the app', privacy: 'Privacy policy', menu: 'Menu', skip: 'Skip to content', share: 'Share this page', ios: 'iOS in development', status: 'Concept & research preparation', read: 'Read the article' },
};
export const metadata: Record<Lang, Record<PageKey, { title: string; description: string }>> = {
  ko: {
    home: { title: '스마트 디텍터 — 시험 부정행위 예방·무선신호 확인 앱', description: '시험 중 새로 잡힌 무선신호를 진동으로 알려주는 무료 Android 감독 보조 앱. 스마트안경·이어폰 점검 단서와 현장 기록 보고서를 지원합니다.' },
    app: { title: '시험 부정행위 탐지·무선신호 확인 보조 앱 — 스마트 디텍터', description: '스마트안경·이어폰·초소형 카메라의 수신 가능한 무선신호를 살피는 무료 Android 시험감독 보조 앱. 3단계 사용법과 관측 한계를 확인하세요.' },
    research: { title: '전용 디바이스와 AI 학습 과정 평가 플랫폼 — 스마트 디텍터', description: '시험 시간 동안 무선신호를 기록할 전용 디바이스와 학생의 AI 활용·수정 과정을 평가할 플랫폼의 구상·연구 계획을 소개합니다.' },
    institutions: { title: '학교·자격시험 부정행위 예방과 감독 지원 — 스마트 디텍터', description: '학교 시험, 자격시험, 채용 면접 운영팀을 위한 무선신호 점검·현장 기록 안내. 무료 앱 활용과 전용 디바이스 연구 협력을 상담합니다.' },
    journal: { title: '시험 부정행위 예방 가이드·연구노트 — 스마트 디텍터', description: '수능 반입 금지 기기 규정, 세무사 시험 AI 부정행위 대응, 스마트안경·이어폰 무선신호 확인법을 공식 자료를 바탕으로 정리합니다.' },
    about: { title: '공정한 평가를 위한 기술을 만듭니다 — 스마트 디텍터 소개', description: '시험 감독과 학습 평가를 돕는 도구를 만듭니다. 무료 앱 배포 이유와 차기 하드웨어·평가 플랫폼 계획을 소개합니다.' },
    contact: { title: '기관 도입·기술 제휴·투자 문의 — 스마트 디텍터', description: '기관 활용, 기술·연구 제휴, 투자, 앱 사용 문의를 help@fwth.ai로 보내주세요.' },
  },
  en: {
    home: { title: 'Smart Detector — Free wireless signal app for exam proctors', description: 'Free Android supporting app for exam proctors. Get vibration alerts for new wireless signals during exams and keep clear on-site check reports.' },
    app: { title: 'Free exam proctoring & wireless signal app — Smart Detector', description: 'Check receivable Wi-Fi and Bluetooth signals during exams with the free Smart Detector Android app (Korean interface). See the 3-button workflow and limits.' },
    research: { title: 'Dedicated devices & AI learning assessment — Smart Detector', description: 'Concept and research plans for a dedicated exam-room wireless receiver and a platform that assesses how students reason and revise with AI.' },
    institutions: { title: 'Exam integrity support for schools & institutions — Smart Detector', description: 'Wireless signal checks and on-site reporting for school exams, qualification tests and interviews. Discuss app adoption and hardware research.' },
    journal: { title: 'Exam cheating prevention guides & research — Smart Detector', description: 'Practical guides on 2027 Suneung device rules, Korea’s tax accountant exam response and wireless signal checks, backed by official sources.' },
    about: { title: 'Our purpose & approach — Smart Detector', description: 'Smart Detector builds tools for exam proctors and instructors. Learn why our Android app is free and what we are planning next.' },
    contact: { title: 'Institution, partnership & investment inquiries — Smart Detector', description: 'Contact help@fwth.ai about institutional use, technical and research partnerships, investment or app support.' },
  },
};
export const contactTypes = [
  { id: 'institution', ko: '기관 활용·도입', en: 'Institutional use', subject: '[기관] 스마트 디텍터 활용 문의', subjectEn: '[Institution] Smart Detector inquiry', subjectJa: '[機関導入] Smart Detector お問い合わせ', hintKo: '기관 유형, 평가 방식, 현재 필요한 점을 알려주세요.', hintEn: 'Tell us about your institution, assessment format and current needs.' },
  { id: 'partnership', ko: '기술·연구·사업 제휴', en: 'Research & partnerships', subject: '[제휴] 스마트 디텍터 협력 문의', subjectEn: '[Partnership] Smart Detector inquiry', subjectJa: '[提携・共同研究] Smart Detector お問い合わせ', hintKo: '제안하실 기술이나 연구 주제, 협력 방식을 알려주세요.', hintEn: 'Describe the technology, research topic or partnership you have in mind.' },
  { id: 'investment', ko: '투자', en: 'Investment', subject: '[투자] 스마트 디텍터 문의', subjectEn: '[Investment] Smart Detector inquiry', subjectJa: '[出資] Smart Detector お問い合わせ', hintKo: '투자 검토에 필요한 정보와 궁금한 점을 알려주세요.', hintEn: 'Tell us what you would like to know when considering an investment.' },
  { id: 'support', ko: '앱 사용·일반 문의', en: 'App support & feedback', subject: '[앱 문의] 스마트 디텍터', subjectEn: '[Support] Smart Detector', subjectJa: '[アプリ・サポート] Smart Detector お問い合わせ', hintKo: '앱 사용 중 궁금한 점이나 개선 의견을 알려주세요.', hintEn: 'Share a question about the app or an idea for improvement.' },
] as const;
export function mailto(type: typeof contactTypes[number], lang: Lang) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(lang === 'ko' ? type.subject : type.subjectEn)}`;
}
