'use client'
import { Card } from 'antd'

function PageContainer({
    children, title
}: {
    children: React.ReactNode, title: string
}) {
    return (
        <Card title={title}>{children}</Card>
    )
}

export default PageContainer