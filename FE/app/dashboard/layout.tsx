'use client';

import {Layout, Menu, Avatar, Drawer, Popover} from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import {useState, ReactNode} from 'react';
import {Grid} from 'antd';
import SidebarContent from "@/src/components/SidebarContent";
import PopoverMenuUser from "@/src/components/popover/PopoverMenuUser";
import {menuItemsDashboard} from "@/src/components/menuItems";

const {Header, Sider, Content} = Layout;
const {useBreakpoint} = Grid;

export default function DashboardLayout({children}: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const screens = useBreakpoint();
    const isDesktop = screens.md || screens.lg || screens.xl;
    const isTablet = screens.sm || screens.md;
    const isMobile = screens.xs;
    return (
        <Layout className="min-h-screen">
            {isDesktop && (
                <Sider
                    width={240}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                >
                    <SidebarContent collapsed={collapsed} isDesktop={isDesktop} menuItems={menuItemsDashboard}
                                    isEventPath={false}/>
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
                    <SidebarContent collapsed={collapsed} isDesktop={false} menuItems={menuItemsDashboard}
                                    isEventPath={false}/>
                </Drawer>
            )}

            <Layout>
                <Header className="bg-gray-800 h-16 px-0 flex items-center justify-end" style={{padding: 0}}>


                    <div className={`
                        flex items-center gap-4 justify-end min-w-0
                        ${isMobile ? 'px-4' : isTablet ? 'px-6' : 'px-6 min-w-[200px]'}
                    `}>
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


                {/* Content */}
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