'use client';
import React, {useEffect, useState} from "react";
import {Table, Button, Space, Form, Modal, Input, Popconfirm} from "antd";
import Link from "next/link";
import {ColumnsType} from "antd/es/table";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {createEventRole, deleteEventRole, getEventRoles, updateEventRole} from "@/src/apis/events/eventPermission";
import {toast} from "react-toastify";

interface Role {
    id: number;
    code: string;
    display_name: string;
    created_at: string;
    updated_at: string;
}

export default function EventPermissionPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [form] = Form.useForm();
    const [eventRoles, setEventRoles] = useState<Role[]>([]);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState({
        loadingGetData: false,
        loadingCreate: false,
        loadingUpdate: false,
        loadingDelete: false,
    });
    const getDataEventRoles = async () => {
        try {
            setLoading(prevState => {
                return {...prevState, loadingGetData: true};
            })
            const response = await getEventRoles();
            setEventRoles(response.data);
            setLoading(prevState => {
                return {...prevState, loadingGetData: false};
            })
        } catch (error) {
            setLoading(prevState => {
                return {...prevState, loadingGetData: false};
            })
            toast.error(error?.response?.data?.message || "Lỗi khi lấy danh sách quyền");
            console.error("Lỗi khi lấy danh sách quyền:", error);
        }
    }
    useEffect(() => {
        getDataEventRoles();
    }, [])

    const showModal = () => {
        setIsModalOpen(true);
    };

    const setLoadingState = (key: keyof typeof loading, value: boolean) => {
        setLoading(prevState => ({...prevState, [key]: value}));
    };

    const handeDeleteRole = async (id: number) => {
        try {
            setLoadingState("loadingDelete", true);
            await deleteEventRole(id);
            setEventRoles(prevRoles => prevRoles.filter(role => role.id !== id));
            toast.success("Xóa quyền thành công");
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Đã xảy ra lỗi";
            toast.error(errorMessage);
            console.error("Error:", error);
        } finally {
            setLoadingState("loadingDelete", false);
        }
    }
    const handleEventRole = async (
        values: { display_name: string },
        action: any,
        successMessage: string
    ) => {
        try {
            setLoadingState("loadingCreate", true);

            const id = isEdit && selectedRole ? selectedRole.id : undefined;
            const {data} = await action(values, id);

            setEventRoles(prevRoles =>
                isEdit
                    ? prevRoles.map(role =>
                        role.id === data.id ? {...role, display_name: data.display_name} : role
                    )
                    : [...prevRoles, data]
            );

            setIsModalOpen(false);
            form.resetFields();
            toast.success(successMessage);
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Đã xảy ra lỗi";
            toast.error(errorMessage);
            console.error("Error:", error);
        } finally {
            setLoadingState("loadingCreate", false);
        }
    };

    const handleOk = async () => {
        const values = form.getFieldsValue();
        const action = isEdit ? updateEventRole : createEventRole;
        const successMessage = isEdit ? "Cập nhật quyền thành công" : "Tạo quyền thành công";

        await handleEventRole(values, action, successMessage);
        setIsEdit(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        form.resetFields();
    };

    const columns: ColumnsType<Role> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
        },
        {
            title: "Tên hiển thị",
            dataIndex: "display_name",
            key: "display_name",
            render: (text: string) => <span className="font-medium">{text}</span>,
        },
        {
            title: "Hành động",
            key: "action",
            align: "center" as const,
            render: (_, record) => (
                <Space>
                    <Link href={`/dashboard/event/permission/${record.id}`}>
                        <Button type="link" icon={<EyeOutlined/>}>
                            Chi tiết
                        </Button>
                    </Link>
                    <Button
                        type="primary"
                        icon={<EditOutlined/>}
                        onClick={() => {
                            form.setFieldsValue({
                                display_name: record.display_name,
                            });
                            setIsModalOpen(true);
                            setSelectedRole(record);
                            setIsEdit(true);
                        }}
                    />
                    <Popconfirm
                        title="Xác nhận xóa"
                        description={`Bạn có chắc chắn muốn xóa quyền: ${record.display_name}?`}
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={async () => {
                            await handeDeleteRole(record.id);
                        }}
                    >
                        <Button loading={loading.loadingDelete} danger icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-transparent shadow rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold mb-4">Phân quyền sự kiện</h1>
                <Button onClick={showModal} className='bg-primary text-white p-4 hover:border-primary'>Thêm mới</Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={eventRoles}
                pagination={{pageSize: 5}}
                bordered
                loading={loading.loadingGetData}
                className='rounded-lg overflow-hidden bg-transparent [&_.ant-table]:bg-transparent [&_.ant-table-thead>tr>th]:bg-gray-800 [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-tbody>tr>td]:bg-gray-700 [&_.ant-table-tbody>tr>td]:text-white'
            />
            <Modal
                title={isEdit ? "Cập nhật quyền" : "Tạo quyền"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
                centered
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên quyền"
                        name="display_name"
                        rules={[{required: true, message: "Vui lòng nhập tên quyền!"}]}
                    >
                        <Input placeholder="Nhập tên quyền"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
