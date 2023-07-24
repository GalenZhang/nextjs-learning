
import { prisma } from '@/app/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const data = await prisma.goods.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
  return NextResponse.json({
    success: true,
    errorMessage: '获取数据成功',
    data
    // data: [{
    //   id: 1,
    //   name: '张三'
    // }, {
    //   id: 2,
    //   name: "李四"
    // }]
  })
}

export const POST = async (req: NextRequest) => {
  const data = await req.json()
  await prisma.goods.create({
    data
  })
  return NextResponse.json({
    success: true,
    errorMessage: '创建成功',
    data
  })
}