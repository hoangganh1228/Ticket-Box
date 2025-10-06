'use client';

import {Layout, Button, Avatar, Drawer, Popover} from 'antd';
import {
    UserOutlined,
    PlusOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import {useState, ReactNode} from 'react';
import {Grid} from 'antd';
import Link from "next/link";
import SidebarContent from "@/src/components/SidebarContent";
import PopoverMenuUser from "@/src/components/popover/PopoverMenuUser";
import {usePathname} from "next/navigation";
import {menuItems, MenuItemsEventDetail} from "@/src/components/menuItems";

const {Header, Sider, Content} = Layout;
const {useBreakpoint} = Grid;

export default function AdminLayout({children}: { children: ReactNode }) {
    const pathname = usePathname();
    const isEventPath = /^\/organizer\/events\/[^/]+(\/.*)?$/.test(pathname);

    const [collapsed, setCollapsed] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const screens = useBreakpoint();
    const isDesktop = screens.md || screens.lg || screens.xl;
    const isTablet = screens.sm || screens.md;
    const isMobile = screens.xs;
    const items = isEventPath ? MenuItemsEventDetail() : menuItems;

    return (
        <Layout className="min-h-screen">
            {isDesktop && (
                <Sider
                    width={240}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                >
                    <SidebarContent isDesktop={isDesktop} menuItems={items}
                                    collapsed={collapsed} isEventPath={isEventPath}/>
                </Sider>
            )}

            {!isDesktop && (
                <Drawer
                    title={null}
                    placement="left"
                    closable={false}
                    onClose={() => setMobileDrawerOpen(false)}
                    open={mobileDrawerOpen}
                    styles={{
                        body: {
                            padding: 0,
                            background: 'linear-gradient(180deg, #0C1C15 0%, #1B0F1E 100%)',
                        }
                    }}
                    width={240}
                >
                    <SidebarContent isDesktop={false} menuItems={items}
                                    collapsed={collapsed} isEventPath={isEventPath}/>
                </Drawer>
            )}
            <Layout>
                <Header className="bg-gray-800 h-16 px-0 flex items-center justify-between" style={{padding: 0}}>
                    <div className={`
                        flex items-center gap-4 min-w-0
                        ${isMobile ? 'px-4' : isTablet ? 'px-6' : 'px-6 min-w-[200px]'}
                    `}>
                        {!isDesktop && (
                            <Button
                                type="text"
                                onClick={() => setMobileDrawerOpen(true)}
                                className="text-white"
                            >
                                <MenuOutlined style={{color: "#fff"}}/>
                            </Button>
                        )}
                        <h1 className={`
                            font-bold text-2xl text-white truncate w-[450px]
                            ${isMobile ? 'text-sm' : 'text-2xl'}
                        `}>
                            Sự kiện của tôi
                        </h1>
                    </div>


                    <div className={`
                        flex items-center gap-4 justify-end min-w-0
                        ${isMobile ? 'px-4' : isTablet ? 'px-6' : 'px-6 min-w-[200px]'}
                    `}>
                        <Link href="/organizer/create-event?step=info">
                            <Button
                                type="primary"
                                icon={<PlusOutlined/>}
                                className={`
                                bg-green-500 hover:bg-green-600 border-none rounded-full font-bold
                                ${isMobile ? 'h-8 px-3 text-xs' : isTablet ? 'h-9 px-4 text-sm' : 'h-10 px-6'}
                                `}
                            >
                                {isMobile ? 'Tạo' : 'Tạo sự kiện'}
                            </Button>
                        </Link>
                        <Popover
                            content={<PopoverMenuUser/>}
                            trigger="click"
                            placement="bottomRight"
                        >
                            <div className="flex items-center gap-2 cursor-pointer">
                                <Avatar size="large" icon={<UserOutlined/>} className="bg-gray-600"/>
                            </div>
                        </Popover>
                    </div>
                </Header>


                <Content
                    className={'min-h-0 flex-1 bg-gradient-to-b from-black via-gray-900 to-purple-950'}
                    style={{
                        minHeight: !isDesktop ? 'calc(100vh - 140px)' : 'calc(100vh - 64px)',
                    }}
                >
                    <div
                        className={`
                        flex h-full w-full
                        ${isMobile ? 'min-h-[250px]' : isTablet ? 'min-h-[350px]' : 'min-h-[500px]'}
                        `}
                    >
                        <div className="flex-1 w-full text-white">
                            {children}
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}