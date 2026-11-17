import { EMAIL, contactTypes, type Lang } from '../data/site.ts';

export function buildInquiry(input: { type: string; organization: string; message: string }, lang: Lang) {
  const type = contactTypes.find(item => item.id === input.type) || contactTypes[0];
  const subject = lang === 'ko' ? type.subject : type.subjectEn;
  const organization = input.organization.trim();
  const body = [organization ? `${lang === 'ko' ? '이름 / 기관' : 'Name / organization'}: ${organization}` : '', input.message.trim()].filter(Boolean).join('\n\n');
  const url = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { type: type.id, subject, body, url, canOpen: url.length <= 1800 };
}
