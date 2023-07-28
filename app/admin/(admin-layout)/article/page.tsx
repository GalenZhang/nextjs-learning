'use client'
import { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Table, Modal, Space, Popconfirm } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MyUpload from '../../_components/MyUpload';

type Article = {
  id: string,
  title: string,
  desc: string,
  image: string
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
                body: JSON.stringify({ ...v, image: imageUrl })
              }).then(res => res.json())
            } else {
              await fetch('/api/admin/article', {
                method: 'POST',
                body: JSON.stringify({ ...v, image: imageUrl })
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
        </Form>
      </Modal>
    </Card>
  )
}

export default ArticlePage