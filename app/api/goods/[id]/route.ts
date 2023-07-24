
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: any) {
    return NextResponse.json({
        success: true,
        errorMessage: '获取单条纪录: ' + params.id,
        data: {}
    })
}
