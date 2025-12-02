import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAppContext } from "../../context/appContext";
import Loading from "../../components/Loading";


const Layout = () => {
    const{isAdmin,fetchIsAdmin}=useAppContext()

    useEffect(()=>{
        fetchIsAdmin()
    },[])
    return isAdmin ? (
        <>
        <AdminNavbar/>
        <div className="flex h-[calc(100vh-64px)]">
            <AdminSidebar/>
            <div className="flex-1 px-4 py-10 overflow-y-auto">
                <Outlet />
            </div>
        </div>
        </>
    ):<Loading />
};
export default Layout