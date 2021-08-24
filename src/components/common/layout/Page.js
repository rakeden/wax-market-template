import React from 'react'
import cn from 'classnames'

export default function Page({className, children, onScroll, id}) {

  return (
    <div
      className={cn(
        'w-full overflow-x-hidden c-h-page-2 lg:c-h-page-1',
        'm-auto ml-0',
        'z-10',
        'transition transform duration-200',
        className
      )}
      onScroll={onScroll}
      id={id}
    >
        {children}
    </div>
  )
}