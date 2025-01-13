import { api } from '@/trpc/react'
import React, { useState } from 'react'
import {useLocalStorage} from 'usehooks-ts'

const UseProject = () => {
  const {data:projects}=api.project.getProject.useQuery()
  const [projectId,setProjectId]=useLocalStorage(`dino-pro`,'')
  const project=projects?.find(project=>project.id===projectId)
  return {
    projects,
    project,
    setProjectId,
    projectId
  }
}

export default UseProject


