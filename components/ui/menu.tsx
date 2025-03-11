import React from 'react'

interface MenuProps {
  x: number
  y: number
  items: Array<{
    label: string
    onClick: () => void
  }>
}

export function Menu({ x, y, items }: MenuProps) {
  return (
    <div
      className="absolute bg-white shadow-md rounded-md overflow-hidden"
      style={{ left: x, top: y }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          onClick={item.onClick}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

