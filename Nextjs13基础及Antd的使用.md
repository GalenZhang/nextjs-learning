### Nextjs介绍
nextjs是一个服务器端渲染框架  
官网地址 https://nextjs.org  

创建项目 `nextjs-learning`
```
npx create-next-app@latest nextjs-learning
#按默认项创建

#测试项目源码地址：
https://gitee.com/galen.zhang/vue3-demo/tree/master/nextjs-learning

cd nextjs-learning
npm run dev
#访问 http://localhost:3000/
```

修改首页 `app/page.tsx`  
```
export default function Home() {
  return (
    <main>
      <h1>这是一个nextjs项目</h1>
    </main>
  )
}
```

全局样式 `globals.css` 只保留一点样式
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### app路由规则
Next.js是一个文件系统基础的路由系统，在文件夹中放一个文件 `page.tsx`  
这将会自动成为一个可访问的路由  
例如首页 `app/page.tsx`  
```
export default function Home() {
  return (
    <main>
      <h1>这是一个nextjs项目</h1>
    </main>
  )
}
```

新建文件 `app/demo/page.tsx`
```
export default function Demo() {
    return (
        <div className="demo-home">Demo page</div>
    )
}
```

在文件夹中放一个 `page.tsx` 文件，路由为文件夹的名称  
http://localhost:3000/demo

##### 页面布局模板页
在  `page.tsx` 同目录下创建文件 `layout.tsx`（每个目录下可以有一个layout.tsx文件） 
`app/demo/layout.tsx` 
```
export default function DemoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <h1>Demo layout</h1>
            {children}
        </>
    )
}
```

在demo及其子路由页面，会应用这个样式

##### 嵌套路由
新建文件 `app/dashboard/settings/page.tsx`  
在每个目录下会放一个page页面
```
export default function Page() {
    return <h1 className={"text-4xl text-red-500"}>hello world</h1>
}
```

访问地址  
http://localhost:3000/dashboard/settings
 
##### 页面布局
在目录下创建文件 `layout.tsx`（每个目录下可以有一个layout.tsx文件）
```
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <h1>dashboard layout</h1>
            {children}
        </>
    )
}
```

##### 动态路由
在demo文件中，创建文件 `app/demo/[id]/page.tsx` 
```
import React from "react"

function Detail({ params }: { params: { id: string } }) {
    return (
        <div className="detail">Detail page -- {params.id}</div>
    )
}

export default Detail
```

访问地址  
http://localhost:3000/demo/123  
http://localhost:3000/demo/abc

##### 分组路由
创建文件  
`(admin)/list/page.tsx`  
`(admin)/about/page.tsx`  
`(admin)/layout.tsx`  
在分组 `(admin)` 中可以配置一个共用的页面样式 `layout.tsx`  
分组路径在实际访问时不需要指定  
http://localhost:3000/list   
http://localhost:3000/about    

---------
### 设置页面标题
页面标题Metadata的固定写法  
```
import React from "react"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '这是一个List页面',
    description: '这是一个nextjs构建的List页面',
    keywords: 'React、Nextjs'
}

function List() {
    return (
        <div className="list">List page</div>
    )
}

export default List
```

也可以动态设置页面标题
```
import React from "react"

type Props = {
    params: { id: string }
    searchParams: any
}

// 可以动态的进行metadata的生成
export async function generateMetadata({ params, searchParams }: Props) {
    return {
        title: '这是详情页 -- ' + params.id + ' -- ' + searchParams.name
    }
}

function Detail({ params, searchParams }: Props) {
    return (
        <div className="detail">Detail page -- {params.id} --, query -- {searchParams.name}</div>
    )
}

export default Detail
```

访问地址  
http://localhost:3000/demo/123?name=123abc  

---
### 服务端api接口
新建文件 `api/goods/route.ts`  
在文件夹中要有一个固定的文件 `route.ts`  
```
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    errorMessage: '获取数据成功',
    data: [{
        id: 1,
        name: '张三'
    }, {
        id: 2,
        name: "李四"
    }]
  })
}

// 插入数据
export const POST = async (req: NextRequest) => {
  const data = await req.json()
  return NextResponse.json({
    success: true,
    errorMessage: '创建成功',
    data
  })
}
```

