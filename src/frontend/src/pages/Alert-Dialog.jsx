"use client";

import * as React from "react";
import { createContext, useContext, useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import Button from "../Button";

const AlertDialogContext = createContext();

function cn(...classes) {
  return clsx(classes);
}

function useAlertDialog() {
  const context = useContext(AlertDialogContext);
  if (!context)
    throw new Error("AlertDialog components must be inside <AlertDialog>");
  return context;
}

function AlertDialog({ children, open, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  return (
    <AlertDialogContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
      <div data-slot="alert-dialog">{children}</div>
    </AlertDialogContext.Provider>
  );
}

function AlertDialogTrigger({ asChild, children }) {
  const { setOpen } = useContext(AlertDialogContext);
  if (asChild) {
    return React.cloneElement(children, {
      onClick: () => setOpen(true),
    });
  }
  return <Button onClick={() => setOpen(true)}>{children}</Button>;
}

function AlertDialogOverlay({ className, ...props }) {
  return (
    <div
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({ children, className }) {
  const { open, setOpen } = useAlertDialog();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* <AlertDialogOverlay/> */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {children}
        <Button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 p-1 transition-colors text-gray-500 hover:text-gray-800"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

function AlertDialogHeader({ className, ...props }) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-2 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }) {
  return (
    <div
      className={clsx(
        "mt-4 flex flex-col-reverse gap-2 sm:flex-row sm justify-between",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({ children, className, ...props }) {
  return (
    <h2 className={clsx("text-lg font-semibold", className)} {...props}>
      {children}
    </h2>
  );
}

function AlertDialogDescription({ className, ...props }) {
  return <p className={clsx("text-sm text-gray-600", className)} {...props} />;
}

function AlertDialogAction({ children, onClick, ...props }) {
  const { setOpen } = useAlertDialog();
  return (
    <Button
      onClick={() => {
        if (onClick) onClick();
        setOpen(false);
      }}
      size="md"
      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
    >
      {children}
    </Button>
  );
}

function AlertDialogCancel({ children, ...props }) {
  const { setOpen } = useContext(AlertDialogContext);
  return (
    <Button
      variant="outline"
      size="md"
      className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
      onClick={() => setOpen(false)}
    >
      {children}
    </Button>
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogOverlay,
};