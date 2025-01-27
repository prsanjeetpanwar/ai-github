import { db } from '@/server/db'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: { projectId: string }
}

const JoinHandler = async (props: Props) => {
    const { projectId } = props.params
    const { userId } = await auth()
  
    if (!userId) return redirect('/sign-in')
  
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
  
    // Ensure user exists in your database
    const existingUser = await db.user.upsert({
      where: { emailAddress: user.emailAddresses[0]?.emailAddress || '' },
      update: {},
      create: {
        id: userId,
        emailAddress: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl
      }
    })
  
    const project = await db.project.findUnique({
      where: { id: projectId }
    })
  
    if (!project) return redirect('/dashboard')
  
    try {
      // Check if user is already in project
      const existingMembership = await db.userToProject.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId
          }
        }
      })
  
      if (!existingMembership) {
        await db.userToProject.create({
          data: {
            userId,
            projectId
          }
        })
      }
    } catch (error) {
      console.error('Error adding user to project', error)
      return redirect('/dashboard')
    }
  
    return redirect('/dashboard')
  }

export default JoinHandler