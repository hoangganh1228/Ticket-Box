"use client";
import React, {useEffect, useState} from "react";
import {Checkbox, Button, Divider, Col, Row, Spin} from "antd";
import {CheckSquareOutlined} from "@ant-design/icons";
import {useParams} from "next/navigation";
import {eventRole, PermissionRoleEvent} from "@/src/utils/interfaces/EventPermission.interface";
import {
    createEventRolePermission,
    getEventPermissions,
    getEventRoleById,
    getEventRolePermissionsByEventRoleId
} from "@/src/apis/events/eventPermission";
import {toast} from "react-toastify";


export default function PermissionDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [listPermissions, setListPermissions] = useState<PermissionRoleEvent[]>([]);
    const [eventRole, setEventRole] = useState<eventRole | null>(null);
    const [loading, setLoading] = useState({
        loadingGetData: false,
        loadingSubmit: false,
    });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const getData = async (): Promise<void> => {
        try {
            setLoading(prevState => ({...prevState, loadingGetData: true}));
            const [eventRolePermissionsByEventRoleIdResponse, eventRolePermissionResponse, eventRoleResponse] = await Promise.all([
                getEventRolePermissionsByEventRoleId(+id),
                getEventPermissions(),
                getEventRoleById(+id)
            ]);
            setListPermissions(eventRolePermissionResponse?.data || []);
            setEventRole(eventRoleResponse?.data);
            const selectedIdsFromPermissions = eventRolePermissionsByEventRoleIdResponse?.data?.map((item: PermissionRoleEvent) => item.id) || [];
            setSelectedIds(selectedIdsFromPermissions);
            setLoading(prevState => ({...prevState, loadingGetData: false}));
        } catch (error) {
            setLoading(prevState => ({...prevState, loadingGetData: false}));
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        getData()
    }, [id]);


    const handleCheckboxChange = (id: number, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((item) => item !== id)
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === listPermissions.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(listPermissions.map((item) => item.id));
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(prevState => ({...prevState, loadingSubmit: true}));
            await createEventRolePermission(+id, selectedIds);
            toast.success("Lưu quyền thành công");
            setLoading(prevState => ({...prevState, loadingSubmit: false}));
        } catch (error) {
            setLoading(prevState => ({...prevState, loadingSubmit: false}));
            toast.error(error?.response?.data?.message || "Lỗi khi lưu quyền");
            console.error("Error submitting permissions:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
            <div className="w-full bg-white rounded-2xl shadow-lg p-6 transition-all">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckSquareOutlined className="text-blue-500 text-xl"/>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Quản lý quyền ({eventRole?.display_name})
                        </h2>
                    </div>
                </div>

                <Divider/>

                <div className="flex items-center mb-4">
                    <Checkbox
                        checked={selectedIds.length === listPermissions.length}
                        indeterminate={
                            selectedIds.length > 0 && selectedIds.length < listPermissions.length
                        }
                        onChange={handleSelectAll}
                    >
                        <span className="font-medium">Chọn tất cả</span>
                    </Checkbox>
                </div>

                <Spin spinning={loading.loadingGetData}>
                    <div className="max-h-[420px]">
                        <Row gutter={[16, 16]}>
                            {listPermissions.map((item) => (
                                <Col key={item.id} span={8}>
                                    <div
                                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-all border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id={`checkbox-${item.id}`}
                                                checked={selectedIds.includes(item.id)}
                                                onChange={(e) =>
                                                    handleCheckboxChange(item.id, e.target.checked)
                                                }
                                            />
                                            <label className="text-gray-800 font-medium cursor-pointer"
                                                   htmlFor={`checkbox-${item.id}`}
                                            >
                                                {item.display_name}
                                            </label>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Spin>


                <Divider/>
                <div className="flex justify-end">
                    <Button
                        onClick={() => setSelectedIds([])}
                        disabled={selectedIds.length === 0}
                        className="mr-3"
                    >
                        Bỏ chọn
                    </Button>
                    <Button
                        className='bg-primary text-white hover:bg-primaryHover border-0'
                        onClick={handleSubmit}
                        disabled={loading.loadingGetData}
                        loading={loading.loadingSubmit}
                    >
                        Lưu quyền ({selectedIds.length})
                    </Button>
                </div>
            </div>
        </div>
    );
}
