'use client'

import { Ticket, useAuthStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { v4 as randomUUID } from 'uuid'
import { TicketQRDialog } from '@/components/TicketQRDialog'


export default function ProfilePage() {
  const { isLoggedIn, tickets } = useAuthStore()
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isQROpen, setIsQROpen] = useState(false)


  if (!isLoggedIn) {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to view your profile and tickets.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="max-w-4xl mx-auto mt-20">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
          {tickets.length === 0 ? (
            <p>You haven't purchased any tickets yet.</p>
          ) : (
            <ul className="space-y-4">
              {tickets.map((ticket) => (
                <li key={ticket.id} className="border p-4 rounded-md">
                  <h3 className="font-semibold">{ticket.eventName}</h3>
                  <p>Purchase Date: {new Date(ticket.purchaseDate).toLocaleDateString()}</p>
                  <div className='flex'>

                    <Link href={`/events/${ticket.eventId}`}>
                      <Button variant="outline" className="mt-2">View Event</Button>
                    </Link>
                    {/* <Button variant={'outline'} className="mt-2 ml-2">Show QR</Button> */}
                    <Button 
                      variant={'outline'} 
                      className="mt-2 ml-2"
                      onClick={() => {
                        setSelectedTicket(ticket)
                        setIsQROpen(true)
                      }}
                    >
                      Show QR
                    </Button>
                    {/* wallet add, nft add, event id, did */}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <TicketQRDialog 
        isOpen={isQROpen}
        onOpenChange={setIsQROpen}
        ticket={selectedTicket}
      />
    </>
  )
}

