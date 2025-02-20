import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import SignIn from "../auth/SignIn";
import Task from "../home/Task";

export const router = createBrowserRouter([
 {
  path:'/',
  element: <Layout></Layout>,
  children:[
   {
    path:'/',
    element:<SignIn></SignIn>
   },
   {
    path:'task-page',
    element:<Task></Task>
   }
  ]
 }
]);