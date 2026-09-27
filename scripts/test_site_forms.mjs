import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../site.js', import.meta.url), 'utf8');

function element(value = '') {
  return {
    value, className: '', textContent: '', required: false, disabled: false,
    listeners: {},
    addEventListener(name, handler) { this.listeners[name] = handler; },
    setAttribute() {}, removeAttribute() {}, focus() {}, reset() {},
    querySelector() { return this.button; }
  };
}

function mount(page, lang = 'fi', search = '') {
  const ids = {};
  const form = element();
  form.button = element();
  if (page === 'beta') {
    ids['beta-form'] = form;
    ids['beta-product'] = element('pquant');
    ids['beta-email'] = element('tester@example.test');
    ids['beta-company'] = element('');
    ids['beta-result'] = element();
  } else {
    ids['contact-form'] = form;
    ids['contact-type'] = element('feedback');
    ids['contact-product'] = element('pfield');
    ids['contact-reply'] = element('tester@example.test');
    ids['contact-message'] = element('A useful report');
    ids['contact-company'] = element('');
    ids['contact-result'] = element();
    ids['reply-requirement'] = element();
  }
  const requests = [];
  const context = {
    document: {
      documentElement: { lang },
      getElementById(id) { return ids[id] ?? null; },
      querySelector() { return null; }
    },
    window: { location: { search, href: 'https://ptakeoff.com/' + page + '/' } },
    navigator: { userAgent: 'site-test' },
    URLSearchParams,
    console,
    fetch: async (url, options) => {
      requests.push({ url, body: JSON.parse(options.body) });
      return { ok: true, json: async () => ({ success: true, alreadySignedUp: false }) };
    }
  };
  runInNewContext(source, context);
  return { ids, requests, form };
}

async function submit(instance) {
  await instance.form.listeners.submit({ preventDefault() {} });
  assert.equal(instance.form.button.disabled, false);
}

const quant = mount('beta');
await submit(quant);
assert.equal(quant.requests[0].url, 'https://project-qax4f.vercel.app/api/request-beta');
assert.equal(quant.requests[0].body.source, 'takeoff-website-beta-form');
assert.equal(quant.requests[0].body.email, 'tester@example.test');
assert.equal(quant.ids['beta-result'].className, 'form-result success');

const field = mount('beta', 'en', '?product=pfield');
assert.equal(field.ids['beta-product'].value, 'pfield');
await submit(field);
assert.equal(field.requests[0].url, 'https://project-qax4f.vercel.app/api/contact');
assert.equal(field.requests[0].body.message, 'PField beta access request');
assert.equal(field.requests[0].body.replyTo, 'tester@example.test');
assert.equal(field.requests[0].body.language, 'en');

const site = mount('beta', 'fi', '?product=psite');
await submit(site);
assert.equal(site.requests[0].body.message, 'PSite testing interest');

const feedback = mount('contact');
await submit(feedback);
assert.equal(feedback.requests[0].url, 'https://project-qax4f.vercel.app/api/contact');
assert.equal(feedback.requests[0].body.type, 'feedback');
assert.equal(feedback.requests[0].body.message, '[pfield] A useful report');
assert.equal(feedback.requests[0].body.source, 'takeoff-website-contact-form');
assert.equal(feedback.ids['contact-result'].className, 'form-result success');

const invalid = mount('contact');
invalid.ids['contact-reply'].value = '';
await submit(invalid);
assert.equal(invalid.requests.length, 0);
assert.equal(invalid.ids['contact-result'].className, 'form-result error');

console.log('Five bilingual/product form contract checks passed.');
