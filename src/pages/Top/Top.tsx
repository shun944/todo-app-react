import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginForm from "../../components/LoginForm/LoginForm";
export const Top= () => {
  return (
    <div>
      <h1>Top page</h1>
      <LoginForm />
      <li><Link to="/">Home</Link></li>
      <li><Link to="/test">Test</Link></li>
    </div>
  );
};