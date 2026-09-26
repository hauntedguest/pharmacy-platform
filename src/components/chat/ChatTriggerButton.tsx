"use client";

import React from "react";
import { Bot, GripVertical } from "lucide-react";

interface ChatTriggerButtonProps {
  onPointerDown: (e: React.PointerEvent) => void;
  onClick: () => void;
  isDragging: boolean;
}

export function ChatTriggerButton({
  onPointerDown,
  onClick,
  isDragging,
}: ChatTriggerButtonProps) {
  return (
    <div
      onPointerDown={onPointerDown}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white pl-3 pr-5 py-3 rounded-full shadow-2xl transition-all duration-200 border border-white/20 select-none cursor-grab active:cursor-grabbing touch-none ${
        isDragging
          ? "scale-105 shadow-blue-500/50 ring-4 ring-teal-400/40 opacity-95"
          : "hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
      }`}
      aria-label="Open MediCare AI Assistant (Drag to reposition)"
      title="Click to chat • Drag anywhere to reposition"
    >
      {/* Draggable Grip Indicator */}
      <div
        className="text-white/60 group-hover:text-white/90 transition-colors cursor-grab active:cursor-grabbing p-0.5"
        aria-hidden="true"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Pulsing Status Dot */}
      <span className="relative flex h-3 w-3 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
      </span>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <div className="text-xs font-extrabold tracking-wide uppercase flex items-center gap-1.5">
            <span>MediCare AI</span>
            <span className="text-[9px] bg-teal-400/30 text-teal-200 px-1.5 py-0.2 rounded-full font-mono">
              AUTONOMOUS
            </span>
          </div>
          <p className="text-[10px] text-blue-100 font-medium">
            Clinical Safety & Self-Decision Agent
          </p>
        </div>
      </div>
    </div>
  );
}
