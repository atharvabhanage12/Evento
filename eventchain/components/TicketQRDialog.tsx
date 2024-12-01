import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QRCodeSVG } from 'qrcode.react'
import { v4 as randomUUID } from 'uuid'
import { Ticket, useAuthStore } from "@/lib/store"
import { useEffect, useState } from "react"

interface TicketQRDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    ticket: Ticket | null
}

export function TicketQRDialog({ isOpen, onOpenChange, ticket }: TicketQRDialogProps) {
    const [did, setDid] = useState<string>(randomUUID().slice(0, 8))
    const { userId, walletAddress } = useAuthStore()

    useEffect(() => {
        let timer: NodeJS.Timeout

        if (isOpen) {
            timer = setInterval(() => {
                setDid(randomUUID().slice(0, 8))
            }, 1000)
        }

        return () => {
            if (timer) {
                clearInterval(timer)
            }
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ticket QR Code</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center p-6">
                    {ticket && (
                        <QRCodeSVG
                            value={JSON.stringify({
                                ticketId: ticket.id,
                                eventId: ticket.eventId,
                                eventName: ticket.eventName,
                                purchaseDate: ticket.purchaseDate,
                                nftId: ticket.nftId,
                                did: did,
                                userId,
                                walletAddress
                            })}
                            size={256}
                            level="H"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}