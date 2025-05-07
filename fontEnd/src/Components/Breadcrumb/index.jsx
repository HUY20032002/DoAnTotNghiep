import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ol className="list-reset flex">
        <li>
          <Link to="/" className="text-blue-600 hover:underline">
            Trang chủ
          </Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          const formatName = (n) => {
            return decodeURIComponent(n)
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
          };

          return (
            <li key={routeTo} className="mx-2 flex items-center">
              <span className="mx-1">/</span>
              {isLast ? (
                <span className="text-gray-500">{formatName(name)}</span>
              ) : (
                <Link to={routeTo} className="text-blue-600 hover:underline">
                  {formatName(name)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
