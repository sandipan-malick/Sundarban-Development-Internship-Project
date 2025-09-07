import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Dashboard/LandingPage";
import EcoTourismExplore from "./Tourism/EcoTourismExplore";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import OtpVerify from "./pages/OtpVerify";
import EmailSendOtp from "./pages/EmailSendOtp";
import ForgetOtpVerify from "./pages/ForgetOtpVerify";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./Admin/AdminDashboard";
import AllPlaces from "./Tourism/AllPlaces";
import Cart from "./Tourism/Cart";
import BookingHistory from "./Tourism/BookingHistory";
import AddressPage from "./Address/AddressPage";
import AdminBooking from "./Admin/AdminBooking";
import EducationAwareness from "./Education/EducationAwareness";
import AdminEducation from "./Admin/AdminEducation";
import AllProduct from "./Product/AllProduct";
import AdminProductDashboard from "./Admin/AdminProductDashboard";
import ProductCart from "./Product/ProductCart";
import ProductHistory from "./Product/ProductHistory";
import AdminOrder from "./Admin/AdminOrder";
import NotFound from "./NotFound";
import AdminLogin from "./Admin/AdminLogin";
import AdminDashboardPage from "./Admin/AdminDashboardPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ecoTourism" element={<EcoTourismExplore />} />
        <Route path="/registerPage" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/forgetPassword" element={<ForgetPassword />} />
        <Route path="/registration/email/otp-verify" element={<OtpVerify />} />
        <Route path="/register" element={<EmailSendOtp />} />
        <Route path="/forget/otp/verify" element={<ForgetOtpVerify />} />
        <Route path="/new/password" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/all-data" element={<AllPlaces/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/history" element={<BookingHistory/>}/>
        <Route path="/address" element={<AddressPage/>}/>
        <Route path="/admin-booking" element={<AdminBooking/>}/>
        <Route path="/education" element={<EducationAwareness/>}/>
        <Route path="/admin-education" element={<AdminEducation/>}/>
        <Route path="/all-product" element={<AllProduct/>}/>
        <Route path="/admin-product" element={<AdminProductDashboard/>}/>
        <Route path="/product-cart" element={<ProductCart/>}/>
        <Route path="/product-history" element={<ProductHistory/>}/>
        <Route path="/admin-order" element={<AdminOrder/>}/>
        <Route path="admin-login" element={<AdminLogin/>}/>
        <Route path="admin-dashboard-page" element={<AdminDashboardPage/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
