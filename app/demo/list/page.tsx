import { Metadata } from 'next'
import React from 'react'
import List from './_components/List'

export const metadata: Metadata = {
  title: "这是一个列表页",
  description: "设置SEO信息",
  keywords: "nextjs,react"
}

// async function getData() {
//   const res = await fetch('http://localhost:3000/api/goods')
//   if (!res.ok) {
//     throw new Error('Failed to fetch data')
//   }

//   return res.json()
// }

// type Item = {
//   id: number,
//   name: String
// }

// async function ListPage() {
//   const data = await getData()
//   console.log('getData for goods: ', data)
//   return (
//     <div>
//       <ul>
//         {
//           data.data.map((item: Item) => (
//             <li key={item.id}>{item.name}</li>
//           ))
//         }
//       </ul>
//     </div>
//   )
// }

async function ListPage() {
  return (
    <div className='list-page'>
      ListPage
      <List />
    </div>
  )
}

export default ListPage