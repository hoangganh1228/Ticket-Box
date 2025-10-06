"use client";

import {useEffect, useState} from "react";
import {Table, Button, Input, Dropdown, Pagination} from "antd";
import {PlusOutlined, FilterOutlined} from "@ant-design/icons";
import AddMemberModal from "@/src/components/modal/AddMemberModal";
import {useEventId} from "@/src/hooks/useEventId";
import {getEventMembers} from "@/src/apis/events/eventMember";
import {getEventRoles} from "@/src/apis/events/eventPermission";
import type {MenuProps} from "antd";
import {LIMIT_DEFAULT_PAGE} from "@/src/utils/const/config.const";

interface Member {
    user: {
        id?: number;
        username: string;
        email: string;
    };
    role: {
        id: number;
        code: string;
        display_name: string;
    };
}

export enum TypeCallbackModal {
    ADD = "add",
    UPDATE = "update",
    DELETE = "delete",
}

const MemberList = () => {
    const eventId = useEventId();

    const [searchValue, setSearchValue] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(LIMIT_DEFAULT_PAGE);
    const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
    const [filteredMemberKey, setFilteredMemberKey] = useState<string>("all");
    const [members, setMembers] = useState<Member[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [eventRoles, setEventRoles] = useState([]);
    const [eventRoleSelect, setEventRoleSelect] = useState<MenuProps["items"]>([]);
    const [loading, setLoading] = useState({
        loadingGetMembers: false,
        loadingGetRoles: false,
    });
    const [roleSelected, setRoleSelected] = useState(null);
    const [userSelected, setUserSelected] = useState(null);

    const fakeUser: Member = {
        user: {
            username: "Khuat Tien Dat",
            email: "khuattiendat2002@gmail.com",
        },
        role: {
            id: 1,
            code: "quan-tri-vien",
            display_name: "Chủ sự kiện",
        },
    };

    const handleChangeMemberKey = (key: string) => {
        setFilteredMemberKey(key);
        fetchMembers(key, pageSize, currentPage);
    };

    const fetchMembers = async (role = "all", limit = LIMIT_DEFAULT_PAGE, page = 1) => {
        if (!eventId) return;
        try {
            setLoading((prev) => ({...prev, loadingGetMembers: true}));
            const {data} = await getEventMembers(+eventId, role, limit, page);
            setMembers([fakeUser, ...data.data]);
            setTotalItems(data.pagination.totalItem);
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading((prev) => ({...prev, loadingGetMembers: false}));
        }
    };

    const fetchRoles = async () => {
        try {
            setLoading((prev) => ({...prev, loadingGetRoles: true}));
            const {data} = await getEventRoles();
            const roles: MenuProps["items"] = [
                {
                    key: "all",
                    label: "Tất cả",
                    onClick: () => handleChangeMemberKey("all"),
                },
                ...data.map((item: { id: number; display_name: string }) => ({
                    key: item.id.toString(),
                    label: item.display_name,
                    onClick: () => handleChangeMemberKey(item.id.toString()),
                })),
            ];
            setEventRoleSelect(roles);
            setEventRoles(data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setLoading((prev) => ({...prev, loadingGetRoles: false}));
        }
    };
    const handleViewDetails = (record: Member) => () => {
        const selectedRole = eventRoles.find((role) => role.id === record.role.id);
        setRoleSelected(selectedRole);
        setUserSelected(record?.user);
        setShowAddMemberModal(true);
    };

    useEffect(() => {
        fetchMembers(filteredMemberKey, pageSize, currentPage);
        fetchRoles();
    }, [eventId]);

    const columns = [
        {
            title: "Tên thành viên",
            dataIndex: "name",
            key: "name",
            render: (_: unknown, record: Member) => (
                <span className="text-yellow-500">{record.user.username}</span>
            ),
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
            render: (_: unknown, record: Member) => (
                <span className="text-yellow-500">{record.role.display_name}</span>
            ),
        },
        {
            title: "Thành viên",
            dataIndex: "email",
            key: "email",
            render: (_: unknown, record: Member) => (
                <span className="text-yellow-500">{record.user.email}</span>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: unknown, record: Member) => (
                <Button
                    type="link"
                    className="text-green-500"
                    onClick={handleViewDetails(record)}
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ];
    const callbackModal = (data: Member, type: TypeCallbackModal) => {
        setMembers((prev) => {
            switch (type) {
                case TypeCallbackModal.ADD:
                    setTotalItems((prevTotal) => prevTotal + 1);
                    return [data, ...prev];
                case TypeCallbackModal.UPDATE:
                    return prev.map((member) =>
                        member.user.id === data.user.id ? data : member
                    );
                case TypeCallbackModal.DELETE:
                    setTotalItems((prevTotal) => prevTotal - 1);
                    return prev.filter((member) => member.user.id !== data);
                default:
                    return prev;
            }
        });
    };

    return (
        <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-purple-950 min-h-screen">
            <h1 className="text-xl font-semibold text-white mb-4">Thành viên</h1>

            <div className="flex justify-between items-center mb-4 gap-4">
                <Input.Search
                    placeholder="Tìm kiếm thành viên"
                    allowClear
                    onChange={(e) => setSearchValue(e.target.value)}
                    value={searchValue}
                    className="w-1/4 rounded-md"
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    onClick={() => setShowAddMemberModal(true)}
                    className="bg-green-600 hover:bg-green-700 border-none rounded-full px-4"
                >
                    Thêm thành viên
                </Button>
            </div>

            <div className="flex justify-end mb-4">
                <Dropdown menu={{items: eventRoleSelect}} trigger={["click"]}>
                    <Button
                        icon={<FilterOutlined/>}
                        className="border-green-500 text-white bg-transparent rounded-full"
                    >
                        {eventRoleSelect?.find((role) => role?.key === filteredMemberKey)?.label}
                    </Button>
                </Dropdown>
            </div>

            <Table
                loading={loading.loadingGetMembers}
                dataSource={members}
                columns={columns}
                pagination={false}
                bordered={false}
                className="rounded-lg overflow-hidden bg-transparent [&_.ant-table]:bg-transparent [&_.ant-table-thead>tr>th]:bg-gray-800 [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-tbody>tr>td]:bg-gray-700 [&_.ant-table-tbody>tr>td]:text-white"
                scroll={{x: "max-content"}}
            />

            <div className="flex justify-end mt-4">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalItems}
                    onChange={(page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                        fetchMembers(filteredMemberKey, size, page);
                    }}
                    className="[&_.ant-pagination-item]:bg-white [&_.ant-pagination-item-active]:bg-blue-500 [&_.ant-pagination-item]:text-black [&_.ant-pagination-item-active]:text-white [&_.ant-pagination-item]:border-gray-300"
                />
            </div>
            <AddMemberModal
                onClose={() => {
                    setShowAddMemberModal(false)
                    setRoleSelected(null);
                    setUserSelected(null);
                }}
                open={showAddMemberModal}
                roleOptions={eventRoles}
                eventId={eventId}
                callback={callbackModal}
                roleSelected={roleSelected}
                userSelected={userSelected}
            />
        </div>
    );
};

export default MemberList;