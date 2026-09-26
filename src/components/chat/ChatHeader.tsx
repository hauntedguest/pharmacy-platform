"use client";

import React from "react";
import {
  Bot,
  Activity,
  RotateCcw,
  Minimize2,
  Maximize2,
  X,
  GripHorizontal,
} from "lucide-react";

interface ChatHeaderProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onResetChat: () => void;
  onClose: () => void;
  onHeaderPointerDown?: (e: React.PointerEvent) => void;
}

export function ChatHeader({
  isExpanded,
  onToggleExpand,
  onResetChat,
  onClose,
  onHeaderPointerDown,
}: ChatHeaderProps) {
  return (
    <div
      onPointerDown={onHeaderPointerDown}
      className="px-5 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-white/10 relative overflow-hidden select-none cursor-default"
    >
      {/* Ambient Background Glow */}
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-teal-500/20 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 p-0.5 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-white tracking-wide">
              MediCare Clinical AI
            </h3>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded-full">
              Multi-Agent
            </span>
          </div>
          <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-teal-400" />
            Sentiment & Self-Decision Engine
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 relative z-10">
        {onHeaderPointerDown && (
          <div
            className="p-1.5 text-slate-400 hover:text-slate-200 cursor-grab active:cursor-grabbing rounded-xl transition-colors hidden sm:inline-flex"
            title="Drag window"
          >
            <GripHorizontal className="w-4 h-4" />
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onResetChat();
          }}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          title="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
