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