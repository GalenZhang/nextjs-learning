import React from 'react'
import AntdContainer from './_components/AntdContainer'

function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AntdContainer>{children}</AntdContainer>
    )
}

export default AdminLayout