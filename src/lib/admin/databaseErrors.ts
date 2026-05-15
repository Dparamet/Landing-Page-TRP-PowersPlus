type DatabaseErrorLike = {
  message?: string;
  code?: string;
};

const missingMigrationByRelation: Record<string, string> = {
  contact_items: '202605100011_contact_items.sql',
  faq_items: '202605100007_faq_items.sql',
  portfolio_projects: '202605100006_portfolio_posts_soft_delete.sql',
  process_steps: '202605100009_site_texts_and_process_steps.sql',
  services: '202605100001_init_cms.sql และ 202605150002_explicit_admin_and_media_hard_delete.sql',
  site_texts: '202605100009_site_texts_and_process_steps.sql',
};

const missingMigrationByRpc: Record<string, string> = {
  hard_delete_contact_item: '202605100011_contact_items.sql',
  hard_delete_faq_item: '202605100010_soft_delete_content_tables.sql',
  hard_delete_portfolio_project: '202605100010_soft_delete_content_tables.sql',
  hard_delete_process_step: '202605100010_soft_delete_content_tables.sql',
  hard_delete_service: '202605100010_soft_delete_content_tables.sql',
  restore_contact_item: '202605100011_contact_items.sql',
  restore_faq_item: '202605100010_soft_delete_content_tables.sql',
  restore_portfolio_project: '202605100010_soft_delete_content_tables.sql',
  restore_process_step: '202605100010_soft_delete_content_tables.sql',
  restore_service: '202605100010_soft_delete_content_tables.sql',
  soft_delete_contact_item: '202605100011_contact_items.sql',
  soft_delete_faq_item: '202605100010_soft_delete_content_tables.sql',
  soft_delete_portfolio_project: '202605100010_soft_delete_content_tables.sql',
  soft_delete_process_step: '202605100010_soft_delete_content_tables.sql',
  soft_delete_service: '202605100010_soft_delete_content_tables.sql',
};

export function formatAdminLoadError(entityLabel: string, relation: string, error: DatabaseErrorLike) {
  if (isPermissionError(error)) {
    return `โหลด${entityLabel}ไม่สำเร็จ: บัญชีนี้ยังไม่มีสิทธิ์ admin หรือ RLS policy ยังไม่ครบ ให้รัน migration ล่าสุดและตรวจ admin_profiles`;
  }

  if (isMissingRelation(error, relation)) {
    return `โหลด${entityLabel}ไม่สำเร็จ: ให้รัน migration ${missingMigrationByRelation[relation] ?? 'ล่าสุด'} ใน Supabase SQL Editor ก่อน`;
  }

  return `โหลด${entityLabel}ไม่สำเร็จ: ${error.message ?? 'ไม่ทราบสาเหตุ'}`;
}

export function formatAdminSaveError(entityLabel: string, relation: string, error: DatabaseErrorLike) {
  if (isPermissionError(error)) {
    return `บันทึก${entityLabel}ไม่สำเร็จ: บัญชีนี้ยังไม่มีสิทธิ์ admin หรือ RLS policy ยังไม่ครบ ให้รัน migration ล่าสุดและตรวจ admin_profiles`;
  }

  if (isMissingRelation(error, relation)) {
    return `บันทึก${entityLabel}ไม่สำเร็จ: ให้รัน migration ${missingMigrationByRelation[relation] ?? 'ล่าสุด'} ใน Supabase SQL Editor ก่อน`;
  }

  if (isInvalidForeignKey(error)) {
    return `บันทึก${entityLabel}ไม่สำเร็จ: ข้อมูลอ้างอิงยังไม่ครบ เช่น หมวดหมู่/บริการ ให้บันทึกข้อมูลหลักก่อน`;
  }

  return `บันทึก${entityLabel}ไม่สำเร็จ: ${error.message ?? 'ไม่ทราบสาเหตุ'}`;
}

