'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export function DatePicker({
  setFunction
}: {
  setFunction: (date: Date | any) => void
}) {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[220px] justify-start text-left font-normal bg-background/15',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='h-4 w-4' />
          {date ? (
            <span className='text-yellow'>{format(date, 'PPP')}</span>
          ) : (
            <span className='text-foreground'>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0 bg-greydark'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={(e) => {
            setDate(e)
            setFunction(e)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
