import React from 'react'

function ListLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='list'>
            <h2>List Layout</h2>
            <hr />
            {children}
        </div>
    )
}

export default ListLayout