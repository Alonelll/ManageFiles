import { RouteObject } from "react-router-dom";
import FileUploader from "./components/fileuploader";

const routes: RouteObject[] = [
  {
    path: "fileuploader",
    element: FileUploader(),
  }];

export default routes;
