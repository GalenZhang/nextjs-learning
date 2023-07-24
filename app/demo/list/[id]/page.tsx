import React from 'react'

export async function generateMetadata({ params, searchParams }: any) {
    console.log('generateMetadata', params, searchParams)

    return {
        title: '测试页面',
        description: '页面SEO信息'
    }
}

function DetailPage({ params, searchParams }: any) {
    console.log('server params', params, searchParams)
    return (
        <div>DetailPage--{params.id}</div>
    )
}

export default DetailPage