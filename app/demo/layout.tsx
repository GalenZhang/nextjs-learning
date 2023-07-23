import React from 'react'

function DemoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='demo'>
            <h2>Demo Layout</h2>
            <hr />
            {children}
        </div>
    )
}

export default DemoLayout