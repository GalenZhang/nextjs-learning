import { prisma } from '@/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    // pageNum 页码
    // pageSize 每页条数
    const pageNum = (req.nextUrl.searchParams.get('pageNum') as any) * 1 || 1
    const pageSize = (req.nextUrl.searchParams.get('pageSize') as any) * 1 || 10
    const title = (req.nextUrl.searchParams.get('title') as string) || ''
    const data = await prisma.article.findMany({
        where: {
            title: {
                contains: title // 模糊查询
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: pageSize, // 取多少条数据
        skip: (pageNum - 1) * pageSize // 跳过多少条
    })
    const total = await prisma.article.count({
        where: {
            title: {
                contains: title // 模糊查询
            }
        }
    })
    return NextResponse.json({
        success: true,
        errorMessage: '获取数据成功',
        data: {
            list: data,
            pages: Math.ceil(total / pageSize),
            total
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