export function formatAdminRpcError(actionLabel: string, rpcName: string, error: DatabaseErrorLike) {
  if (isAdminFunctionAmbiguous(error)) {
    return `${actionLabel}ไม่สำเร็จ: ฐานข้อมูลยังมี function/policy เก่า public.is_admin() ให้รัน migration 202605150007_drop_legacy_is_admin_noarg.sql แล้ว refresh หน้า`;
  }

  if (isMissingRpc(error, rpcName)) {
    return `${actionLabel}ไม่สำเร็จ: ฐานข้อมูลยังไม่มี RPC ${rpcName} ให้รัน migration ${missingMigrationByRpc[rpcName] ?? 'ล่าสุด'} ใน Supabase SQL Editor ก่อน`;
  }

  if (isPermissionError(error)) {
    return `${actionLabel}ไม่สำเร็จ: บัญชีนี้ยังไม่มีสิทธิ์ admin หรือ RLS policy ยังไม่ครบ ให้รัน migration ล่าสุดและตรวจ admin_profiles`;
  }

  return `${actionLabel}ไม่สำเร็จ: ${error.message ?? 'ไม่ทราบสาเหตุ'}`;
}

export function formatPortfolioImageError(error: DatabaseErrorLike) {
  if (isMissingExplicitAdminFunction(error)) {
    return 'บันทึกรูปไม่สำเร็จ: ฐานข้อมูลยังไม่มี public.is_admin(uuid) ให้รัน migration 202605150005_repair_admin_rpc_permissions.sql แล้วกดโหลดรูปใหม่';
  }

  if (isMissingSetPortfolioImageFunction(error)) {
    return 'บันทึกรูปไม่สำเร็จ: ให้รัน migration 202605150004_set_portfolio_image_override_rpc.sql แล้วกดโหลดรูปใหม่';
  }

  if (isAdminPermissionError(error)) {
    return 'บันทึกรูปไม่สำเร็จ: บัญชีนี้ยังไม่มีสิทธิ์ admin หรือยังไม่ได้รัน migration 202605150003_harden_media_and_hero_delete.sql';
  }

  if (isAdminFunctionAmbiguous(error) || isMissingHardDeleteMediaFunction(error)) {
    return 'บันทึกรูปไม่สำเร็จ: ฐานข้อมูลยังเป็น schema เก่า ให้รัน migration 202605150002_explicit_admin_and_media_hard_delete.sql แล้วกดโหลดรูปใหม่';
  }

  if (hasErrorText(error, 'portfolio_image_overrides_image_slot_check')) {
    return 'บันทึกรูปไม่สำเร็จ: ฐานข้อมูลยังไม่รองรับพื้นหลังหน้าแรก ให้รัน migration 202605150001_landing_hero_background_image.sql ก่อน';
  }

  if (hasErrorText(error, 'portfolio_image_overrides')) {
    return 'บันทึกรูปไม่สำเร็จ: ให้รัน migration 202605100005_portfolio_image_overrides.sql ก่อน';
  }

  return `บันทึกรูปไม่สำเร็จ: ${error.message ?? 'ไม่ทราบสาเหตุ'}`;
}

export function formatMediaAssetDeleteError(error: DatabaseErrorLike) {
  if (hasErrorText(error, 'Direct deletion from storage tables is not allowed')) {
    return 'ลบ metadata รูปไม่สำเร็จ: ฐานข้อมูลยังใช้ RPC เก่าที่ลบ storage.objects โดยตรง ให้รัน migration 202605150008_media_delete_storage_api.sql แล้ว refresh หน้า';
  }

  if (isMissingExplicitAdminFunction(error)) {
    return 'ลบ metadata รูปไม่สำเร็จ: ฐานข้อมูลยังไม่มี public.is_admin(uuid) ให้รัน migration 202605150005_repair_admin_rpc_permissions.sql แล้วกดโหลดรูปใหม่';
  }

  if (isAdminPermissionError(error)) {
    return 'ลบ metadata รูปไม่สำเร็จ: บัญชีนี้ยังไม่มีสิทธิ์ admin ให้เพิ่ม user ใน admin_profiles หรือรัน migration 202605150005_repair_admin_rpc_permissions.sql ถ้าเพิ่งอัปเดต schema';
  }

  if (isMissingHardDeleteMediaFunction(error) || isAdminFunctionAmbiguous(error)) {
    return 'ลบ metadata รูปไม่สำเร็จ: ให้รัน migration 202605150002_explicit_admin_and_media_hard_delete.sql แล้วรอ/refresh schema cache ก่อนลองใหม่';
  }

  return `ลบ metadata รูปไม่สำเร็จ: ${error.message ?? 'ไม่ทราบสาเหตุ'}`;
}

