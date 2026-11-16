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

  // Measure store visits; this does not claim the app was installed.
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('#store-download') : null;
    if (!link || !link.hasAttribute('href') || link.getAttribute('aria-disabled') === 'true') return;
    const url = new URL(link.href);
    if (url.href !== 'https://play.google.com/store/apps/details?id=ai.fwth.smartdetector') return;

    window.gtag('event', 'google_play_click', {
      send_to: measurementId,
      app_id: 'ai.fwth.smartdetector',
      link_url: url.href,
      page_language: document.documentElement.lang,
    });
  });
})();
