import {Menu} from "antd";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useEventId} from "@/src/hooks/useEventId";

const SidebarContent = ({collapsed, isDesktop, menuItems = [], isEventPath = false}: {
    collapsed: boolean,
    isDesktop: boolean,
    menuItems: any[],
    isEventPath: boolean
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const items = isEventPath ? menuItems.map((group) => ({
        type: "group",
        label: <span className="uppercase text-gray-400 text-xs">{group.label}</span>,
        children: group.children.map((item: any) => ({
            key: item.key,
            icon: item.icon,
            label: (
                <Link href={item?.href} className="font-medium">
                    {item.label}
                </Link>
            ),
        })),
    })) : [];
    const eventId = useEventId();
    const activeKey = isEventPath && menuItems
        .flatMap((group) => group.children)
        .find((item) => pathname.startsWith(item.href.replace(":id", eventId || "")))
        ?.key;
    return (
        <div className="h-full relative">
            <div className="flex items-center px-4 py-4 gap-2">
                <Link href="/organizer/events" className="flex items-center gap-2">
                <div
                    className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center text-white font-bold text-xs">
                    OC
                </div>
                {(!collapsed || !isDesktop) && (
                    <span className="text-green-500 font-bold text-base">
                    Organizer Center
                </span>
                )}
                </Link>
                
            </div>
            {
                isEventPath && <>
                    <Menu
                        mode="inline"
                        className="ant-menu-light  bg-transparent"
                        theme="dark"
                    >
                        <Menu.Item
                            onClick={() => {
                                router.back();
                            }}
                            key="event-management"
                            icon={<ArrowLeftOutlined style={{color: "#fff"}}/>}
                            className="pl-6"
                        >
                            <strong className="">Quản trị sự kiện</strong>
                        </Menu.Item>
                    </Menu>
                </>
            }
            <Menu
                mode="inline"
                selectedKeys={activeKey ? [activeKey] : []}
                items={isEventPath ? items : menuItems}
                className="bg-transparent border-none"
                theme="dark"
            />
        </div>
    );
}
export default SidebarContent;