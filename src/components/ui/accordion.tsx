"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  value: string | string[]
  onValueChange: (value: string) => void
  type: "single" | "multiple"
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

interface AccordionProps {
  type?: "single" | "multiple"
  collapsible?: boolean
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: React.ReactNode
  className?: string
}

export function Accordion({
  type = "single",
  collapsible = true,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  children,
  className,
}: AccordionProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | string[]>(
    type === "single" ? "" : []
  )

  const value = controlledValue ?? uncontrolledValue
  const onValueChange = controlledOnValueChange ?? setUncontrolledValue

  const handleValueChange = React.useCallback(
    (itemValue: string) => {
      if (type === "single") {
        onValueChange(value === itemValue && collapsible ? "" : itemValue)
      } else {
        const currentValue = Array.isArray(value) ? value : []
        const newValue = currentValue.includes(itemValue)
          ? currentValue.filter((v) => v !== itemValue)
          : [...currentValue, itemValue]
        onValueChange(newValue)
      }
    },
    [value, onValueChange, type, collapsible]
  )

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange, type }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <div className={cn("border rounded-lg", className)} data-value={value}>
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionTrigger must be used within Accordion")

  const item = React.useContext(ItemContext)
  if (!item) throw new Error("AccordionTrigger must be used within AccordionItem")

  const isOpen = Array.isArray(context.value)
    ? context.value.includes(item.value)
    : context.value === item.value

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(item.value)}
      className={cn(
        "flex w-full items-center justify-between p-4 text-left font-medium transition-all hover:bg-muted/50 [&[data-state=open]>svg]:rotate-180",
        className
      )}
      data-state={isOpen ? "open" : "closed"}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionContent must be used within Accordion")

  const item = React.useContext(ItemContext)
  if (!item) throw new Error("AccordionContent must be used within AccordionItem")

  const isOpen = Array.isArray(context.value)
    ? context.value.includes(item.value)
    : context.value === item.value

  return (
    <div
      className={cn(
        "overflow-hidden text-sm transition-all",
        isOpen ? "animate-accordion-down" : "animate-accordion-up",
        className
      )}
      data-state={isOpen ? "open" : "closed"}
    >
      <div className="p-4 pt-0">{children}</div>
    </div>
  )
}

const ItemContext = React.createContext<{ value: string } | null>(null)

// Wrap AccordionItem to provide context
const AccordionItemWithContext = ({ value, children, className }: AccordionItemProps) => {
  return (
    <ItemContext.Provider value={{ value }}>
      <AccordionItem value={value} className={className}>
        {children}
      </AccordionItem>
    </ItemContext.Provider>
  )
}

// Export the wrapped version
export { AccordionItemWithContext as AccordionItem }

