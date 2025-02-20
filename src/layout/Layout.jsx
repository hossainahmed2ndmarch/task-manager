import React from "react";
import { Outlet } from "react-router";
import NavBar from "../shared/NavBar";
import Footer from "../shared/Footer";

const Layout = () => {
  return (
    <div>
      <NavBar></NavBar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default Layout;
