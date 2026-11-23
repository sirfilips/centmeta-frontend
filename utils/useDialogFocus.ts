"use client";

import { RefObject, useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) =>
      el.getClientRects().length > 0 &&
      !el.hasAttribute("inert") &&
      !el.closest("[inert]") &&
      window.getComputedStyle(el).visibility !== "hidden",
  );
}

const openDialogStack: symbol[] = [];
let savedBodyOverflow: string | null = null;

/**
 * Gestisce focus iniziale, focus trap (Tab/Shift+Tab), chiusura con Escape,
 * blocco dello scroll del body e ripristino del focus alla chiusura del dialog.
 * Supporta più dialog sovrapposti tramite stack globale (agisce solo sul dialog in cima).
 */
export function useDialogFocus<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose: () => void,
  containerRef: RefObject<T | null>,
): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const dialogId = Symbol("dialog");
    const prevFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (openDialogStack.length === 0) {
      savedBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    openDialogStack.push(dialogId);

    const container = containerRef.current;
    if (container) {
      const focusables = getFocusableElements(container);
      const initialTarget = focusables[0] ?? container;
      if (initialTarget && typeof initialTarget.focus === "function") {
        initialTarget.focus({ preventScroll: true });
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (openDialogStack[openDialogStack.length - 1] !== dialogId) {
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      const panel = containerRef.current;
      if (!panel) return;
      const focusables = getFocusableElements(panel);
      if (focusables.length === 0) {
        e.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (!active || !panel.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      const idx = openDialogStack.lastIndexOf(dialogId);
      if (idx !== -1) {
        openDialogStack.splice(idx, 1);
      }
      if (openDialogStack.length === 0) {
        document.body.style.overflow = savedBodyOverflow ?? "";
        savedBodyOverflow = null;
      }
      document.removeEventListener("keydown", handleKeyDown);
      if (prevFocused && prevFocused.isConnected && typeof prevFocused.focus === "function") {
        prevFocused.focus({ preventScroll: true });
      }
    };
  }, [isOpen, containerRef]);
}
