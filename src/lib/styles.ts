/**
 * Shared Tailwind class lists for patterns used by more than one element type
 * (e.g. an <input> and a <select>), where a single wrapper component doesn't fit.
 */

/** Rounded "pill" form field: surface, border ring, focus ring and dark-mode pairs. */
export const fieldClass =
  'rounded-full border-0 bg-white py-3 text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none ' +
  'focus:ring-2 focus:ring-red-600 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:focus:ring-red-400'
