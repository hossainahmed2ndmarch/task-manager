import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import SignIn from "../auth/SignIn";
import Task from "../home/Task";
import NotFound from "../NotFound";
import PrivateRoute from "./PrivateRoute";
import SignUp from "../auth/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    errorElement: <NotFound></NotFound>,
    children: [
      {
        path: "/",
        element: <SignIn></SignIn>,
      },
      {
        path: "/sign-up",
        element: <SignUp></SignUp>,
      },
      {
        path: "task-page",
        element: (
          <PrivateRoute>
            <Task></Task>
          </PrivateRoute>
        ),
      },
    ],
  },
]);
