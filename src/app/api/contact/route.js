import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CATEGORY_LABELS = {
  'ki-automatisierung': 'KI & Automatisierung',
  'webdesign': 'Webdesign & Entwicklung',
  'it-support': 'IT-Support & Cloud',
  'beratung': 'Kostenlose Beratung',
  'sonstiges': 'Sonstiges',
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isValidEmail = (value) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  const firstName = String(payload.firstName ?? '').trim();
  const lastName = String(payload.lastName ?? '').trim();
  const email = String(payload.email ?? '').trim();
  const phone = String(payload.phone ?? '').trim();
  const company = String(payload.company ?? '').trim();
  const category = String(payload.category ?? '').trim();
  const message = String(payload.message ?? '').trim();

  if (!firstName || !lastName || !email || !category || !message) {
    return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 400 });
  }

  const {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USER,
    MAIL_PASSWORD,
    MAIL_FROM,
    MAIL_TO,
  } = process.env;

  if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASSWORD || !MAIL_FROM || !MAIL_TO) {
    console.error('Mail-Konfiguration unvollständig');
    return NextResponse.json({ error: 'Mail-Konfiguration unvollständig' }, { status: 500 });
  }

  const port = Number(MAIL_PORT);
  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  const fullName = `${firstName} ${lastName}`;
  const categoryLabel = CATEGORY_LABELS[category] ?? category;

  const textBody = [
    'Neue Projektanfrage über sakaits.com',
    '',
    `Name:        ${fullName}`,
    `E-Mail:      ${email}`,
    `Telefon:     ${phone || 'Nicht angegeben'}`,
    `Unternehmen: ${company || 'Nicht angegeben'}`,
    `Kategorie:   ${categoryLabel}`,
    '',
    'Nachricht:',
    message,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
      <h2 style="margin:0 0 16px;">Neue Projektanfrage über sakaits.com</h2>
      <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(fullName)}</td></tr>
        <tr><td><strong>E-Mail</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td><strong>Telefon</strong></td><td>${escapeHtml(phone || 'Nicht angegeben')}</td></tr>
        <tr><td><strong>Unternehmen</strong></td><td>${escapeHtml(company || 'Nicht angegeben')}</td></tr>
        <tr><td><strong>Kategorie</strong></td><td>${escapeHtml(categoryLabel)}</td></tr>
      </table>
      <h3 style="margin: 20px 0 8px;">Nachricht</h3>
      <div style="white-space: pre-wrap;">${escapeHtml(message)}</div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: `${fullName} <${email}>`,
      subject: `Neue Projektanfrage: ${categoryLabel} – ${fullName}`,
      text: textBody,
      html: htmlBody,
    });
  } catch (error) {
    console.error('Fehler beim Senden der Email:', error);
    return NextResponse.json({ error: 'Senden fehlgeschlagen' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
