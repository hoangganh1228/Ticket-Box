'use client';
import React, {useEffect, useState} from 'react';
import {Spin, Button, Checkbox, message, Collapse, Divider} from 'antd';
import {getAllPermissions} from '@/src/apis/permissions';
import {assignPermissionsToRole, getRoleById} from '@/src/apis/roles';
import {useParams} from 'next/navigation';

const {Panel} = Collapse;

const PermissionTree = () => {
    const params = useParams();
    const id = params.id as string;
    const [permissions, setPermissions] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [role, setRole] = useState<any>({});
    const [messageApi, contextHolder] = message.useMessage();

    const fetchPermissions = async () => {
        try {
            setLoading(true);
            const [permission, roles] = await Promise.all([
                getAllPermissions(),
                getRoleById(id),
            ]);

            const data = permission.data || [];
            setRole(roles.data);

            const existingPermissionIds =
                roles.data.userRolePermissions?.map((perm: { id: number }) => perm.id) || [];

            setPermissions(data);
            setSelectedKeys(existingPermissionIds);
        } catch (error) {
            console.error('Lỗi khi tải permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const toggleGroup = (group: any, checked: boolean) => {
        const actionIds = group.permissions.map((perm: any) => perm.id);
        if (checked) {
            setSelectedKeys([...new Set([...selectedKeys, ...actionIds])]);
        } else {
            setSelectedKeys(selectedKeys.filter((id) => !actionIds.includes(id)));
        }
    };

    const toggleAction = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedKeys([...new Set([...selectedKeys, id])]);
        } else {
            setSelectedKeys(selectedKeys.filter((key) => key !== id));
        }
    };

    const handleUpdatePermissions = async () => {
        try {
            setLoadingUpdate(true);
            await assignPermissionsToRole(+id, selectedKeys as number[]);
            messageApi.success('Cập nhật vai trò thành công');
        } catch (error) {
            messageApi.error('Cập nhật vai trò thất bại');
        } finally {
            setLoadingUpdate(false);
        }
    };

    return (
        <div className="w-full h-full">
            {contextHolder}
            <div className="rounded-xl p-6 h-full overflow-hidden flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                    <h4 className="text-lg font-semibold m-0">
                        Vai trò: {role?.display_name || '---'}
                    </h4>
                </div>

                <Spin spinning={loading} tip="Đang tải dữ liệu...">
                    <Collapse accordion className="bg-white rounded-md" bordered={false}>
                        {permissions.map((group) => {
                            const groupChecked = group.permissions.every((perm: any) =>
                                selectedKeys.includes(perm.id)
                            );
                            const groupIndeterminate =
                                !groupChecked &&
                                group.permissions.some((perm: any) => selectedKeys.includes(perm.id));

                            return (
                                <Panel
                                    key={group.path}
                                    header={
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">{group.path}</span>
                                        </div>
                                    }
                                >
                                    <div>
                                        <div className="flex items-center">
                                            <span className="">spec</span>
                                            <div className="flex-1 border-t border-dashed border-gray-400 mx-2"></div>
                                            <Checkbox
                                                indeterminate={groupIndeterminate}
                                                checked={groupChecked}
                                                onChange={(e) => toggleGroup(group, e.target.checked)}
                                            >
                                                Select all
                                            </Checkbox>
                                        </div>

                                        <Divider/>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {group.permissions.map((perm: any) => (
                                                <Checkbox
                                                    key={perm.id}
                                                    checked={selectedKeys.includes(perm.id)}
                                                    onChange={(e) => toggleAction(perm.id, e.target.checked)}
                                                >
                                                    {perm.display_name}
                                                </Checkbox>
                                            ))}
                                        </div>
                                    </div>

                                </Panel>
                            );
                        })}
                    </Collapse>
                </Spin>

                <div className="mt-5 flex justify-end">
                    <Button
                        type="primary"
                        onClick={handleUpdatePermissions}
                        loading={loadingUpdate}
                        disabled={loadingUpdate}
                        className="bg-primary text-white px-6 py-2 hover:border-primary"
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PermissionTree;
