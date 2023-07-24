import React from 'react'

function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='admin-demo'>
            <h2>admin Layout</h2>
            <hr />
            {children}
        </div>
    )
}

export default AdminLayout