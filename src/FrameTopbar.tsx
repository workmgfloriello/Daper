import { Minus, Maximize2, X } from "lucide-react";

export default function FrameTopbar() {
  const handleMinimize = () =>
    (
      window.electronAPI as typeof window.electronAPI & {
        minimize?: () => void;
      }
    )?.minimize?.();

  const handleMaximize = () =>
    (
      window.electronAPI as typeof window.electronAPI & {
        maximize?: () => void;
      }
    )?.maximize?.();

  const handleClose = () =>
    (
      window.electronAPI as typeof window.electronAPI & {
        close?: () => void;
      }
    )?.close?.();

  return (
    <div
      className="
        flex
        h-8
        w-full
        shrink-0
        items-center
        justify-between
        bg-indigo-950
        text-gray-100
        select-none
      "
    >
      {/* Area trascinabile */}
      <div
        className="flex h-full w-full items-center justify-between"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        {/* Logo / Titolo */}
        <div className="flex items-center pl-3">
          <span className="text-xs tracking-wide font-bold text-gray-100">
            Daper
          </span>
        </div>

        {/* Controlli finestra */}
        <div
          className="flex h-full"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          {/* Minimizza */}
          <button
            type="button"
            onClick={handleMinimize}
            aria-label="Minimizza"
            className="
              flex
              h-full
              w-11
              items-center
              justify-center
               text-gray-100
              transition-colors
              duration-150
              hover:bg-gray-300
              hover:text-gray-700
            "
          >
            <Minus size={14} strokeWidth={1.8} />
          </button>

          {/* Massimizza */}
          <button
            type="button"
            onClick={handleMaximize}
            aria-label="Massimizza"
            className="
              flex
              h-full
              w-11
              items-center
              justify-center
               text-gray-100
              transition-colors
              duration-150
              hover:bg-gray-300
              hover:text-gray-700
            "
          >
            <Maximize2 size={13} strokeWidth={1.8} />
          </button>

          {/* Chiudi */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Chiudi"
            className="
              flex
              h-full
              w-11
              items-center
              justify-center
               text-gray-100
              transition-colors
              duration-150
              hover:bg-red-500
              hover:text-red-50
            "
          >
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