访问api接口  
http://localhost:3000/api/goods 

##### 动态访问api接口
新建文件 `api/goods/[id]/route.ts`
```
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: any) {
    return NextResponse.json({
        success: true,
        errorMessage: '获取单条数据' + params.id,
        data: {}
    })
}
```

访问地址  
http://localhost:3000/api/goods/123 

---
### 在页面中访问服务端api
创建组件 `app\list\_components\List.tsx`  
```
'use client'
import React, { useEffect, useState } from "react"

type Item = {
    id: number
    name: string
}

function List() {
    const [data, setData] = useState<Item[]>([])
    useEffect(() => {
        fetch('/api/goods').then(res => res.json()).then(res => setData(res.data))
    }, [])

    return (
        <div className="list">
            <ul>
                {data.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}

            </ul>
        </div>
    )
}

export default List
```

在 `app\list\page.tsx` 中使用组件
```
import React from "react"
import { Metadata } from 'next'
import List from "./_components/List"

export const metadata: Metadata = {
    title: '这是一个List页面',
    description: '这是一个nextjs构建的List页面',
    keywords: 'React、Nextjs'
}

function ListPage() {
    return (
        <div className="list">
            List page
            <List />
        </div>
    )
}

export default ListPage
```

注意：如果是在服务端渲染调用api，则需要使用全路径（客户端页面必须在文件开头添加'use client'，不添加默认为服务端渲染页面）
```
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: "这是一个列表页",
  description: "设置SEO信息",
  keywords: "nextjs,react"
}

async function getData() {
  const res = await fetch('http://localhost:3000/api/goods')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

type Item = {
  id: number,
  name: String
}

async function ListPage() {
  const data = await getData()
  console.log('getData for goods: ', data)
  return (
    <div>
      <ul>
        {
          data.data.map((item: Item) => (
            <li key={item.id}>{item.name}</li>
          ))
        }
      </ul>
    </div>
  )
}

export default ListPage
```

---
### 页面链接和导航
页面链接跳转 `blog\PostList.tsx`
```
import Link from "next/link"

export default function Page({ posts }) {
    return (
        <>
            <ul>
                {
                    posts.map((post) => (
                        <li key={post.id}>
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>    
                        </li>
                    ))
                }
            </ul>
        </>
    )
}
```

页面路由跳转
```
'use client'
import Link from "next/link"
import { useRouter } from "next/navigation"
import PostList from './blog/PostList'

export default function Home() {
  const router = useRouter()

  const postData = [
    { id: 1, slug: "aaa", title: "aaa" },
    { id: 2, slug: "bbb", title: "bbb" }
  ]

  return (
    <>
      <div>Home Page</div>
      <Link href="/dashboard">Dashboard Link</Link>
      <PostList posts={postData}></PostList>
      <br />
      <button type="button" onClick={() => {router.push("/dashboard")}}>goto dashboard</button>
    </>

  )
}

```

##### 路由组
使用 `(文件夹)` 的形式组织文件  
在访问页面时，路由路径中可以不包含括号中的文件夹名称  
在文件夹中也可以创建页面布局模板 `layout.tsx`
`app\(shop)\account\page.tsx`  
http://localhost:3000/account  

##### 动态路由
`[文件夹]`  
`[[文件夹]]`  //可选路径  

```
// app/blog/[slug]/page.jsx
export default function Page({ params }: { params: { slug: string }}) {
    return (
        <div>blog slug: {params.slug}</div>
    )
}
```

http://localhost:3000/blog/abc  

app/shop/[...slug]/page.js  
http://localhost:3000/shop/abc  
http://localhost:3000/shop/abc/123  

##### 加载中 `loading.js`
```
export default function Loading() {
    return (
        <h1>Loading</h1>
    )
}
```

在 `layout.js` 中引用文件
```
import { Suspense } from 'react'
import Loading from './loading'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Suspense fallback={<p><Loading /></p>}>
                <h1>dashboard layout</h1>
                {children}
            </Suspense>
        </>
    )
}
```

##### 错误处理 `error.js`
```
'use client'
export default function Error({ error, reset }: {
    error: Error,
    reset: () => void
}) {
    return (
        <div>
            <h2>出错啦</h2>
            <button onClick={() => reset()}>重试一下</button>
        </div>
    )
}
```

