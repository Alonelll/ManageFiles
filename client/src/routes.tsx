import { RouteObject } from "react-router-dom";
import FileUploader from "./components/fileuploader";
import home from "./components/home";

const routes: RouteObject[] = [
  {
    path: "fileuploader",
    element: FileUploader(),
  },
  {
    path: "#",
    element: home(),
  },
];

export default routes;
