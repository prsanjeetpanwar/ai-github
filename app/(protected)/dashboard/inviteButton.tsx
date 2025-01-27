"use client"
import React, { useState } from 'react'
import { Dialog, DialogHeader, DialogTitle,DialogContent } from '@/components/ui/dialog'
import UseProject from '@/hooks/use-project'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'



const InviteButton = () => {
  const { projectId } = UseProject()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (projectId) {
      const inviteLink = `${window.location.origin}/join/${projectId}`
      navigator.clipboard.writeText(inviteLink)
        .then(() => {
          toast.success("Invite link copied to clipboard")
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch(err => {
          toast.error("Failed to copy link")
          console.error(err)
        })
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-gray-500'>
            Ask them to copy and post this link
          </p>
          <input 
            readOnly
            className={`mt-4 w-full ${copied ? 'bg-green-50' : ''}`}
            onClick={handleCopy}
            value={`${window.location.origin}/join/${projectId}`}
          />
        </DialogContent>
      </Dialog>
      <Button size="sm" onClick={() => setOpen(true)}>Invite Member</Button>
    </>
  )
}

export default InviteButton
