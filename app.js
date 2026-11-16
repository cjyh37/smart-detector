(() => {
  'use strict';
  const toggle = document.getElementById('demo-toggle');
  toggle.addEventListener('click', () => {
    const active = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(active));
    document.getElementById('signal-count').textContent = active ? '1' : '0';
    document.getElementById('number-plate').classList.toggle('is-alert', active);
    document.getElementById('plate-message').textContent = active ? '확인이 필요한 새 신호가 있습니다' : '새로 수신된 신호를 기다리고 있습니다';
    document.getElementById('demo-empty').hidden = active;
    document.getElementById('demo-signal').hidden = !active;
    document.getElementById('demo-toggle-text').textContent = active ? '예시 처음으로 되돌리기' : '예시 신호 켜 보기';
  });

  const status = document.getElementById('download-status');
  const detail = document.getElementById('download-detail');
  const button = document.getElementById('apk-download');
  async function loadDownload() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch('download.json', { cache: 'no-cache', signal: controller.signal });
      if (!response.ok) throw new Error('Download information unavailable');
      const info = await response.json();
      if (!info.available) return;
      const url = new URL(info.url, location.href);
      const localDirectory = new URL('downloads/', location.href);
      const isLocal = url.origin === location.origin && url.pathname.startsWith(localDirectory.pathname);
      const isRelease = url.origin === 'https://github.com' && url.pathname.startsWith('/cjyh37/smart-detector/releases/download/');
      if ((!isLocal && !isRelease) || !url.pathname.toLowerCase().endsWith('.apk')) throw new Error('Invalid download location');
      button.href = url.href;
      button.removeAttribute('aria-disabled');
      button.removeAttribute('tabindex');
      if (isLocal) button.setAttribute('download', info.filename || 'smart-detector.apk');
      document.getElementById('download-label').textContent = 'APK 무료 다운로드';
      const size = Number.isFinite(info.size) && info.size > 0 ? `${(info.size / 1048576).toFixed(1)} MB` : '';
      status.textContent = [info.version || '공개 버전', size].filter(Boolean).join(' · ');
      detail.textContent = 'Android 휴대폰에서 내려받은 파일을 열어 설치하세요.';
    } catch (_) {
      status.textContent = '다운로드 정보를 불러오지 못했습니다.';
      detail.textContent = '아래 ‘배포 내역 보기’에서 파일을 확인하거나 페이지를 새로고침해 주세요.';
    } finally {
      clearTimeout(timer);
    }
  }
  loadDownload();

  let toastTimer;
  function toast(message) {
    const element = document.getElementById('toast');
    clearTimeout(toastTimer);
    element.textContent = message;
    element.hidden = false;
    toastTimer = setTimeout(() => { element.hidden = true; }, 5000);
  }
  document.getElementById('share-button').addEventListener('click', async () => {
    const url = document.querySelector('link[rel="canonical"]').href;
    if (navigator.share) {
      try {
        await navigator.share({ title: '스마트 디텍터', text: '시험 중 새로 수신된 무선 신호를 알려주는 무료 Android 감독 보조 앱', url });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast('소개 페이지 링크를 복사했습니다.');
    } catch (_) {
      toast('주소창의 링크를 복사해 공유해 주세요.');
    }
  });
})();
