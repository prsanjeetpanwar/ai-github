import { SidebarProvider } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AppSidebar from '@/app/(protected)/app-sidebar'

const SideBarLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <main className=' w-full m-2'>
                <div className='flex items-center gap-2
         border-sidebar-border bg-sidebar border shadow rounded-md md:p-4 px-4'>
                    {/* searchbar */}
                    <div className="m-auto">

                    </div>
                    <UserButton />
                </div>
                <div className="h-4"></div>

                <div className='border-sidebar-border bg-sidebar border
                shadow  rounded-md overflow-y-scroll h-[calc(100vh-0rem)]
                '>
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}

export default SideBarLayout
