import { prisma } from '@/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    const data = await prisma.article.findMany({
        where: {},
        orderBy: {
            createdAt: 'desc'
        }
    })
    return NextResponse.json({
        success: true,
        errorMessage: '获取数据成功',
        data: {
            list: data
        }
    })
}

export const POST = async (req: NextRequest) => {
    const data = await req.json()
    await prisma.article.create({
        data
    })
    return NextResponse.json({
        success: true,
        errorMessage: '创建成功',
        data
    })
}