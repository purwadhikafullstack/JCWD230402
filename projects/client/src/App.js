import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { Footer, Navbar, Sidebar } from "./components";
import {
  Home,
  Register,
  RequestPassword,
  ResetPassword,
  Verification,
  Login,
  Dashboard,
  AdminLogin,
  PageNotFound,
  Warehouse,
  UserManagement,
  Category,
  AllProduct,
  ProductPage,
  Product,
} from "./pages";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { API_URL } from "./helper";
import { loginAction } from "./reducers/auth";
import { adminloginAction } from "./reducers/admin";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
      setMessage(data?.message || "");
    })();
  }, []);

  const keepLogin = async () => {
    try {
      let token = localStorage.getItem("Gadgetwarehouse_login");
      if (token) {
        let res = await axios.get(`${API_URL}/auth/customer/keep-login`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response from login", res.data);
        localStorage.setItem("Gadgetwarehouse_login", res.data.token);
        dispatch(loginAction(res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const adminkeepLogin = async () => {
    try {
      let token = localStorage.getItem("gadgetwarehouse_adminlogin");
      if (token) {
        let res = await axios.get(`${API_URL}/auth/admin/keep-adminlogin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log('response from adminkeeplogin', res.data)
        localStorage.setItem("gadgetwarehouse_adminlogin", res.data.token);
        dispatch(adminloginAction(res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const roleId = useSelector((state) => state.adminReducer.roleId);
  const statusId = useSelector((state) => state.authReducer.statusId);

  useEffect(() => {
    keepLogin();
    adminkeepLogin();
  }, []);

  return (
    <AnimatePresence>
      <div className=" w-screen h-auto flex flex-col bg-zinc-900">
        {
          // ini admin
          roleId ? (
            <div className="bg-bgglass flex w-full">
              <Sidebar />
              <main className="mt-2 md:mt-2 px-4 md:px-16 w-full">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/warehouse" element={<Warehouse />} />
                  <Route path="/usermanagement" element={<UserManagement />} />
                  <Route path="/category" element={<Category />} />
                  <Route path="*" element={<PageNotFound />} />
                  <Route path="/product" element={<Product />} />
                </Routes>
              </main>
            </div>
          ) : // ini customer
          statusId ? (
            <div>
              {" "}
              <Navbar />
              <main className="mt-2 md:mt-2 px-2 md:px-10 w-full">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/product/all-products"
                    element={<AllProduct />}
                  />
                  <Route
                    path="/product/:productname"
                    element={<ProductPage />}
                  />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/request" element={<RequestPassword />} />
                  <Route path="/reset/:token" element={<ResetPassword />} />
                  <Route path="/verify/:token" element={<Verification />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          ) : (
            // ini untuk yang belum login
            <div>
              {" "}
              <Navbar />
              <main className="mt-2 md:mt-2 px-2 md:px-10 w-full">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/product/all-products"
                    element={<AllProduct />}
                  />
                  <Route
                    path="/product/:productname"
                    element={<ProductPage />}
                  />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<PageNotFound />} />
                  <Route path="/admin" element={<AdminLogin />} />
                </Routes>
              </main>
              <Footer />
            </div>
          )
        }
      </div>
    </AnimatePresence>
  );
}

export default App;
