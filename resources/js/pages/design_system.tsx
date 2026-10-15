import React from 'react'
import { DesignSystemShowcase } from '../components/DesignSystemShowcase'
import { Head } from '@inertiajs/react'

export default function DesignSystemPage() {
  return (
    <>
      <Head title="Design System & Tokens" />
      <DesignSystemShowcase />
    </>
  )
}
