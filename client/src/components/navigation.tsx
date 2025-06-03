import React from "react";
export const Navigation = () => {
  return (
    <div>
      <nav>
        <div>
          <ul className="flex justify-end space-x-10 w-full p-3">
            <li>
              <a href="home">Home</a>
            </li>
            <li>
              {/*ToDo: Route für FileUploader setzen*/}
              <a href="#">File Uploader</a>
            </li>
            <li>
              <a href="#">File Overview</a>
            </li>
            <li>
              <a href="#">Profil</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