export function formatPortfolioImageLoadError(error: DatabaseErrorLike | null) {
  if (error && hasErrorText(error, 'portfolio_image_overrides')) {
    return 'โหลดรูปหรือรายการ override ไม่สำเร็จ ให้รัน migration 202605100005_portfolio_image_overrides.sql และ 202605150001_landing_hero_background_image.sql ก่อน';
  }

  return 'โหลดรูปหรือรายการ override ไม่สำเร็จ ตรวจสอบ migration ล่าสุด';
}

export function formatContactItemError(error: DatabaseErrorLike) {
  if (isPermissionError(error)) {
    return 'บันทึกช่องทางติดต่อไม่สำเร็จ: บัญชีนี้ยังไม่มีสิทธิ์ admin หรือ RLS policy ยังไม่ครบ ให้รัน migration ล่าสุดและตรวจ admin_profiles';
  }

  if (isMissingRelation(error, 'contact_items')) {
    return 'บันทึกช่องทางติดต่อไม่สำเร็จ: ให้รัน migration 202605100011_contact_items.sql ก่อน';
  }

  return `บันทึกช่องทางติดต่อไม่สำเร็จ: ${error.message ?? 'ไม่ทราบสาเหตุ'}`;
}

export function formatSiteTextError(error: DatabaseErrorLike) {
  if (isPermissionError(error)) {
    return 'บันทึกข้อความไม่สำเร็จ: บัญชีนี้ยังไม่มีสิทธิ์ admin หรือ RLS policy ยังไม่ครบ ให้รัน migration ล่าสุดและตรวจ admin_profiles';
  }

  if (isMissingRelation(error, 'site_texts')) {
    return 'บันทึกข้อความไม่สำเร็จ: ให้รัน migration 202605100009_site_texts_and_process_steps.sql ก่อน';
  }

  return `บันทึกข้อความไม่สำเร็จ: ${error.message ?? 'ไม่ทราบสาเหตุ'}`;
}

function isMissingRelation(error: DatabaseErrorLike, relation: string) {
  return error.code === '42P01' || hasErrorText(error, `relation "${relation}" does not exist`) || hasErrorText(error, relation);
}

function isMissingRpc(error: DatabaseErrorLike, rpcName: string) {
  return hasErrorText(error, rpcName) || hasErrorText(error, 'schema cache') || hasErrorText(error, 'Could not find the function');
}

function isPermissionError(error: DatabaseErrorLike) {
  return isAdminPermissionError(error) || hasErrorText(error, 'row-level security') || hasErrorText(error, 'violates row-level security policy');
}

function isInvalidForeignKey(error: DatabaseErrorLike) {
  return error.code === '23503' || hasErrorText(error, 'violates foreign key constraint');
}

function isAdminFunctionAmbiguous(error: DatabaseErrorLike) {
  return hasErrorText(error, 'function public.is_admin() is not unique');
}

function isMissingExplicitAdminFunction(error: DatabaseErrorLike) {
  return hasErrorText(error, 'function public.is_admin(uuid) does not exist') || hasErrorText(error, 'is_admin(uuid)');
}

function isAdminPermissionError(error: DatabaseErrorLike) {
  return hasErrorText(error, 'admin permission required') || hasErrorText(error, 'permission denied');
}

function isMissingSetPortfolioImageFunction(error: DatabaseErrorLike) {
  return hasErrorText(error, 'set_portfolio_image_override');
}

function isMissingHardDeleteMediaFunction(error: DatabaseErrorLike) {
  return hasErrorText(error, 'hard_delete_media_asset') || hasErrorText(error, 'schema cache');
}

function hasErrorText(error: DatabaseErrorLike, text: string) {
  return (error.message ?? '').includes(text);
}
