"use client"

import { Button } from '@/components/ui/button'
import UseProject from '@/hooks/use-project'
import useRefetch from '@/hooks/use-refatch'

import { api } from '@/trpc/react'
import React from 'react'
import { toast } from 'sonner'

const ArchiveButton = () => {
    const archiveProject = api.project.archiveProject.useMutation()
    const { projectId } = UseProject()
    const refetch = useRefetch()

    const handleArchive = () => {
        toast.warning('Are you sure you want to archive this project?', {
            description: 'This action cannot be undone.',
            cancel: {
                label: 'Cancel',
            },
            action: {
                label: 'Confirm Archive',
                onClick: () => {
                    archiveProject.mutate({projectId}, {
                        onSuccess: () => {
                            toast.success('Project archived successfully')
                            refetch()
                        },
                        onError: () => {
                            toast.error('Failed to archive project')     
                        }
                    })
                }
            }
        })
    }

    return (
        <Button  size={'sm'} variant='destructive'
            disabled={archiveProject.isPending} 
            onClick={handleArchive}
        >
            Archive
        </Button>
    )
}

export default ArchiveButton