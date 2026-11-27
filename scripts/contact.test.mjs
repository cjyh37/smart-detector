import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInquiry } from '../src/scripts/contact.ts';

test('contact topics are allowlisted and message characters stay in the body', () => {
  const result = buildInquiry({ type: 'investment', organization: 'A & B', message: 'Question? a=1&bcc=other@example.com\nNext line' }, 'en');
  const url = new URL(result.url);
  assert.equal(url.pathname, 'help@fwth.ai');
  assert.equal(url.searchParams.get('subject'), '[Investment] Smart Detector inquiry');
  assert.equal(url.searchParams.get('bcc'), null);
  assert.match(url.searchParams.get('body'), /A & B/);
  assert.match(url.searchParams.get('body'), /a=1&bcc=other@example.com\nNext line/);
  assert.equal(result.type, 'investment');
});

test('unknown topics fall back without injecting a subject', () => {
  const result = buildInquiry({ type: 'invalid&subject=other', organization: '', message: 'Hello' }, 'en');
  assert.equal(result.type, 'institution');
  assert.equal(new URL(result.url).searchParams.get('subject'), '[Institution] Smart Detector inquiry');
  assert.equal(result.body, 'Hello');
});

test('long messages request the copy path instead of an oversized mail URI', () => {
  const message = '\uD55C\uAE00'.repeat(500);
  const result = buildInquiry({ type: 'support', organization: '', message }, 'ko');
  assert.equal(result.canOpen, false);
  assert.equal(result.body, message);
});

test('Japanese inquiries use Japanese subjects and organization labels', () => {
  const result = buildInquiry({ type: 'partnership', organization: '〇〇大学', message: '共同研究の相談' }, 'ja');
  const url = new URL(result.url);
  assert.equal(url.searchParams.get('subject'), '[提携・共同研究] Smart Detector お問い合わせ');
  assert.match(url.searchParams.get('body'), /お名前・機関名: 〇〇大学/);
});
