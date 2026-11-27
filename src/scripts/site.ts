import { buildInquiry } from './contact';
import { EMAIL, contactTypes, type Lang } from '../data/site';

const docLang = document.documentElement.lang;
const inquiryLang: Lang | 'ja' = docLang === 'ja' ? 'ja' : docLang === 'en' ? 'en' : 'ko';
const ja = docLang === 'ja';
const ko = docLang === 'ko';
const pick = (koText: string, enText: string, jaText: string) => (ja ? jaText : ko ? koText : enText);
document.querySelectorAll<HTMLElement>('[data-assessment-demo]').forEach(demo => {
  const tabs = [...demo.querySelectorAll<HTMLAnchorElement>('[data-assessment-tab]')];
  const panels = [...demo.querySelectorAll<HTMLElement>('[data-assessment-panel]')];
  if (!tabs.length || tabs.length !== panels.length) return;
  demo.querySelector('.assessment-tabs')?.setAttribute('role', 'tablist');
  function select(index: number, focus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', event => { event.preventDefault(); select(index); });
    tab.addEventListener('keydown', event => {
      const targets: Record<string, number> = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1, ' ': index };
      if (event.key in targets) { event.preventDefault(); select(targets[event.key], true); }
    });
  });
  function selectHash() {
    const index = panels.findIndex(panel => '#' + panel.id === location.hash);
    if (index >= 0) select(index);
  }
  select(0);
  selectHash();
  window.addEventListener('hashchange', selectHash);
});

const reportDialog = document.querySelector<HTMLDialogElement>('[data-report-dialog]');
if (reportDialog && typeof reportDialog.showModal === 'function') {
  const scroll = reportDialog.querySelector<HTMLElement>('[data-report-scroll]')!;
  const zoom = reportDialog.querySelector<HTMLButtonElement>('[data-report-zoom]')!;
  let reportOpener: HTMLElement | null = null;
  document.querySelectorAll<HTMLAnchorElement>('[data-report-open]').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      reportOpener = link;
      delete scroll.dataset.zoomed;
      zoom.setAttribute('aria-pressed', 'false');
      zoom.textContent = pick('크게 보기', 'Zoom in', '拡大表示');
      reportDialog.showModal();
      scroll.scrollTo(0, 0);
    });
  });
  zoom.addEventListener('click', () => {
    const enlarged = zoom.getAttribute('aria-pressed') !== 'true';
    if (enlarged) scroll.dataset.zoomed = ''; else delete scroll.dataset.zoomed;
    zoom.setAttribute('aria-pressed', String(enlarged));
    zoom.textContent = enlarged ? pick('화면에 맞추기', 'Fit to screen', '画面に合わせる') : pick('크게 보기', 'Zoom in', '拡大表示');
    scroll.scrollTo(0, 0);
  });
  reportDialog.querySelector('[data-report-close]')?.addEventListener('click', () => reportDialog.close());
  reportDialog.addEventListener('click', event => {
    if (event.target !== reportDialog) return;
    const box = reportDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) reportDialog.close();
  });
  reportDialog.addEventListener('close', () => reportOpener?.focus({ preventScroll: true }));
}

document.querySelectorAll<HTMLElement>('[data-tutorial]').forEach(player => {
  const cover = player.querySelector<HTMLAnchorElement>('[data-video-play]');
  if (!cover || !player.dataset.embedSrc) return;
  cover.setAttribute('role', 'button');
  cover.setAttribute('aria-label', pick('이 페이지에서 영상 재생', 'Play tutorial on this page', 'このページで動画を再生'));
  const start = () => {
    const iframe = document.createElement('iframe');
    iframe.src = player.dataset.embedSrc!;
    iframe.title = player.dataset.videoTitle!;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    player.replaceChildren(iframe);
    iframe.focus();
  };
  cover.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    start();
  });
  cover.addEventListener('keydown', event => {
    if (event.key === ' ') { event.preventDefault(); start(); }
  });
});

