import React from 'react'
import AntdAdmin from '../_components/AntdAdmin'

function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AntdAdmin>
            {children}
        </AntdAdmin>
    )
}

export default AdminLayout