---
### Prisma数据库操作
安装Prisma  
```
npm config set registry https://registry.npmmirror.com/
npm install prisma --save-dev

#初始化sqlite数据库
npx prisma init --datasource-provider sqlite
```

修改数据表结构映射关系 `prisma/schema.prisma`
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Goods {
  id        String   @id @unique @default(uuid())
  name      String
  desc      String   @default("")
  content   String   @default("")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("products")
}
```

执行更新表结构
```
npx prisma db push 
```

创建工具类数据库连接 `db.ts`
```
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

服务端api接口中查询表中数据 `api/goods/route.ts`
```
import { prisma } from '@/db'
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
  })
}

// 插入数据
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
```

POST http://localhost:3000/api/goods  
{"name": "华为手机"}

GET http://localhost:3000/api/goods  

------
### 使用 `Antd` 做后台管理页面
安装 `Antd`
```
npm install antd --save
npm install @ant-design/icons --save
```

`tailwind` 与 `Antd` 样式有冲突  
修改文件 `tailwind.config.js`
```
  plugins: [],
  // 不要覆盖原有样式，禁止设置初始值
  corePlugins: {
    preflight: false
  }
```

配置引入 `Antd` 的组件 `admin\_components\AntdContainer.tsx`  
```
'use client'
import React from 'react'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

function AntdContainer({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ConfigProvider locale={zhCN}>
            {children}
        </ConfigProvider>

    )
}

export default AntdContainer
```

配置公共布局样式 `admin\layout.tsx`
```
import React from 'react'
import AntdContainer from './_components/AntdContainer'

function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AntdContainer>{children}</AntdContainer>
    )
}

export default AdminLayout
```  

---
### 登录功能
客户端登录页面，使用 `Form` 表单提交数据   
`admin\login\page.tsx` 
```
'use client'
import { Card, Button, Form, Input } from "antd"
import { useRouter } from "next/navigation"

function LoginPage() {
    const nav = useRouter()
    return (
        <div className="login-form pt-20">
            <Card title="Nextjs管理后台" className="w-4/5 mx-auto">
                <Form name="basic"
                    labelCol={{ span: 3 }}
                    onFinish={async (v) => {
                        console.log('login param', v)
                        const res = await fetch('/api/admin/login', {
                            method: 'POST',
                            body: JSON.stringify(v)
                        }).then(res => res.json())
                        console.log('res', res)
                        nav.push('/admin/dashboard')
                    }}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input placeholder="请输入用户名" />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" htmlType="submit">登录</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default LoginPage
```

服务端登录api接口 `api/admin/login/route.ts`  
```
import { NextRequest, NextResponse } from "next/server"
export const POST = async (req: NextRequest) => {
    const data = await req.json()
    console.log('server login param', data)
    // 需要自己添加处理登录逻辑
    return NextResponse.json({
      success: true,
      errorMessage: '登录成功'
    }, {
        headers: {
            'Set-Cookie': 'admin-token=123;Path=/'
        }
    })
  }
```

##### 服务端拦截判断请求中是否包含token   
中间页做登录判断 `middleware.ts`  
每次请求时都会执行
```
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname
  if (url.startsWith('/admin') && !url.startsWith('/admin/login')) {
    if (request.cookies.get('admin-token')) {

    } else {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
}
```

---
### 管理后台布局  
包含左侧导航栏，右侧内容显示区域  
`admin\_components\AntdAdmin.ts`  
```
'use client'
import React, { useState } from 'react'
import { Layout, Menu, theme, Button } from 'antd';
import 'antd/dist/reset.css'
import { UploadOutlined, UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined, DashboardOutlined } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;
import { useRouter } from 'next/navigation';

function AntdAdmin({
    children,
}: {
    children: React.ReactNode
}) {
    const nav = useRouter()
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout style={{ height: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={({ key }) => {
                        nav.push(key)
                    }}
                    items={[
                        {
                            key: '/admin/dashboard',
                            icon: <DashboardOutlined />,
                            label: '看板',
                        },
                        {
                            key: '/admin/user',
                            icon: <UserOutlined />,
                            label: '用户信息',
                        },
                        {
                            key: '/admin/article',
                            icon: <UploadOutlined />,
                            label: '文章管理',
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '12px',
                        padding: '8px',
                        minHeight: 280,
                        background: colorBgContainer,
                        overflow: 'auto'
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>

    )
}

export default AntdAdmin
```