let toastTimer: ReturnType<typeof setTimeout>;
function toast(message: string) {
  const element = document.querySelector<HTMLElement>('#toast');
  if (!element) return;
  clearTimeout(toastTimer);
  element.textContent = message;
  element.hidden = false;
  toastTimer = setTimeout(() => { element.hidden = true; }, 6000);
}
async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(value); return; } catch { /* Try selection-based copying below. */ }
  }
  const area = document.createElement('textarea');
  area.value = value;
  area.setAttribute('readonly', '');
  area.style.cssText = 'position:fixed;left:-9999px;top:0';
  document.body.append(area);
  const focus = document.activeElement as HTMLElement | null;
  area.select();
  const copied = document.execCommand('copy');
  area.remove();
  focus?.focus({ preventScroll: true });
  if (!copied) throw new Error('Copy unavailable');
}

document.querySelectorAll<HTMLAnchorElement>('.language-link').forEach(link => {
  link.addEventListener('click', () => {
    const destination = new URL(link.href);
    if (location.hash) destination.hash = location.hash;
    const type = new URL(location.href).searchParams.get('type');
    if (destination.pathname.includes('/contact/') && contactTypes.some(item => item.id === type)) destination.searchParams.set('type', type!);
    link.href = destination.href;
  });
});

const menu = document.querySelector<HTMLDetailsElement>('.mobile-menu');
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.open) {
    menu.open = false;
    menu.querySelector<HTMLElement>('summary')?.focus();
  }
});
document.addEventListener('click', event => {
  if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
});
matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches && menu) menu.open = false; });

document.querySelectorAll<HTMLElement>('[data-workflow]').forEach(workflow => {
  const tabs = [...workflow.querySelectorAll<HTMLAnchorElement>('[data-step]')];
  const panels = [...workflow.querySelectorAll<HTMLElement>('[data-step-panel]')];
  if (!tabs.length || tabs.length !== panels.length) return;
  const list = workflow.querySelector('.workflow-steps');
  list?.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
  });
  function select(index: number, focus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  }
  function fromHash() {
    const index = panels.findIndex(panel => '#' + panel.id === location.hash);
    if (index >= 0) select(index);
  }
  workflow.dataset.enhanced = '';
  select(0);
  fromHash();
  window.addEventListener('hashchange', fromHash);
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', event => { event.preventDefault(); select(index); });
    tab.addEventListener('keydown', event => {
      const targets: Record<string, number> = { ArrowRight: (index + 1) % tabs.length, ArrowDown: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, ArrowUp: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1, ' ': index };
      if (event.key in targets) { event.preventDefault(); select(targets[event.key], true); }
    });
  });
});

