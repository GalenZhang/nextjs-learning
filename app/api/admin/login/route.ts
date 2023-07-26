import { NextRequest, NextResponse } from "next/server"
export const POST = async (req: NextRequest) => {
    const data = await req.json()
    console.log('server login param', data)
    return NextResponse.json({
      success: true,
      errorMessage: '登录成功'
    }, {
        headers: {
            'Set-Cookie': 'admin-token=123;Path=/'
        }
    })
  }