Card卡片页面样式 `admin\_components\PageContainer.ts`  
```
'use client'
import { Card } from 'antd'

function PageContainer({
    children, title
}: {
    children: React.ReactNode, title: string
}) {
    return (
        <Card title={title}>{children}</Card>
    )
}

export default PageContainer
```

admin后台样式分组  
`admin\(admin-layout)\layout.ts`
```
import React from 'react'
import AntdAdmin from '../_components/AntdAdmin'

function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AntdAdmin>
            {children}
        </AntdAdmin>
    )
}

export default AdminLayout
```

测试样式页面
`admin\(admin-layout)\dashboard\page.tsx`
```
import React from 'react'
import PageContainer from '../../_components/PageContainer'

function DashboardPage() {
  return (
    <PageContainer title='看板'>
        <h1>任务看板</h1>
    </PageContainer>
  )
}

export default DashboardPage
```

添加列表、Form页面  
`admin\(admin-layout)\user\page.tsx`
```
'use client'
import React from 'react'
import { Form, Table, Input, Button, Card } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

function UserPage() {
    return (
        <Card title='用户信息' extra={<><Button icon={<PlusOutlined />} type='primary' /></>}>
            <Form layout='inline'>
                <Form.Item label="姓名">
                    <Input placeholder='请输入姓名'></Input>
                </Form.Item>
                <Form.Item>
                    <Button icon={<SearchOutlined />} type='primary'></Button>
                </Form.Item>
            </Form>
            <Table style={{ marginTop: '8px' }} columns={[
                {
                    title: '序号'
                }, {
                    title: '姓名'
                }, {
                    title: '昵称'
                }, {
                    title: '用户名'
                }, {
                    title: '头像'
                }, {
                    title: '手机号'
                }, {
                    title: '年龄'
                }, {
                    title: '性别'
                }, {
                    title: '操作'
                }
            ]} />
        </Card>
    )
}

export default UserPage
```

---
### 页面增删改查功能
新建数据表 `prisma/schema.prisma`
```

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Goods {
  id        String   @id @unique @default(uuid())
  name      String
  desc      String   @default("")
  content   String   @default("")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("products")
}

model Article {
  id        String   @id @unique @default(uuid())
  title     String
  desc      String?  @default("")
  content   String?  @default("")
  image     String?  @default("")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("article")
}

```

更新数据模型  
`npx prisma db push`  

##### 创建服务端api接口
`api\admin\article\route.ts`
```
import { prisma } from '@/db'
import { NextRequest, NextResponse } from 'next/server'

// 查询列表带分页功能
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

// 新增
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
```

更新、删除数据接口  
`api\admin\article\[id]\route.tsx`
```
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
```

文件上传接口  
`api\common\upload\route.tsx`
```
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
```

富文本编辑器文件上传  
`api\common\wang_editor\upload\route.tsx`
```
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
```

##### 安装富文本编辑器
```
npm install @wangeditor/editor
npm install @wangeditor/editor-for-react
npm install dayjs
```

https://www.wangeditor.com/  
开源 Web 富文本编辑器  

