(() => {
  'use strict';
  const language = document.documentElement.lang === 'en' ? 'en' : 'ko';
  const siteRoot = new URL('.', document.currentScript.src);
  const copy = {
    ko: {
      signalActive: '확인이 필요한 새 신호가 있습니다',
      signalWaiting: '새로 수신된 신호를 기다리고 있습니다',
      demoReset: '예시 처음으로 되돌리기',
      demoStart: '예시 신호 켜 보기',
      download: 'Google Play에서 다운로드',
      storeStatus: 'Google Play · 무료',
      install: 'Google Play에서 앱을 설치하고 업데이트할 수 있습니다.',
      shareTitle: '스마트 디텍터',
      shareText: '시험 중 새로 수신된 무선 신호를 알려주는 무료 Android 감독 보조 앱',
      copied: '소개 페이지 링크를 복사했습니다.',
      copyManually: '주소창의 링크를 복사해 공유해 주세요.',
    },
    en: {
      signalActive: 'A new signal needs your attention',
      signalWaiting: 'Waiting for newly received signals',
      demoReset: 'Reset the example',
      demoStart: 'Try an example signal',
      download: 'Get it on Google Play',
      storeStatus: 'Google Play · Free',
      install: 'Install and update the app through Google Play.',
      shareTitle: 'Smart Detector',
      shareText: 'A free Android app that helps exam proctors notice newly received wireless signals',
      copied: 'Page link copied.',
      copyManually: 'Copy the link from your address bar to share this page.',
    },
  }[language];

  document.querySelectorAll('.language-link').forEach(link => {
    link.addEventListener('click', () => {
      const destination = new URL(link.href);
      destination.hash = location.hash;
      link.href = destination.href;
    });
  });

  const workflow = document.querySelector('[data-workflow]');
  if (workflow) {
    const tabs = [...workflow.querySelectorAll('[data-workflow-tab]')];
    const panels = [...workflow.querySelectorAll('[data-workflow-panel]')];
    workflow.dataset.enhanced = '';
    workflow.querySelector('.workflow-tabs').setAttribute('role', 'tablist');
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panels[index].id);
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', tab.id);
      panels[index].tabIndex = 0;
    });
    function selectStep(index, focus = false) {
      tabs.forEach((tab, position) => {
        const selected = position === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[position].hidden = !selected;
      });
      if (focus) tabs[index].focus();
    }
    function selectFromHash() {
      const index = panels.findIndex(panel => `#${panel.id}` === location.hash);
      if (index >= 0) selectStep(index);
    }
    selectStep(0);
    selectFromHash();
    window.addEventListener('hashchange', selectFromHash);
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', event => {
        event.preventDefault();
        selectStep(index);
      });
      tab.addEventListener('keydown', event => {
        const next = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1, ' ': index }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        selectStep(next, true);
      });
    });
  }

  const toggle = document.getElementById('demo-toggle');
  toggle.addEventListener('click', () => {
    const active = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(active));
    document.getElementById('signal-count').textContent = active ? '1' : '0';
    document.getElementById('number-plate').classList.toggle('is-alert', active);
    document.getElementById('plate-message').textContent = active ? copy.signalActive : copy.signalWaiting;
    document.getElementById('demo-empty').hidden = active;
    document.getElementById('demo-signal').hidden = !active;
    document.getElementById('demo-toggle-text').textContent = active ? copy.demoReset : copy.demoStart;
  });

  const status = document.getElementById('download-status');
  const detail = document.getElementById('download-detail');
  const button = document.getElementById('store-download');
  async function loadDownload() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(new URL('download.json', siteRoot), { cache: 'no-cache', signal: controller.signal });
      if (!response.ok) throw new Error('Download information unavailable');
      const info = await response.json();
      if (!info.available || info.channel !== 'google-play') return;
      const url = new URL(info.url, siteRoot);
      if (url.href !== 'https://play.google.com/store/apps/details?id=ai.fwth.smartdetector') throw new Error('Invalid store destination');
      button.href = url.href;
      document.getElementById('download-label').textContent = copy.download;
      status.textContent = copy.storeStatus;
      detail.textContent = copy.install;
    } catch (_) {
      // Keep the working Google Play link in the HTML if the feed is unavailable.
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
        await navigator.share({ title: copy.shareTitle, text: copy.shareText, url });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast(copy.copied);
    } catch (_) {
      toast(copy.copyManually);
    }
  });
})();
