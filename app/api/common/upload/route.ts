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
        success: true,
        errorMessoge: '文件上传成功',
        data: fileName
    })
}