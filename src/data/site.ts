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
    home: { title: '스마트 디텍터 — 공정한 시험·면접을 위한 기술', description: '공정한 평가환경을 위한 기술을 만듭니다. 무료 Android 시험감독 보조 앱과 전용 관측 디바이스, AI 학습 과정 평가 플랫폼의 제품 비전을 만나보세요.' },
    app: { title: '시험 부정행위 탐지·무선신호 확인 보조 앱 — 스마트 디텍터', description: '스마트 글래스·이어폰·카메라의 수신 가능한 무선신호를 확인하는 무료 Android 시험감독 보조도구. 앱 화면 시안, 사용 방법과 관측 범위를 확인하세요.' },
    research: { title: '전용 디바이스와 AI 학습 과정 평가 플랫폼 — 스마트 디텍터', description: '시험 공간을 살피는 전용 관측 디바이스와 AI 협업의 과정·고유한 기여를 기록하고 점수화·구술 확인으로 연결하는 학습 과정 평가 플랫폼. 스마트 디텍터의 제품 비전을 소개합니다.' },
    institutions: { title: '학교·시험 운영기관 활용 상담 — 스마트 디텍터', description: '학교, 학원, 시험·면접 운영기관을 위한 무료 앱 활용과 평가환경 상담. 현재 가능한 활용 범위와 향후 연구 협력을 이야기합니다.' },
    journal: { title: '현장 가이드와 연구노트 — 스마트 디텍터', description: '무료 앱으로 시작하는 이유, 무선신호를 해석하는 방법, 전용기기 연구의 다음 질문. 공정한 평가환경을 위한 생각과 기록을 읽어보세요.' },
    about: { title: '공정한 평가를 위한 기술을 만듭니다 — 스마트 디텍터 소개', description: '무료 앱에서 전용 디바이스와 AI 학습 과정 평가 플랫폼으로. 공정한 평가환경과 학생 고유의 성장을 뒷받침하는 스마트 디텍터의 방향을 소개합니다.' },
    contact: { title: '기관 도입·기술 제휴·투자 문의 — 스마트 디텍터', description: '기관 활용, 기술·연구·사업 제휴, 투자, 앱 사용에 관한 문의를 smartdetector@fwth.ai로 보내주세요.' },
  },
  en: {
    home: { title: 'Smart Detector — Technology for fairer assessments', description: 'Explore our free Android proctoring app and the vision for dedicated observation devices and a platform that makes learning with AI visible.' },
    app: { title: 'Free exam proctoring & wireless signal app — Smart Detector', description: 'Explore the free Smart Detector Android app: interface designs, workflow and observation limits. A supporting tool for exam proctors, with a Korean-language interface.' },
    research: { title: 'Dedicated devices & AI learning assessment — Smart Detector', description: 'Explore our product vision: dedicated devices for assessment rooms and a platform connecting students’ AI collaboration, original contribution, rubric scores and oral verification.' },
    institutions: { title: 'For schools & assessment teams — Smart Detector', description: 'Explore the free app, discuss your assessment environment or start a research conversation. For schools, academies and exam or interview teams.' },
    journal: { title: 'Field guides & research journal — Smart Detector', description: 'Why we begin with a free app, what wireless observations can tell you, and the questions behind dedicated hardware. Read our notes on fairer assessments.' },
    about: { title: 'Our purpose & approach — Smart Detector', description: 'From a free app toward dedicated devices and AI learning process assessment. Learn how Smart Detector is shaping technology for fairer assessments and visible student contribution.' },
    contact: { title: 'Institution, partnership & investment inquiries — Smart Detector', description: 'Contact smartdetector@fwth.ai about institutional use, technical and research partnerships, investment or app support.' },
  },
};
export const contactTypes = [
  { id: 'institution', ko: '기관 활용·도입', en: 'Institutional use', subject: '[기관] 스마트 디텍터 활용 문의', subjectEn: '[Institution] Smart Detector inquiry', hintKo: '기관 유형, 평가 방식, 현재 필요한 점을 알려주세요.', hintEn: 'Tell us about your institution, assessment format and current needs.' },
  { id: 'partnership', ko: '기술·연구·사업 제휴', en: 'Research & partnerships', subject: '[제휴] 스마트 디텍터 협력 문의', subjectEn: '[Partnership] Smart Detector inquiry', hintKo: '함께 해결하고 싶은 문제와 협력 방향을 알려주세요.', hintEn: 'Tell us about the problem you want to solve and how we could work together.' },
  { id: 'investment', ko: '투자', en: 'Investment', subject: '[투자] 스마트 디텍터 문의', subjectEn: '[Investment] Smart Detector inquiry', hintKo: '브랜드와 사업 방향에 관해 나누고 싶은 이야기를 남겨주세요.', hintEn: 'Start a conversation about our brand and business direction.' },
  { id: 'support', ko: '앱 사용·일반 문의', en: 'App support & feedback', subject: '[앱 문의] 스마트 디텍터', subjectEn: '[Support] Smart Detector', hintKo: '앱 사용 중 궁금한 점이나 개선 의견을 알려주세요.', hintEn: 'Share a question about the app or an idea for improvement.' },
] as const;
export function mailto(type: typeof contactTypes[number], lang: Lang) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(lang === 'ko' ? type.subject : type.subjectEn)}`;
}
