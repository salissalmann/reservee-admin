'use client';
import React from 'react'
import { Nunito } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function Branding() {
  return (
    <div className={`flex items-center gap-1 ${nunito.className}`}>
      <div className='text-2xl dark:text-white text-tertiary font-bold'>get</div>
      <div className='text-2xl text-primary font-bold'>&gt;</div>
      <div className='text-2xl dark:text-white text-tertiary font-bold'>in</div>
    </div>
  )
}
