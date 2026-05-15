import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  formatAdminLoadError,
  formatAdminRpcError,
  formatAdminSaveError,
  formatContactItemError,
  formatMediaAssetDeleteError,
  formatPortfolioImageError,
  formatSiteTextError,
} from '../src/lib/admin/databaseErrors.ts';

describe('admin database error messages', () => {
  it('formats missing admin table load errors with the migration to run', () => {
    assert.equal(
      formatAdminLoadError('FAQ', 'faq_items', { code: '42P01', message: 'relation "faq_items" does not exist' }),
      'โหลดFAQไม่สำเร็จ: ให้รัน migration 202605100007_faq_items.sql ใน Supabase SQL Editor ก่อน',
    );
  });

  it('formats missing admin RPC errors with the migration to run', () => {
    assert.equal(
      formatAdminRpcError('ลบ FAQ', 'soft_delete_faq_item', {
        message: 'Could not find the function public.soft_delete_faq_item(item_id) in the schema cache',
      }),
      'ลบ FAQไม่สำเร็จ: ฐานข้อมูลยังไม่มี RPC soft_delete_faq_item ให้รัน migration 202605100010_soft_delete_content_tables.sql ใน Supabase SQL Editor ก่อน',
    );
  });

  it('points ambiguous admin RPC errors to the latest policy repair migration', () => {
    assert.equal(
      formatAdminRpcError('ลบ FAQ', 'soft_delete_faq_item', { message: 'function public.is_admin() is not unique' }),
      'ลบ FAQไม่สำเร็จ: ฐานข้อมูลยังมี function/policy เก่า public.is_admin() ให้รัน migration 202605150007_drop_legacy_is_admin_noarg.sql แล้ว refresh หน้า',
    );
  });

  it('formats admin save permission errors without leaking raw Supabase text', () => {
    assert.equal(
      formatAdminSaveError('บริการ', 'services', { message: 'new row violates row-level security policy for table "services"' }),
      'บันทึกบริการไม่สำเร็จ: บัญชีนี้ยังไม่มีสิทธิ์ admin หรือ RLS policy ยังไม่ครบ ให้รัน migration ล่าสุดและตรวจ admin_profiles',
    );
  });

  it('points hero background image slot errors to the landing background migration', () => {
    assert.equal(
      formatPortfolioImageError({
        message:
          'new row for relation "portfolio_image_overrides" violates check constraint "portfolio_image_overrides_image_slot_check"',
      }),
      'บันทึกรูปไม่สำเร็จ: ฐานข้อมูลยังไม่รองรับพื้นหลังหน้าแรก ให้รัน migration 202605150001_landing_hero_background_image.sql ก่อน',
    );
  });

  it('points ambiguous admin function errors to the explicit admin migration', () => {
    assert.equal(
      formatPortfolioImageError({ message: 'function public.is_admin() is not unique' }),
      'บันทึกรูปไม่สำเร็จ: ฐานข้อมูลยังเป็น schema เก่า ให้รัน migration 202605150002_explicit_admin_and_media_hard_delete.sql แล้วกดโหลดรูปใหม่',
    );
  });

  it('points missing hard delete media RPC errors to the explicit admin migration', () => {
    assert.equal(
      formatMediaAssetDeleteError({
        message: 'Could not find the function public.hard_delete_media_asset(asset_id) in the schema cache',
      }),
      'ลบ metadata รูปไม่สำเร็จ: ให้รัน migration 202605150002_explicit_admin_and_media_hard_delete.sql แล้วรอ/refresh schema cache ก่อนลองใหม่',
    );
  });

  it('points missing explicit admin helper errors to the repair migration', () => {
    assert.equal(
      formatPortfolioImageError({
        message: 'function public.is_admin(uuid) does not exist',
      }),
      'บันทึกรูปไม่สำเร็จ: ฐานข้อมูลยังไม่มี public.is_admin(uuid) ให้รัน migration 202605150005_repair_admin_rpc_permissions.sql แล้วกดโหลดรูปใหม่',
    );
  });

  it('points admin permission errors to the hardened delete migration', () => {
    assert.equal(
      formatMediaAssetDeleteError({ message: 'admin permission required' }),
      'ลบ metadata รูปไม่สำเร็จ: บัญชีนี้ยังไม่มีสิทธิ์ admin ให้เพิ่ม user ใน admin_profiles หรือรัน migration 202605150005_repair_admin_rpc_permissions.sql ถ้าเพิ่งอัปเดต schema',
    );
  });

  it('points missing set portfolio image RPC errors to the set RPC migration', () => {
    assert.equal(
      formatPortfolioImageError({
        message: 'Could not find the function public.set_portfolio_image_override in the schema cache',
      }),
      'บันทึกรูปไม่สำเร็จ: ให้รัน migration 202605150004_set_portfolio_image_override_rpc.sql แล้วกดโหลดรูปใหม่',
    );
  });

  it('points missing contact items to the contact migration', () => {
    assert.equal(
      formatContactItemError({ code: '42P01', message: 'relation "contact_items" does not exist' }),
      'บันทึกช่องทางติดต่อไม่สำเร็จ: ให้รัน migration 202605100011_contact_items.sql ก่อน',
    );
  });

  it('points missing site texts to the site text migration', () => {
    assert.equal(
      formatSiteTextError({ code: '42P01', message: 'relation "site_texts" does not exist' }),
      'บันทึกข้อความไม่สำเร็จ: ให้รัน migration 202605100009_site_texts_and_process_steps.sql ก่อน',
    );
  });

  it('formats contact item RLS errors without leaking raw Supabase text', () => {
    assert.equal(
      formatContactItemError({ message: 'new row violates row-level security policy for table "contact_items"' }),
      'บันทึกช่องทางติดต่อไม่สำเร็จ: บัญชีนี้ยังไม่มีสิทธิ์ admin หรือ RLS policy ยังไม่ครบ ให้รัน migration ล่าสุดและตรวจ admin_profiles',
    );
  });
});
