
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    errorMessage: '',
    data: [{
      id: 1,
      name: '张三'
    }, {
      id: 2,
      name: "李四"
    }]
  })
}
