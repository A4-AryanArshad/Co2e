import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './i18n'; // 👈 import your i18n setup
import { useEffect } from 'react';
import { API_BASE_URL } from './config';
import { setupIPhoneDetection } from './utils/iphoneFix';

import Header from "./Home/Header";
import Login from "./Login/Login";
import Home from "./Home/Home";
import Signup from "./Signup/Signup";
import Trading from "./Trading/Trading";
import Plan from "./Plan/Plan";
import Services from "./Services/Services";
import Blog from "./Blog/Blog";
import Blog2 from "./Blog2/Blog2";
import Dashboard from "./Dashboard/Dashboard";
import NewsDashboard from "./NewsDashboard/NewsDashboard";
import BlogDashboard from "./BlogDashboard/BlogDashboard";
import AdminRoute from "./AdminRoute";
import NewsDetails from "./Blog2/NewsDetails";
import BlogDetails from "./Blog2/BlogDetails";
import { CartProvider } from "./CartContext";
import { LoadingProvider, useLoading } from "./LoadingContext";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminCourseUpload from './AdminCourseUpload';
import Courses from './Courses';
import AdminFeaturedListing from './AdminFeaturedListing';
import BuyCourses from './BuyCourses';
import DirectoryListing from './DirectoryListing';
import Contact from './Contact';
import AdminAddInstructor from './AdminAddInstructor';
import Slots from './Slots';
import GSAPProvider from './components/GSAPProvider';
import IPhoneTest from './components/IPhoneTest';
import ResetPassword from './ResetPassword';

function SuccessRedirect() {
  useEffect(() => {
    const packageName = localStorage.getItem('purchasedPackage');
    const bookingId = localStorage.getItem('bookingId');
    if (packageName) {
      fetch(`${API_BASE_URL}/api/stripe-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ packageName, bookingId })
      })
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          if (packageName.startsWith('course:')) {
            window.location.href = '/buy-courses';
          } else {
            window.location.href = '/login';
          }
        }, 2000);
      })
      .catch((err) => {
        setTimeout(() => {
          if (packageName.startsWith('course:')) {
            window.location.href = '/buy-courses';
          } else {
            window.location.href = '/login';
          }
        }, 2000);
      });
    } else {
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }

    // Booking confirmation logic
    const pendingBooking = localStorage.getItem('pendingBooking');
    if (pendingBooking) {
      fetch(`${API_BASE_URL}/api/booking/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pendingBooking
      }).then(() => {
        localStorage.removeItem('pendingBooking');
      });
    }
  }, []);
  return <div style={{textAlign:'center',marginTop:100}}><h1>Payment Successful!</h1><p>Redirecting...</p></div>;
}

function CancelRedirect() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = '/pricing';
    }, 3000);
  }, []);
  return (
    <div style={{textAlign:'center',marginTop:100}}>
      <h1>Payment Cancelled</h1>
      <p>Your payment was cancelled. Redirecting back to pricing...</p>
    </div>
  );
}

function AppContent() {
  const { i18n } = useTranslation();
  const { isLoading, loadingMessage } = useLoading();

  // Setup iPhone Safari detection on app startup
  useEffect(() => {
    // Only setup iPhone detection if not on login page
    const isLoginPage = window.location.pathname === '/login';
    if (!isLoginPage) {
      setupIPhoneDetection();
    }
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Router>
      {/* 🌍 Language Switcher UI */}
     
      <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/trade" element={<Trading />} />
        <Route path="/service" element={<Services />} />
        <Route path="/news" element={<Blog2 />} />
        <Route path="/pricing" element={<Plan />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/upload-courses" element={<AdminCourseUpload />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/admin/featured-listing" element={<AdminFeaturedListing />} />
          <Route path="/success" element={<SuccessRedirect />} />
          <Route path="/buy-courses" element={<BuyCourses />} />
          <Route path="/directory" element={<DirectoryListing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cancel" element={<CancelRedirect />} />
          <Route path="/iphone-test" element={<IPhoneTest />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/add-instructor" element={<AdminRoute><AdminAddInstructor /></AdminRoute>} />
          <Route path="/slots" element={<Slots />} />

        {/* Admin Routes */}
        <Route
          path="/Articles"
          element={<AdminRoute><Dashboard /></AdminRoute>}
        />
        <Route
          path="/AddNews"
          element={<AdminRoute><NewsDashboard /></AdminRoute>}
        />
        <Route
          path="/AddBlog"
          element={<AdminRoute><BlogDashboard /></AdminRoute>}
        />
      </Routes>
      </CartProvider>
      
      {/* Global Loading Spinner */}
      {isLoading && <LoadingSpinner message={loadingMessage} />}
    </Router>
  );
}

function App() {
  return (
    <GSAPProvider>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </GSAPProvider>
  );
}

export default App;
