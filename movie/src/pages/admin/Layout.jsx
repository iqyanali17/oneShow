import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";


const Layout = () => {
    return (
        <>
        <AdminNavbar/>
        <div className="flex h-[calc(100vh-64px)]">
            <AdminSidebar/>
            <div className="flex-1 px-4 py-10 overflow-y-auto">
                <Outlet />
            </div>
        </div>
        </>
    );
};
export default Layout