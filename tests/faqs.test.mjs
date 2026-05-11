import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createBlankFaqForm, mapFaqFormToInsert, validateFaqForm } from '../src/lib/admin/faqs.ts';
import { buildDefaultFaqItems, mapFaqRows } from '../src/lib/faqs.ts';
import en from '../src/locales/en.json' with { type: 'json' };
import th from '../src/locales/th.json' with { type: 'json' };

describe('FAQ content helpers', () => {
  it('builds bilingual fallback FAQ items from translations', () => {
    const faqs = buildDefaultFaqItems(th.faq.questions, en.faq.questions);

    assert.equal(faqs.length, th.faq.questions.length);
    assert.equal(faqs[0].question.th, th.faq.questions[0].question);
    assert.equal(faqs[0].question.en, en.faq.questions[0].question);
  });

  it('maps database rows and hides unpublished rows for public use', () => {
    const fallback = buildDefaultFaqItems(th.faq.questions, en.faq.questions);
    const rows = [
      {
        id: '11111111-1111-4111-8111-111111111111',
        question: { th: 'คำถามใหม่', en: 'New question' },
        answer: { th: 'คำตอบใหม่', en: 'New answer' },
        sort_order: 20,
        published: true,
        created_at: null,
        updated_at: null,
      },
      {
        id: '22222222-2222-4222-8222-222222222222',
        question: { th: 'ซ่อน', en: 'Hidden' },
        answer: { th: 'ซ่อน', en: 'Hidden' },
        sort_order: 10,
        published: false,
        created_at: null,
        updated_at: null,
      },
    ];

    const publicFaqs = mapFaqRows(rows, fallback);
    const adminFaqs = mapFaqRows(rows, fallback, true);

    assert.equal(publicFaqs.length, 1);
    assert.equal(publicFaqs[0].question.th, 'คำถามใหม่');
    assert.equal(adminFaqs.length, 2);
    assert.equal(adminFaqs[0].question.th, 'ซ่อน');
  });

  it('validates required Thai FAQ fields', () => {
    const form = {
      ...createBlankFaqForm(10),
      questionTh: 'ถาม',
      answerTh: 'ตอบ',
    };

    assert.equal(validateFaqForm(form).ok, true);
    assert.equal(validateFaqForm({ ...form, answerTh: '' }).ok, false);
  });

  it('maps FAQ form values to a Supabase insert shape', () => {
    const insert = mapFaqFormToInsert({
      ...createBlankFaqForm(10),
      questionTh: 'ถาม',
      answerTh: 'ตอบ',
    });

    assert.deepEqual(insert.question, { th: 'ถาม', en: 'ถาม' });
    assert.deepEqual(insert.answer, { th: 'ตอบ', en: 'ตอบ' });
    assert.equal(insert.sort_order, 10);
  });
});
