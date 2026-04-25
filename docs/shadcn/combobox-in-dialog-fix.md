# Combobox in Dialog Pointer Conflict

## The Problem
When using the Base UI `Combobox` (Portaled) inside a Radix UI `Dialog` (Modal), the mouse cannot interact with the dropdown list. You can see the list, but you cannot hover or click items.

### Why this happens
1. **Radix Dialog Mandate:** In modal mode, Radix blocks all pointer events outside of the `DialogContent` container to ensure the user only interacts with the modal.
2. **Portal Rendering:** The Combobox dropdown renders in a Portal at the end of the `<body>` tag. Since this is outside the `DialogContent`, Radix's global block prevents mouse interaction.

## The Solution
Add `pointer-events-auto` to the `ComboboxPrimitive.Positioner` (or the popup container). This explicitly re-enables mouse interactions for the portaled dropdown, bypassing the modal's block.

```tsx
// packages/ui/src/components/combobox.tsx

function ComboboxContent({ ...props }) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        className="isolate z-50 pointer-events-auto" // <--- CRITICAL FIX
      >
        <ComboboxPrimitive.Popup ... />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}
```

## Note on "Modal={false}"
Avoid setting `modal={false}` on the `Dialog` as a fix, as this disables the background dimming and the "lock" behavior expected of standard modals. Use the CSS fix above instead to maintain accessible modal behavior.