---
##### 增删改查页面
`admin\(admin-layout)\article\page.tsx`
```
'use client'
import { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Table, Modal, Space, Popconfirm } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MyUpload from '../../_components/MyUpload';
import dynamic from 'next/dynamic';
// 只在客户端中引入富文本编辑器，不在编译的时候做处理
// import MyEditor from '../../_components/MyEditor';
const MyEditor = dynamic(() => import('../../_components/MyEditor'), {
  ssr: false
})

type Article = {
  id: string,
  title: string,
  desc: string,
  image: string,
  content: string,
}

function ArticlePage() {
  const [open, setOpen] = useState(false)
  const [list, setList] = useState<Article[]>([])
  const [query, setQuery] = useState({
    pageNum: 1,
    pageSize: 10,
    title: ''
  }) // 查询条件
  const [currentId, setCurrentId] = useState('') // 使用一个当前id，表示是新增还是修改
  const [total, setTotal] = useState(0) // 总条数
  const [imageUrl, setImageUrl] = useState<string>(''); // 上传图片
  // 编辑器内容
  const [html, setHtml] = useState('')
  const [myForm] = Form.useForm() // 获取Form组件
  useEffect(() => {
    fetch(`/api/admin/article?pageNum=${query.pageNum}&pageSize=${query.pageSize}&title=${query.title}`).then(res => res.json()).then(res => {
      setList(res.data.list)
      setTotal(res.data.total)
    })
  }, [query])

  useEffect(() => {
    if (!open) {
      setCurrentId('')
      setImageUrl('')
      setHtml('')
    }
  }, [open])

  return (
    <Card title="文章管理" extra={<><Button icon={<PlusOutlined />} type='primary' onClick={() => setOpen(true)}></Button></>}>
      <Form layout='inline' onFinish={(v) => {
        setQuery({
          pageNum: 1,
          pageSize: 10,
          title: v.title
        })
      }}>
        <Form.Item label="标题" name='title'>
          <Input placeholder='请输入关键词'></Input>
        </Form.Item>
        <Form.Item>
          <Button icon={<SearchOutlined />} type='primary' htmlType='submit'></Button>
        </Form.Item>
      </Form>
      <Table style={{ marginTop: '8px' }}
        dataSource={list}
        rowKey='id'
        pagination={{
          total,
          onChange(page) {
            setQuery({
              ...query,
              pageNum: page,
              pageSize: 10
            })
          }
        }}
        columns={[
          {
            title: '序号',
            width: 80,
            render(v, r, i) {
              return i + 1
            }
          }, {
            title: '标题',
            dataIndex: 'title'
          }, {
            title: '简介',
            dataIndex: 'desc'
          }, {
            title: '封面',
            align: 'center',
            width: '100px',
            render(v, r) {
              return <img src={r.image} style={{ display: 'block', margin: '8px auto', width: '80px', maxHeight: '80px' }} alt={r.title}></img>
            }
          }, {
            title: '操作',
            render(v, r) {
              return <Space>
                <Button size='small' icon={<EditOutlined />} type='primary' onClick={() => {
                  setOpen(true)
                  setCurrentId(r.id)
                  setImageUrl(r.image)
                  setHtml(r.content)
                  myForm.setFieldsValue(r)
                }}></Button>
                <Popconfirm title="是否确认删除？" onConfirm={async () => {
                  await fetch(`/api/admin/article/${r.id}`, {
                    method: 'DELETE',
                  }).then(res => res.json())
                  setQuery({
                    ...query,
                    pageNum: 1,
                    pageSize: 10
                  })
                }}>
                  <Button size='small' icon={<DeleteOutlined />} type='primary' danger></Button>
                </Popconfirm>
              </Space>
            },
          }
        ]}></Table>
      <Modal title="编辑"
        width={'75vw'}
        open={open}
        destroyOnClose={true} // 关闭模态框时销毁数据
        maskClosable={false} // 点击空白区域的时候不关闭
        onCancel={() => setOpen(false)}
        onOk={() => {
          myForm.submit()
        }}>
        <Form layout='vertical'
          form={myForm}
          preserve={false} // 和modal结合使用的时候需要加上它，否则不会销毁
          onFinish={async (v) => {
            console.log(v)
            if (currentId) {
              await fetch(`/api/admin/article/${currentId}`, {
                method: 'PUT',
                body: JSON.stringify({ ...v, image: imageUrl, content: html })
              }).then(res => res.json())
            } else {
              await fetch('/api/admin/article', {
                method: 'POST',
                body: JSON.stringify({ ...v, image: imageUrl, content: html })
              }).then(res => res.json())
            }
            setOpen(false)
            setQuery({
              ...query,
              pageNum: 1,
              pageSize: 10
            }) // 重新查询
          }}>
          <Form.Item label="标题" name="title" rules={[
            {
              required: true,
              message: '标题不能为空'
            }
          ]}>
            <Input placeholder='请输入标题' />
          </Form.Item>
          <Form.Item label="简介" name="desc">
            <Input.TextArea placeholder='请输入简介' />
          </Form.Item>
          <Form.Item label="封面">
            <MyUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />
          </Form.Item>
          <Form.Item label="详情">
            <MyEditor html={html} setHtml={setHtml} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default ArticlePage
```

