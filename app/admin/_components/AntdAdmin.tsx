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
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'nav 3',
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
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>

    )
}

export default AntdAdmin