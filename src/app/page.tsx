import React from 'react'
import WorkspaceOverview from '@/components/WorkspaceOverview'
import { Iworkspace } from "@/types"

const workspaceDatas:Iworkspace[]=[
  {id:1,title:"Project management",date:"Mon May 02 2022"},
  {id:2,title:"Digital marketing course timeline",date:"Mon May 02 2022"},
  {id:3,title:"Business planning",date:"Mon May 02 2022"}
]

const page = () => {
  return (
    <main className='p-8'>
      <h1 className="text-lg font-medium flex items-center space-x-4">Workspace</h1>
      <WorkspaceOverview workspaceDatas={workspaceDatas} />
    </main>
  )
}

export default page
