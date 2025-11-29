import { ListCollapseIcon, ListIcon, PlusSquareIcon, LayoutDashboard as LayoutDashboardIcon } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const AdminSidebar = () => {
    const user = {
        firstName: "admin ",
        lastName: "User",
        imageUrl: assets.profile,
    };

    const adminNavlinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
        { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },


        { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },


    ]



    return (
        <div className="h-[calc(100vh-64px)] flex flex-col items-center pt-8 w-full md:w-60 border-r border-gray-300/20 text-sm">
            <div className="flex flex-col items-center w-full px-4">
                <img 
                    className="h-14 w-14 rounded-full object-cover" 
                    src={user.imageUrl} 
                    alt="Admin Profile"
                />
                <p className="mt-2 text-base font-medium text-gray-800 dark:text-white">
                    {user.firstName}{user.lastName}
                </p>
            </div>
            <div className="w-full mt-6">
                {adminNavlinks.map((link, index) => (
                    <NavLink 
                        key={index}
                        to={link.path} end
                        className={({isActive}) => `relative flex items-center w-full py-3 px-6 transition-colors duration-200 ${
                          isActive 
                            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' 
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                        }`}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon className="w-5 h-5 mr-3" />
                                <span className="text-sm font-medium">{link.name}</span>
                                {isActive && (
                                    <span className="absolute right-0 w-1 h-8 bg-blue-600 rounded-l-lg"></span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}

            </div>
        </div>
    );
};

export default AdminSidebar;