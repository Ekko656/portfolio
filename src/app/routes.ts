import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Projects } from "./components/Projects";
import { Resume } from "./components/Resume";
import { Coursework } from "./components/Coursework";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "projects", Component: Projects },
      { path: "resume", Component: Resume },
      { path: "coursework", Component: Coursework },
    ],
  },
]);
