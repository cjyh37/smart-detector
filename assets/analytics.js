(() => {
  'use strict';

  // Public measurement ID for the Smart Detector GA4 web stream.
  const measurementId = 'G-RTM8KWHRDM';
  if (!/^G-[A-Z0-9]+$/.test(measurementId) || location.hostname !== 'smartdetector.fwth.ai') return;
  if (document.querySelector('script[data-smart-detector-analytics]')) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  tag.setAttribute('data-smart-detector-analytics', '');
  document.head.appendChild(tag);

  // Measure download intent; this does not claim the APK was installed.
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('#apk-download') : null;
    if (!link || !link.hasAttribute('href') || link.getAttribute('aria-disabled') === 'true') return;
    const url = new URL(link.href);
    if (!url.pathname.toLowerCase().endsWith('.apk')) return;

    window.gtag('event', 'apk_download', {
      send_to: measurementId,
      file_name: url.pathname.split('/').pop(),
      file_extension: 'apk',
      link_url: url.origin + url.pathname,
      page_language: document.documentElement.lang,
    });
  });
})();
