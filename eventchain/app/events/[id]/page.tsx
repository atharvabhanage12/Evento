'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Ticket, useAuthStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { v4 as randomUUID } from 'uuid'


export default function EventPage() {
  const { id } = useParams()
  const { isLoggedIn, addTicket } = useAuthStore()
  const [isPurchasing, setIsPurchasing] = useState(false)

  const handlePurchase = () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase tickets.",
        variant: "destructive",
      })
      return
    }

    setIsPurchasing(true)
    // Simulate API call
    setTimeout(() => {
      setIsPurchasing(false)
      const newTicket: Ticket = {
        id: Date.now(),
        eventId: Number(id),
        eventName: `Event ${id}`, // In a real app, you'd fetch the actual event name
        purchaseDate: new Date().toISOString(),
        nftId: randomUUID().slice(0, 8),
      }
      addTicket(newTicket)
      toast({
        title: "Purchase successful",
        description: "Your ticket has been booked successfully!",
      })
    }, 2000)
  }

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle>Event Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4">Event ID: {id}</p>
        <p className="text-sm text-gray-500 mb-4">
          {isLoggedIn 
            ? "You're logged in and ready to purchase!" 
            : "Please log in to purchase tickets."}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handlePurchase}
          disabled={!isLoggedIn || isPurchasing}
        >
          {isPurchasing ? "Processing..." : "Buy Ticket"}
        </Button>
      </CardFooter>
    </Card>
  )
}

