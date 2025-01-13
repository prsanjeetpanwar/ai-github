"use client"
import React from 'react'
import { useUser } from '@clerk/nextjs'
import UseProject from '@/hooks/use-project'
import { ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import CommitLog from './commit-log'

const dashboardPage = () => {
    const { user } = useUser()
    const {project,projects,projectId}=UseProject()
    return (
        <div className='p-4'>
          {projectId}
        <div className='flex items-center justify-between flex-wrap gap-y-4 '>
          <div className='w-fit rounded-md bg-primary px-4 py-2 '>
            <div className="flex items-center ">
            <Github className='text-white size-5'/>
            <div className='ml-2'>
                <p className='text-sm font-medium text-white '>
                  This project link to {" "}
                  <Link href={project?.githubUrl ?? ""} className='inline-flex items-center text-white/80 hover:underline'>
                  {project?.githubUrl}
                  <ExternalLink className='ml-1 size-4'/>
                  </Link>
                </p>
            </div>
            </div>
           
          </div>

          <div className='h-4'></div>
          <div className='flex items-center gap-4'>
        {/* team memebers */}
        Team Member
        Invite BUtton
        Achrive Button 
          </div>
        </div>
        <div className='mt-4'>
            <div className='grid grid-cols-1  gap-4 md:grid-cols-5'>
                Ask QuastionCard
                Meeting Card
            </div>
        </div>

        <div className="mt-5"></div>
       <CommitLog/>
        </div>
    )
}

export default dashboardPage
