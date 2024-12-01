'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, MapPin } from 'lucide-react'
import Link from 'next/link'

interface EventCardProps {
  id: number
  name: string
  date: string
  image: string
}

export default function EventCard({ id, name, date, image }: EventCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-48">
            <Image 
              src={image} 
              alt={name} 
              layout="fill"
              objectFit="cover"
              // height={200}
              // width={300}
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{name}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <CalendarDays className="h-4 w-4 mr-2" />
              <p>{new Date(date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <p>Venue Name</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/events/${id}`} className="w-full">
            <Button className="w-full">Book Now</Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

