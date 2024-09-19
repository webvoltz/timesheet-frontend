import type { MenuProps } from "antd";
import { Avatar, Dropdown, Menu, Typography } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { CloseIcon, Hamburger } from "../../assets/svg-images";
import { ROUTE_CONST } from "../../constants/route-constant";
import { RootState } from "../../store";
import { capitalizeFirstLetter } from "../../utils/common-functions";
import { clearLocalStorage } from "../../utils/local-storage";

const Header = () => {
    const { data } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const { Text } = Typography;
    const [menuVisible, setMenuVisible] = useState(false);

    const linkClasses = "text-black text-base md:text-black custom-hover border-b-2 border-transparent";
    const handleSignOut = () => {
        clearLocalStorage();
        navigate(`${ROUTE_CONST.AUTH.LOGIN}`);
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const items: MenuProps["items"] = [
        {
            key: "0",
            label: (
                <div>
                    <Text>{data?.viewer?.name ?? "Aliza Testing"}</Text> <br />
                    <Text ellipsis>{data?.viewer?.email ?? "aliza@gmail.com"}</Text>
                </div>
            ),
        },
        {
            type: "divider",
        },
        {
            label: "Sign out",
            onClick: handleSignOut,
            key: "2",
        },
    ];

    const navItems: MenuProps["items"] = [
        {
            label: (
                <NavLink className={linkClasses} to={ROUTE_CONST.INITIAL_ROUTE}>
                    {" "}
                    Today’s Timesheet
                </NavLink>
            ),
            key: "today-timesheet",
            title: "",
        },
    ];

    return (
        <div className="border-b">
            <div className="  my-0 fixed left-0 top-0 bg-white z-10 right-0 m-auto border-b">
                <div className="container mx-auto">
                    <nav
                        className="bg-white px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4 rounded flex items-center gap-2"
                        style={{ display: "Flex" }}
                    >
                        <a className="flex items-center" href="#">
                            <img src={logo} alt="Antd React Logo" className="mr-3 h-6 sm:h-9" />
                        </a>
                        <div
                            className={`mx-auto flex flex-wrap items-center justify-between ${
                                menuVisible ? "menuVisible" : ""
                            }`}
                        >
                            <div
                                className={`mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium`}
                            >
                                <Menu
                                    className="main-menu flex"
                                    mode="inline"
                                    inlineCollapsed={menuVisible}
                                    items={navItems}
                                />
                            </div>
                        </div>
                        <div className="flex md:order-2 gap-4 ">
                            <div className="space-y-1 text-sm dark:text-white avtar-profile">
                                <div className="text-[#101828] font-semibold ">
                                    {capitalizeFirstLetter(data?.viewer?.name ?? "aliza testing") || ""}
                                </div>
                                <div className="text-sm text-[#667085] mt-0">
                                    {data?.viewer?.userInformation.designation ?? "Designation"}
                                </div>
                            </div>
                            <Dropdown menu={{ items }} trigger={["click"]}>
                                <a
                                    className="ant-dropdown-link"
                                    onClick={(e) => e.preventDefault()}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    {data?.viewer?.avatar?.url ? (
                                        <Avatar size={50} src={data?.viewer?.avatar?.url} />
                                    ) : (
                                        <Avatar
                                            style={{
                                                verticalAlign: "middle",
                                            }}
                                            size={50}
                                        >
                                            {data?.viewer?.name?.charAt(0).toUpperCase() ?? "AZ"}
                                        </Avatar>
                                    )}
                                </a>
                            </Dropdown>
                        </div>
                        <button className="hamburger" onClick={toggleMenu}>
                            {menuVisible ? CloseIcon : Hamburger}
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Header;
