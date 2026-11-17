export type Lang = 'ko' | 'en';
export type PageKey = 'home' | 'app' | 'research' | 'institutions' | 'journal' | 'about' | 'contact';
export const SITE = 'https://smartdetector.fwth.ai';
export const PLAY = 'https://play.google.com/store/apps/details?id=ai.fwth.smartdetector';
export const EMAIL = 'smartdetector@fwth.ai';
export const PRIVACY = 'https://cjyh37.github.io/privacy-policy/smart-detector/';
export const pageKeys: PageKey[] = ['home', 'app', 'research', 'institutions', 'journal', 'about', 'contact'];
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
    home: { title: '스마트 디텍터 — 공정한 시험·면접을 위한 기술', description: '시험실의 무선신호를 확인하는 무료 Android 앱, 스마트 디텍터. 앱 사용법과 보고서 예시, 전용 디바이스와 AI 학습 과정 평가 플랫폼의 개발 계획을 확인하세요.' },
    app: { title: '시험 부정행위 탐지·무선신호 확인 보조 앱 — 스마트 디텍터', description: '스마트 글래스·이어폰·카메라의 수신 가능한 무선신호를 확인하는 무료 Android 시험감독 보조도구. 앱 화면 시안, 사용 방법과 관측 범위를 확인하세요.' },
    research: { title: '전용 디바이스와 AI 학습 과정 평가 플랫폼 — 스마트 디텍터', description: '시험실 무선신호를 기록할 전용 디바이스와, 학생의 AI 활용 과정과 기여를 평가할 플랫폼을 준비합니다. 제품 콘셉트와 사용 방식, 개발 계획을 소개합니다.' },
    institutions: { title: '학교·시험 운영기관 활용 상담 — 스마트 디텍터', description: '학교, 학원, 시험·면접 운영기관을 위한 스마트 디텍터 활용 안내. 무료 앱의 기능과 사용 조건을 살펴보고 기관 도입이나 연구 협력을 문의하세요.' },
    journal: { title: '현장 가이드와 연구노트 — 스마트 디텍터', description: '스마트 디텍터의 사용 가이드와 개발 이야기. 앱을 무료로 제공하는 이유, 무선신호를 해석하는 방법, 전용 디바이스의 개발 계획을 다룹니다.' },
    about: { title: '공정한 평가를 위한 기술을 만듭니다 — 스마트 디텍터 소개', description: '스마트 디텍터는 시험 감독과 학습 평가를 돕는 도구를 만듭니다. 무료 앱을 제공하는 이유와 학교·기관용 제품을 준비하는 계획을 소개합니다.' },
    contact: { title: '기관 도입·기술 제휴·투자 문의 — 스마트 디텍터', description: '기관 활용, 기술·연구·사업 제휴, 투자, 앱 사용에 관한 문의를 smartdetector@fwth.ai로 보내주세요.' },
  },
  en: {
    home: { title: 'Smart Detector — Technology for fairer assessments', description: 'Check wireless signals in exam rooms with the free Smart Detector Android app. Find instructions, an example report and plans for hardware and AI learning assessment.' },
    app: { title: 'Free exam proctoring & wireless signal app — Smart Detector', description: 'Explore the free Smart Detector Android app: interface designs, workflow and observation limits. A supporting tool for exam proctors, with a Korean-language interface.' },
    research: { title: 'Dedicated devices & AI learning assessment — Smart Detector', description: 'Plans for a dedicated exam-room receiver and a platform to record students’ work with AI, suggest scores and check understanding through short oral assessments.' },
    institutions: { title: 'For schools & assessment teams — Smart Detector', description: 'Learn how the free app could fit your school exams, qualification tests or interviews. Contact us about institutional use or research cooperation.' },
    journal: { title: 'Field guides & research journal — Smart Detector', description: 'Smart Detector guides and development notes: why the app is free, how to interpret wireless signals and what we plan to build next.' },
    about: { title: 'Our purpose & approach — Smart Detector', description: 'Smart Detector builds tools for exam proctors and instructors. Learn why the app is free and how we plan to develop hardware and learning assessment software.' },
    contact: { title: 'Institution, partnership & investment inquiries — Smart Detector', description: 'Contact smartdetector@fwth.ai about institutional use, technical and research partnerships, investment or app support.' },
  },
};
export const contactTypes = [
  { id: 'institution', ko: '기관 활용·도입', en: 'Institutional use', subject: '[기관] 스마트 디텍터 활용 문의', subjectEn: '[Institution] Smart Detector inquiry', hintKo: '기관 유형, 평가 방식, 현재 필요한 점을 알려주세요.', hintEn: 'Tell us about your institution, assessment format and current needs.' },
  { id: 'partnership', ko: '기술·연구·사업 제휴', en: 'Research & partnerships', subject: '[제휴] 스마트 디텍터 협력 문의', subjectEn: '[Partnership] Smart Detector inquiry', hintKo: '제안하실 기술이나 연구 주제, 협력 방식을 알려주세요.', hintEn: 'Describe the technology, research topic or partnership you have in mind.' },
  { id: 'investment', ko: '투자', en: 'Investment', subject: '[투자] 스마트 디텍터 문의', subjectEn: '[Investment] Smart Detector inquiry', hintKo: '투자 검토에 필요한 정보와 궁금한 점을 알려주세요.', hintEn: 'Tell us what you would like to know when considering an investment.' },
  { id: 'support', ko: '앱 사용·일반 문의', en: 'App support & feedback', subject: '[앱 문의] 스마트 디텍터', subjectEn: '[Support] Smart Detector', hintKo: '앱 사용 중 궁금한 점이나 개선 의견을 알려주세요.', hintEn: 'Share a question about the app or an idea for improvement.' },
] as const;
export function mailto(type: typeof contactTypes[number], lang: Lang) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(lang === 'ko' ? type.subject : type.subjectEn)}`;
}
