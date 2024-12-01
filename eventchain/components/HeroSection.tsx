'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('https://retail-mashup.com/wp-content/uploads/2023/09/taylor-swift-the-eras-tour-conce.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(50%)'
        }}
      />
      <motion.div 
        className="z-10 text-center text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Evento</h1>
        <p className="text-xl md:text-2xl mb-8">Discover and book amazing events near you</p>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          <CalendarDays className="mr-2 h-5 w-5" /> Explore Events
        </Button>
      </motion.div>
    </section>
  )
}

