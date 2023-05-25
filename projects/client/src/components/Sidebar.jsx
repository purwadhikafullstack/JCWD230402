import React from "react";
import {
  MdGroups2,
  MdCategory,
  MdWarehouse,
  MdShoppingCart,
  MdInventory,
} from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { adminlogoutAction } from "../reducers/admin";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const name = useSelector((state) => state.adminReducer.name);
  const roleId = useSelector((state) => state.adminReducer.roleId);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminlogoutBtn = () => {
    // localStorage.removeItem("gadgetwarehouse_adminlogin");
    dispatch(adminlogoutAction());
    // navigate("/", { replace: true });
  };

  React.useEffect(() => {
    if (roleId == null) {
      navigate("/", { replace: true });
    }
  }, [roleId])

  return (
    <div className="flex flex-col top-0 left-0 bg-bgglass h-screen border-r lg:w-[18vw]">
      <div className="lg:flex items-center hidden lg:justify-center h-14 border-b">
        <h1 className="text-[#1BFD9C] font-bold text-xs md:text-base">
          {name}
        </h1>
      </div>
      <div className="overflow-y-auto overflow-x-hidden flex-grow">
        <ul className="flex flex-col py-4 space-y-1">
          <li>
            <Link
              to="/usermanagement"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-white text-white hover:text-[#1BFD9C] border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <MdGroups2 className="text-xl" />
              </span>
              <span className="hidden lg:inline ml-2 text-sm tracking-wide truncate">
                User Management
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/product"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-white text-white hover:text-[#1BFD9C] border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  ></path>
                </svg>
              </span>
              <span className="hidden lg:inline ml-2 text-sm tracking-wide truncate">
                Product
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/category"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-white text-white hover:text-[#1BFD9C] border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <MdCategory className="text-xl" />
              </span>
              <span className="hidden lg:inline ml-2 text-sm tracking-wide truncate">
                Category
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/warehouse"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-white text-white hover:text-[#1BFD9C] border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <MdWarehouse />
              </span>
              <span className="hidden lg:inline ml-2 text-sm tracking-wide truncate">
                Warehouse
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/stockmanagement"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-white text-white hover:text-[#1BFD9C] border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <MdInventory />
              </span>
              <span className="hidden lg:inline ml-2 text-sm tracking-wide truncate">
                Stock Management
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/order"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-white text-white hover:text-[#1BFD9C] border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <MdShoppingCart />
              </span>
              <span className="hidden lg:inline ml-2 text-sm tracking-wide truncate">
                Order
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/stockreport"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-white text-white hover:text-[#1BFD9C] border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <TbReportSearch />
              </span>
              <span className="hidden lg:inline ml-2 text-sm tracking-wide truncate">
                Stock Report
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-white text-white hover:text-[#1BFD9C] border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </span>
              <span className="hidden lg:inline ml-2 text-sm tracking-wide truncate">
                Settings
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-white text-white hover:text-[#1BFD9C] border-l-4 border-transparent hover:border-indigo-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
              </span>
              <button
                type="button"
                onClick={adminlogoutBtn}
                className="hidden lg:inline ml-2 text-sm tracking-wide truncate"
              >
                Logout
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
