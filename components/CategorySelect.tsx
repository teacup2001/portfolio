'use client'

import { useState, useEffect } from 'react'

interface CategorySelectProps {
  categories: Array<{
    id: string
    name: string
    parentId: string | null
  }>
  defaultValue?: string // current child category ID
}

export default function CategorySelect({ categories, defaultValue }: CategorySelectProps) {
  const [selectedParent, setSelectedParent] = useState('')
  const [selectedChild, setSelectedChild] = useState('')

  // Initialize from defaultValue (edit mode)
  useEffect(() => {
    if (defaultValue) {
      const child = categories.find(c => c.id === defaultValue)
      if (child && child.parentId) {
        setSelectedParent(child.parentId)
        setSelectedChild(defaultValue)
      }
    }
  }, [defaultValue, categories])

  const parentCategories = categories.filter(c => !c.parentId)
  const childCategories = categories.filter(c => c.parentId === selectedParent)

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedParent(e.target.value)
    setSelectedChild('')
  }

  return (
    <>
      <div>
        <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">
          大类 *
        </label>
        <select
          value={selectedParent}
          onChange={handleParentChange}
          required
          className="w-full px-3 py-2.5 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors"
        >
          <option value="">选择大类</option>
          {parentCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-[#9ca3af] mb-1.5 tracking-wide">
          小类 *
        </label>
        <select
          name="categoryId"
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
          required
          disabled={!selectedParent}
          className="w-full px-3 py-2.5 text-sm border border-[#e5e5e5] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors disabled:bg-[#f5f5f5] disabled:text-[#ccc]"
        >
          <option value="">{selectedParent ? '选择小类' : '请先选择大类'}</option>
          {childCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </>
  )
}
