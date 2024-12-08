import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Top } from "./pages/Top/Top";
import { Index } from "./pages/Index/Index";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import App from "./App";
import ErrorPage from "./components/ErrorPage/ErrorPage";

const routerParams = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Top />} />
      <Route path="todos" element={<Index />} />
      <Route path="reset-password" element={<PasswordReset /> } />
      <Route path="error" element={<ErrorPage />} />
    </Route>
  )
)

export default routerParams;