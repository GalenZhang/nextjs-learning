import { NextRequest, NextResponse } from "next/server"
import dayjs from "dayjs"
import path from "path"
import fs from 'fs'
import { randomUUID } from "crypto"

const saveFile = async (blob: File) => {
    const dirName = '/upload/' + dayjs().format('YYYY-MM-DD')
    const uploadDir = path.join(process.cwd(), 'public' + dirName)
    fs.mkdirSync(uploadDir, {
        recursive: true
    })
    const fileName = randomUUID() + '.png'
    const arrayBuffer = await blob.arrayBuffer()
    fs.writeFileSync(uploadDir + '/' + fileName, new DataView(arrayBuffer))
    return dirName + "/" + fileName
}

export const POST = async (req: NextRequest) => {
    const data = await req.formData()
    const fileName = await saveFile(data.get('file') as File)
    return NextResponse.json({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url": fileName, // 图片 src ，必须
            // "alt": "yyy", // 图片描述文字，非必须
            // "href": "zzz" // 图片的链接，非必须
        }
    })
}