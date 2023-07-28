import { prisma } from '@/db'
import { NextRequest, NextResponse } from 'next/server'

export const PUT = async (req: NextRequest, { params }: any) => {
    const data = await req.json()
    const { id } = params
    await prisma.article.update({
        where: {
            id
        },
        data
    })
    return NextResponse.json({
        success: true,
        errorMessage: '修改成功',
    })
}

export const DELETE = async (req: NextRequest, { params }: any) => {
    const { id } = params
    await prisma.article.delete({
        where: {
            id
        },
    })
    return NextResponse.json({
        success: true,
        errorMessage: '删除成功',
    })
}