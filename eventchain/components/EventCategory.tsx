'use client'

import { motion } from 'framer-motion'
import EventCard from "@/components/EventCard"

interface Event {
  id: number
  name: string
  date: string
  category: string
  image: string
}

interface EventCategoryProps {
  category: string
  events: Event[]
}

export default function EventCategory({ category, events }: EventCategoryProps) {
  return (
    <motion.section 
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{category}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <EventCard 
              id={event.id}
              name={event.name}
              date={event.date}
              image={event.image}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

