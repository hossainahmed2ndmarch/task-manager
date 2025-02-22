import React from "react";

const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-[#d7f2f5] text-[#084c52] p-4">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by TaskPilot Company Ltd.
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
