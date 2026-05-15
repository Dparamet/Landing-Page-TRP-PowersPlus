'use client';

import { useState } from 'react';

type ConfirmResetButtonProps = {
  title: string;
  description: string;
  buttonLabel?: string;
  confirmButtonLabel?: string;
  confirmText?: string;
  variant?: 'reset' | 'danger';
  disabled?: boolean;
  onConfirm: () => Promise<void> | void;
};

export default function ConfirmResetButton({
  title,
  description,
  buttonLabel = 'ตั้งค่าเริ่มต้น',
  confirmButtonLabel = 'ยืนยันตั้งค่าเริ่มต้น',
  confirmText = 'ตั้งค่าเริ่มต้น',
  variant = 'reset',
  disabled = false,
  onConfirm,
}: ConfirmResetButtonProps) {
  const [open, setOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [saving, setSaving] = useState(false);
  const canConfirm = typedText.trim() === confirmText && !saving;
  const buttonClass =
    variant === 'danger'
      ? 'rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60'
      : 'rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60';
  const confirmClass =
    variant === 'danger'
      ? 'rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60'
      : 'rounded-lg bg-[#0f2a5f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#061a3d] disabled:cursor-not-allowed disabled:opacity-60';

  async function confirmReset() {
    if (!canConfirm) {
      return;
    }

    setSaving(true);
    await onConfirm();
    setSaving(false);
    setTypedText('');
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className={buttonClass}
      >
        {buttonLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="reset-confirm-title">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl">
            <h2 id="reset-confirm-title" className="text-lg font-black text-[#0f2a5f]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            <label className="mt-4 block text-sm font-bold text-slate-800">
              พิมพ์ `{confirmText}` เพื่อยืนยัน
              <input
                value={typedText}
                onChange={(event) => setTypedText(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#f08a24] focus:ring-2 focus:ring-[#f08a24]/20"
                autoFocus
              />
            </label>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setTypedText('');
                }}
                disabled={saving}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-400"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => void confirmReset()}
                disabled={!canConfirm}
                className={confirmClass}
              >
                {saving ? 'กำลังตั้งค่า...' : confirmButtonLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