const filters = document.querySelector<HTMLElement>('[data-journal-filters]');
if (filters) {
  filters.hidden = false;
  const controls = [...filters.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const rows = [...document.querySelectorAll<HTMLElement>('[data-article-category]')];
  controls.forEach(button => button.addEventListener('click', () => {
    controls.forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    let count = 0;
    rows.forEach(row => { row.hidden = button.dataset.filter !== 'all' && row.dataset.articleCategory !== button.dataset.filter; if (!row.hidden) count++; });
    const status = document.querySelector('.journal-filter-status');
    if (status) status.textContent = pick(`${count}개의 글을 표시합니다.`, `${count} ${count === 1 ? 'article' : 'articles'} shown.`, `${count}件の記事を表示しています。`);
  }));
}

document.querySelectorAll<HTMLButtonElement>('[data-share]').forEach(button => {
  button.addEventListener('click', async () => {
    const url = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || location.href;
    const data = { title: document.title, url };
    if (navigator.share) {
      try { await navigator.share(data); document.dispatchEvent(new CustomEvent('smart-detector:share')); return; }
      catch (error) { if (error instanceof Error && error.name === 'AbortError') return; }
    }
    try { await copyText(url); toast(pick('공유할 링크를 복사했습니다.', 'Link copied.', '共有リンクをコピーしました。')); document.dispatchEvent(new CustomEvent('smart-detector:share')); }
    catch { toast(pick('링크를 복사하지 못했습니다. 주소창에서 직접 복사해 주세요.', 'Could not copy the link. Copy it from your address bar.', 'リンクをコピーできませんでした。アドレスバーから直接コピーしてください。')); }
  });
});

document.querySelector<HTMLButtonElement>('[data-copy-email]')?.addEventListener('click', async () => {
  try { await copyText(EMAIL); toast(pick('이메일 주소를 복사했습니다.', 'Email address copied.', 'メールアドレスをコピーしました。')); }
  catch { toast(pick('화면의 이메일 주소를 선택해 직접 복사해 주세요.', 'Select and copy the email address displayed on this page.', '画面上のメールアドレスを選択してコピーしてください。')); }
});

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
if (form) {
  const type = form.querySelector<HTMLSelectElement>('#contact-type')!;
  const organization = form.querySelector<HTMLInputElement>('#contact-organization')!;
  const message = form.querySelector<HTMLTextAreaElement>('#contact-message')!;
  const status = form.querySelector<HTMLElement>('#contact-status')!;
  const initial = new URL(location.href).searchParams.get('type');
  if (contactTypes.some(item => item.id === initial)) type.value = initial!;
  type.addEventListener('change', () => {
    const next = new URL(location.href);
    next.searchParams.set('type', type.value);
    history.replaceState(null, '', next);
  });
  const current = () => buildInquiry({ type: type.value, organization: organization.value, message: message.value }, inquiryLang);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!message.value.trim()) { message.setCustomValidity(pick('문의 내용을 입력해 주세요.', 'Please enter your message.', 'お問い合わせ内容を入力してください。')); message.reportValidity(); return; }
    const inquiry = current();
    if (!inquiry.canOpen) {
      status.textContent = pick('내용이 길어 메일 앱으로 바로 옮길 수 없습니다. ‘내용 복사’를 눌러 이메일에 붙여넣어 주세요. 작성한 내용은 이 화면에 남아 있습니다.', 'This message is too long to open directly in an email app. Use Copy message, then paste it into an email. Your text is still here.', '文字数が多いためメールアプリで直接開けません。「本文をコピー」を押してメールに貼り付けてください。入力内容はこの画面に残っています。');
      return;
    }
    status.textContent = pick('메일 앱이 열리면 내용을 확인한 뒤 직접 발송해 주세요. 열리지 않으면 ‘내용 복사’를 이용해 주세요.', 'If your email app opens, review and send the message there. If it does not open, use Copy message.', 'メールアプリが開いたら内容をご確認のうえ送信してください。開かない場合は「本文をコピー」をご利用ください。');
    window.location.href = inquiry.url;
  });
  message.addEventListener('input', () => { message.setCustomValidity(''); status.textContent = ''; });
  form.querySelector<HTMLButtonElement>('[data-copy-message]')?.addEventListener('click', async () => {
    const inquiry = current();
    if (!message.value.trim()) { message.focus(); status.textContent = pick('복사할 문의 내용을 먼저 입력해 주세요.', 'Enter a message before copying it.', 'コピーするお問い合わせ内容を先に入力してください。'); return; }
    try {
      await copyText(`${inquiry.subject}\n\n${inquiry.body}`);
      status.textContent = pick('제목과 내용을 복사했습니다. 이메일에 붙여넣은 뒤 보내주세요.', 'Subject and message copied. Paste them into an email, then send it.', '件名と本文をコピーしました。メールに貼り付けて送信してください。');
    } catch {
      message.focus(); message.select();
      status.textContent = pick('복사하지 못했습니다. 선택된 내용을 직접 복사해 주세요.', 'Could not copy the message. Copy the selected text manually.', 'コピーできませんでした。選択されたテキストを手動でコピーしてください。');
    }
  });
  form.hidden = false;
}
