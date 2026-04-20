"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { Icons } from "@/config/icons";

export function Modal({ isOpen, onClose, title, children, className }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div 
        className={cn(
          "relative z-50 w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg transition-all duration-150",
          className
        )}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Icons.close className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
