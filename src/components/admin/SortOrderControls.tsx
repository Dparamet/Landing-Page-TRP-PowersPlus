'use client';

type SortOrderControlsProps = {
  canMoveUp: boolean;
  canMoveDown: boolean;
  disabled?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export default function SortOrderControls({
  canMoveUp,
  canMoveDown,
  disabled = false,
  onMoveUp,
  onMoveDown,
}: SortOrderControlsProps) {
  const isMoveUpDisabled = disabled || !canMoveUp;
  const isMoveDownDisabled = disabled || !canMoveDown;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-black text-[#12345f]">ลำดับการแสดงผล</p>
      <p className="mt-1 text-xs text-slate-500">เลือกรายการด้านซ้าย แล้วกดขยับตำแหน่ง</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isMoveUpDisabled}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-[#12345f] transition hover:border-[#f08a24] hover:text-[#d66d0c] disabled:cursor-not-allowed disabled:opacity-50"
        >
          ขยับขึ้น
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isMoveDownDisabled}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-[#12345f] transition hover:border-[#f08a24] hover:text-[#d66d0c] disabled:cursor-not-allowed disabled:opacity-50"
        >
          ขยับลง
        </button>
      </div>
    </div>
  );
}
