"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2 } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className="bg-green-50 border-green-200"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="grid gap-1">
                {title && <ToastTitle className="text-green-800">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-green-600">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className="text-green-500 hover:text-green-700" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}