##### 封装富文本编辑器组件
`admin\_components\MyEditor.tsx`
```
'use client'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

function MyEditor({ html, setHtml }: { html: string, setHtml: any }) {
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null)   // TS 语法
    // const [editor, setEditor] = useState(null)                   // JS 语法

    // 模拟 ajax 请求，异步设置 html
    useEffect(() => {
        // setTimeout(() => {
        //     setHtml('<p>hello world</p>')
        // }, 1500)
    }, [])

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {}  // TS 语法
    // const toolbarConfig = { }                        // JS 语法

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {    // TS 语法
        // const editorConfig = {                         // JS 语法
        placeholder: '请输入内容...',
        MENU_CONF: {
            'uploadImage': {
                server: '/api/common/wang_editor/upload',
                fieldName: 'file'
            },
            
        }
    }

    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    return (
        <>
            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={editor => setHtml(editor.getHtml())}
                    mode="default"
                    style={{ height: '500px', overflowY: 'hidden' }}
                />
            </div>
            {/* <div style={{ marginTop: '15px' }}>
                {html}
            </div> */}
        </>
    )
}

export default MyEditor
```

##### 封装上传文件组件
`admin\_components\MyUpload.tsx`
```
import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

// const getBase64 = (img: RcFile, callback: (url: string) => void) => {
//     const reader = new FileReader();
//     reader.addEventListener('load', () => callback(reader.result as string));
//     reader.readAsDataURL(img);
// };

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

// 组件接收的属性
type Props = {
    imageUrl: string;
    setImageUrl: any
}

const MyUpload = ({ imageUrl, setImageUrl }: Props) => {
    const [loading, setLoading] = useState(false);

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            // getBase64(info.file.originFileObj as RcFile, (url) => {
            //     setLoading(false);
            //     setImageUrl(url);
            // });
            console.log('path', info.file.response.data)
            setImageUrl(info.file.response.data)
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="/api/common/upload"
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
        </>
    );
};

export default MyUpload;
```

---
### 打包部署
```
npm run build
npm start
```

动态导入：只在客户端中引入，不做服务器内容生成(避免编译打包时报错)
```
// 只在客户端中引入富文本编辑器，不在编译的时候做处理
// import MyEditor from '../../_components/MyEditor';
const MyEditor = dynamic(() => import('../../_components/MyEditor'), {
  ssr: false
})
```

使用pm2管理进程  
https://pm2.fenxianglu.cn/  
NODE.JS进程管理工具  
```
npm install pm2@latest -g
#pm2 start app.js
pm2 start npm --name next-app -- start
pm2 ls
pm2 del 0  #删除项目
```

nginx服务器做代理
```
# 配置一下nginx服务器，提供静态资源如图片的访问
server {
  listen 3031;
  location / {
    proxy_pass http://localhost:3000;
  }

  # 配置静态资源目录
  location /upload {
    alias 你的路径;
  }
}
```

---
### 在vercel.com中部署静态站点
注意：上边的项目代码中包含sqlite本地数据库，是不能在vercel站点中使用的  

在vercel中开始部署项目  
https://vercel.com/new  
关联github账号并选择要部署的项目，按提示一步步操作 

国内不能访问vercel提供的域名  

使用自己购买的国内域名
1. vercel项目名 -> settings -> domains -> add，添加自己的域名
2. 在自己的域名服务商配置页面，添加 CNAME  
`CNAME cname.vercel-dns.com`

---
### 未完成内容
使用vercel提供的Postgres存储数据  
第三方PlanetScale已限制国内区域访问了  


https://blog.csdn.net/w_monster/article/details/131680662  
免费的云数据库：探索PlanetScale，划分分支的MySQL Serverless平台  

https://blog.csdn.net/jascl/article/details/131304307  
使用 Vercel Edge 上的 PlanetScale 和 Prisma 向我的 Astro 博客添加评论  

https://juejin.cn/post/7252951745012727868  
如何使用 Next.js、Prisma 和 Vercel Postgres 构建全栈应用程序  


