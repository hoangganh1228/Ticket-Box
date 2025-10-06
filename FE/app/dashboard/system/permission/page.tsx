'use client';

import React, {useEffect, useState} from "react";
import {Table, Button, Space, Form, Modal, Input, Popconfirm} from "antd";
import Link from "next/link";
import {ColumnsType} from "antd/es/table";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {toast} from "react-toastify";
import {createRole, deleteRole, getAllRoles, updateRole} from "@/src/apis/roles";

interface Role {
    id: number;
    code: string;
    display_name: string;
    created_at: string;
    updated_at: string;
}

export default function SystemPermissionPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [form] = Form.useForm();
    const [roles, setRoles] = useState<Role[]>([]);
    const [isEdit, setIsEdit] = useState(false);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });

    const [loading, setLoading] = useState({
        loadingGetData: false,
        loadingCreate: false,
        loadingUpdate: false,
        loadingDelete: false,
    });

    const setLoadingState = (key: keyof typeof loading, value: boolean) => {
        setLoading(prevState => ({...prevState, [key]: value}));
    };

    const getDataEventRoles = async (page = 1, limit = pagination.pageSize) => {
        try {
            setLoadingState("loadingGetData", true);
            const response = await getAllRoles(page, limit);

            setRoles(response.data.data);

            setPagination({
                current: response.data.pagination.page,
                pageSize: response.data.pagination.limit,
                total: response.data.pagination.totalItems
            });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Lỗi khi lấy danh sách quyền");
            console.error("Lỗi khi lấy danh sách quyền:", error);
        } finally {
            setLoadingState("loadingGetData", false);
        }
    };

    useEffect(() => {
        getDataEventRoles(pagination.current, pagination.pageSize);
    }, []);

    // Hàm xử lý tạo và cập nhật quyền
    const handleEventRole = async (
        values: { display_name: string },
        action: any,
        successMessage: string
    ) => {
        try {
            setLoadingState("loadingCreate", true);

            const id = isEdit && selectedRole ? selectedRole.id : undefined;
            const {data} = await action(values, id);

            // Cập nhật dữ liệu local
            setRoles(prevRoles =>
                isEdit
                    ? prevRoles.map(role =>
                        role.id === data.id ? {...role, display_name: data.display_name} : role
                    )
                    : [data, ...prevRoles]
            );

            setIsModalOpen(false);
            form.resetFields();
            toast.success(successMessage);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Đã xảy ra lỗi";
            toast.error(errorMessage);
            console.error("Error:", error);
        } finally {
            setLoadingState("loadingCreate", false);
        }
    };

    const handleOk = async () => {
        const values = form.getFieldsValue();
        const action = isEdit ? updateRole : createRole;
        const successMessage = isEdit ? "Cập nhật quyền thành công" : "Tạo quyền thành công";

        await handleEventRole(values, action, successMessage);
        setIsEdit(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        form.resetFields();
    };

    const handleDeleteRole = async (id: number) => {
        try {
            setLoadingState("loadingDelete", true);
            await deleteRole(id);

            setRoles(prevRoles => prevRoles.filter(role => role.id !== id));
            toast.success("Xóa quyền thành công");

            await getDataEventRoles(pagination.current, pagination.pageSize);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Đã xảy ra lỗi";
            toast.error(errorMessage);
            console.error("Error:", error);
        } finally {
            setLoadingState("loadingDelete", false);
        }
    };

    const handleTableChange = (paginationConfig: any) => {
        getDataEventRoles(paginationConfig.current, paginationConfig.pageSize);
    };

    const columns: ColumnsType<Role> = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 80,
            render: (_: any, __: any, index: number) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
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
                    <Link href={`/dashboard/system/permission/${record.id}`}>
                        <Button type="link" icon={<EyeOutlined/>}>
                            Chi tiết
                        </Button>
                    </Link>
                    {/*<Button*/}
                    {/*    type="primary"*/}
                    {/*    icon={<EditOutlined/>}*/}
                    {/*    onClick={() => {*/}
                    {/*        form.setFieldsValue({*/}
                    {/*            display_name: record.display_name,*/}
                    {/*        });*/}
                    {/*        setIsModalOpen(true);*/}
                    {/*        setSelectedRole(record);*/}
                    {/*        setIsEdit(true);*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <Popconfirm
                        title="Xác nhận xóa"
                        description={`Bạn có chắc chắn muốn xóa quyền: ${record.display_name}?`}
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={async () => {
                            await handleDeleteRole(record.id);
                        }}
                    >
                        <Button loading={loading.loadingDelete} danger icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-transparent rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold mb-4">Phân quyền hệ thống</h1>
                <Button onClick={() => setIsModalOpen(true)}
                        className='bg-primary text-white p-4 hover:border-primary'>
                    Thêm mới
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={roles}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],
                    showTotal: (total) => <span className='text-white'>{`Tổng cộng ${total} quyền`}</span>
                }}
                bordered
                loading={loading.loadingGetData}
                onChange={handleTableChange}
                className='rounded-lg overflow-hidden bg-transparent
                [&_.ant-table]:bg-transparent
                [&_.ant-table-thead>tr>th]:bg-gray-800
                [&_.ant-table-thead>tr>th]:text-white
                [&_.ant-table-tbody>tr>td]:bg-gray-700
                [&_.ant-table-tbody>tr>td]:text-white
                [&_.ant-pagination-prev]:bg-gray-800
                [&_.ant-pagination-prev]:text-white
                [&_.ant-pagination-prev:hover]:bg-gray-600
                [&_.ant-pagination-next]:bg-gray-800
                [&_.ant-pagination-next]:text-white
                [&_.ant-pagination-next:hover]:bg-gray-600
                '

            />

            <Modal
                title={isEdit ? "Cập nhật quyền" : "Tạo quyền"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
                centered
                confirmLoading={loading.loadingCreate}
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
