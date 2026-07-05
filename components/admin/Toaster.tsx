"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastFn = (msg: string, isError?: boolean) => void;

const ToastContext = createContext<ToastFn>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ msg: "", err: false, show: false });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback<ToastFn>((msg, isError = false) => {
    setState({ msg, err: isError, show: true });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setState((s) => ({ ...s, show: false })),
      3400
    );
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className={`toast${state.show ? " show" : ""}${state.err ? " err" : ""}`}
        role="status"
        aria-live="polite"
      >
        {state.msg}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
