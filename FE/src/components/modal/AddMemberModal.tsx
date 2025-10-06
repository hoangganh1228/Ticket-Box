import React, {useState, useEffect} from "react";
import {Modal, Row, Col, message, Button, Popconfirm} from "antd";
import {Check, ChevronDown} from "lucide-react";
import {emailValid} from "@/src/utils/validate";
import {addEventMember, removeEventMember, updateEventMember} from "@/src/apis/events/eventMember";
import {toast} from "react-toastify";
import {getErrorMessage} from "@/src/helpers/toastError.helper";
import {TypeCallbackModal} from "@/app/organizer/events/[eventId]/member/page";

interface EventRolePermission {
    id: number;
    code: string;
    display_name: string;
}

interface EventRole {
    id: number;
    code: string;
    display_name: string;
    eventRolePermissions: EventRolePermission[];
}

interface AddMemberModalProps {
    open: boolean;
    onClose: () => void;
    roleOptions: EventRole[];
    eventId: number;
    callback: (data: any, type: TypeCallbackModal) => void;
    roleSelected: EventRole | null;
    userSelected?: { id: number; username: string; email: string } | null;
}

export default function AddMemberModal(
    {
        open,
        onClose,
        roleOptions,
        eventId,
        callback,
        roleSelected,
        userSelected,
    }: AddMemberModalProps) {
    const [email, setEmail] = useState("");
    const [selectedRole, setSelectedRole] = useState<EventRole | undefined>(roleOptions?.[0]);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [loadingAddMember, setLoadingAddMember] = useState(false);

    useEffect(() => {
        if (roleSelected) {
            setSelectedRole(roleSelected);
        } else {
            setSelectedRole(roleOptions[0]);
        }
    }, [roleSelected, roleOptions]);

    const handleRoleSelect = (role: EventRole) => {
        setSelectedRole(role);
        setShowRoleDropdown(false);
    };

    const showError = (content: string) => {
        messageApi.open({type: "error", content});
    };

    const handleAddMember = async () => {
        if (!email) return showError("Vui lòng nhập email");
        if (!emailValid(email)) return showError("Email không hợp lệ");
        if (!selectedRole) return showError("Vui lòng chọn vai trò");

        const payload = {email, event_role_id: selectedRole.id};
        setLoadingAddMember(true);

        try {
            const {data} = await addEventMember(eventId, payload);
            callback(data, TypeCallbackModal.ADD);
            messageApi.open({type: "success", content: "Thêm thành viên thành công"});
            setEmail("");
            onClose();
        } catch (error) {
            toast.error(getErrorMessage(error, "Thêm thành viên thất bại"));
        } finally {
            setLoadingAddMember(false);
        }
    };

    const handleUpdateMember = async () => {
        if (!selectedRole) return showError("Vui lòng chọn vai trò");

        const payload = {event_role_id: selectedRole.id, user_id: userSelected?.id};
        setLoadingAddMember(true);

        try {
            const {data} = await updateEventMember(eventId, payload);
            callback(data, TypeCallbackModal.UPDATE);
            messageApi.open({type: "success", content: "Cập nhật thành viên thành công"});
            onClose();
        } catch (error) {
            toast.error(getErrorMessage(error, "Cập nhật thành viên thất bại"));
        } finally {
            setLoadingAddMember(false);
        }
    };

    const handleRemoveMember = async () => {
        try {
            await removeEventMember(eventId, userSelected?.id!);
            callback(userSelected?.id!, TypeCallbackModal.DELETE);
            messageApi.open({type: "success", content: "Xoá thành viên thành công"});
            onClose();
        } catch (error) {
            toast.error(getErrorMessage(error, "Xoá thành viên thất bại"));
        }
    };

    return (
        <Modal
            title={<h2 className="text-white text-lg font-medium">Thêm thành viên</h2>}
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            className="custom-modal-add-member"
            width={700}
        >
            {contextHolder}
            <div className="space-y-4">
                {roleSelected ? (
                    <div className="flex flex-col gap-3 p-4 bg-gray-700 rounded-xl mb-3">
                        <p className="text-center text-lg font-bold text-[#2DC275]">{userSelected?.username}</p>
                        <p className="text-center text-sm text-white">{userSelected?.email}</p>
                    </div>
                ) : (
                    <input
                        type="email"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                )}

                <div className="relative">
                    <div
                        onClick={() => setShowRoleDropdown((prev) => !prev)}
                        className="flex items-center justify-between py-3 px-3 text-white cursor-pointer hover:bg-gray-700 rounded-lg bg-gray-700 border border-gray-600"
                    >
                        <span className="text-gray-300">{selectedRole?.display_name}</span>
                        <ChevronDown
                            size={20}
                            className={`text-gray-400 transition-transform ${showRoleDropdown ? "rotate-180" : ""}`}
                        />
                    </div>

                    {showRoleDropdown && (
                        <div
                            className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
                            {roleOptions.map((role) => (
                                <div
                                    key={role.id}
                                    onClick={() => handleRoleSelect(role)}
                                    className={`px-3 py-2 cursor-pointer hover:bg-gray-600 transition-colors ${
                                        selectedRole?.id === role.id ? "bg-green-500 text-white" : "text-gray-300"
                                    }`}
                                >
                                    {role.display_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="min-h-[180px]">
                    <h3 className="text-white font-medium mb-3">Quyền truy cập</h3>
                    <Row gutter={[16, 16]}>
                        {selectedRole?.eventRolePermissions.map((item) => (
                            <Col key={item.id} md={8} xs={24}>
                                <div className="flex items-center space-x-3 py-1">
                                    <Check className="text-primary"/>
                                    <span className="text-gray-300 text-sm">{item.display_name}</span>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                <div className="pt-2">
                    <Button
                        type="primary"
                        disabled={loadingAddMember}
                        loading={loadingAddMember}
                        className="bg-green-600 hover:bg-green-700 border-none rounded-full px-4 w-full"
                        onClick={roleSelected ? handleUpdateMember : handleAddMember}
                    >
                        {roleSelected ? "Cập nhật" : "Thêm thành viên"}
                    </Button>
                </div>

                {roleSelected && (
                    <div className="pt-2">
                        <Popconfirm
                            title="Xác nhận xóa"
                            description="Bạn có chắc muốn xoá thành viên này?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={handleRemoveMember}
                        >
                            <Button
                                type="text"
                                className="bg-transparent border-none rounded-full px-4 w-full text-red-600 hover:text-red-700 font-bold"
                            >
                                Xóa thành viên
                            </Button>
                        </Popconfirm>
                    </div>
                )}
            </div>
        </Modal>
    );
}