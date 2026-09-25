import { useEffect, useRef, useState } from 'react'
import { FiChevronDown, FiCheck, FiX, FiSearch } from 'react-icons/fi'

export default function FilterDropDown({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Избери...',
  multiple = false,
  searchable = false,
  clearable = true,
  align = 'left',
  widthClass = 'w-full',
  disabled = false,
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const selectedValues = multiple ? (Array.isArray(value) ? value : []) : value

  const isSelected = (optValue) => (multiple ? selectedValues.includes(optValue) : selectedValues === optValue)

  const filteredOptions =
    searchable && query.trim() ? options.filter((opt) => opt.label.toLowerCase().includes(query.trim().toLowerCase())) : options

  const handleSelect = (optValue) => {
    if (multiple) {
      const next = isSelected(optValue) ? selectedValues.filter((v) => v !== optValue) : [...selectedValues, optValue]
      onChange?.(next)
    } else {
      onChange?.(optValue)
      setOpen(false)
    }
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange?.(multiple ? [] : undefined)
  }

  const hasValue = multiple ? selectedValues.length > 0 : value !== undefined && value !== null && value !== ''

  const displayText = () => {
    if (multiple) {
      if (selectedValues.length === 0) return placeholder
      if (selectedValues.length === 1) return options.find((o) => o.value === selectedValues[0])?.label ?? placeholder
      return `${selectedValues.length} избрани`
    }
    return options.find((o) => o.value === value)?.label ?? placeholder
  }

  return (
    <div ref={rootRef} className={`relative ${widthClass}`}>
      {label && <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#102f20]/45">{label}</label>}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
          disabled
            ? 'cursor-not-allowed border-[#102f20]/10 bg-[#fafcf9] text-[#102f20]/30'
            : open
              ? 'border-[#1e4d2b] text-[#102f20]'
              : 'border-[#102f20]/10 text-[#102f20]/80 hover:border-[#1e4d2b]/40'
        }`}
      >
        <span className={`truncate ${hasValue ? 'text-[#102f20]' : 'text-[#102f20]/40'}`}>{displayText()}</span>
        <span className="flex shrink-0 items-center gap-1">
          {clearable && hasValue && !disabled && (
            <span
              role="button"
              aria-label="Изчисти"
              onClick={handleClear}
              className="rounded-full p-0.5 text-[#102f20]/40 hover:bg-[#eef4ec] hover:text-[#102f20]"
            >
              <FiX size={13} />
            </span>
          )}
          <FiChevronDown size={15} className={`text-[#102f20]/40 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && !disabled && (
        <div
          className={`absolute z-20 mt-2 max-h-64 w-full min-w-[190px] overflow-y-auto rounded-xl border border-[#102f20]/8 bg-white p-1.5 shadow-[0_10px_30px_rgba(15,46,31,0.12)] ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {searchable && (
            <div className="relative mb-1.5">
              <FiSearch size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#102f20]/30" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Търсене..."
                className="w-full rounded-lg bg-[#fafcf9] py-2 pl-7 pr-2 text-xs text-[#102f20] outline-none placeholder:text-[#102f20]/30"
              />
            </div>
          )}

          {filteredOptions.length === 0 && <p className="px-3 py-2 text-xs text-[#102f20]/40">Няма съвпадения.</p>}

          {filteredOptions.map((opt) => {
            const selected = isSelected(opt.value)
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selected ? 'bg-[#eef4ec] font-semibold text-[#1e4d2b]' : 'text-[#102f20]/75 hover:bg-[#fafcf9]'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {selected && <FiCheck size={14} className="shrink-0 text-[#1e4d2b]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}