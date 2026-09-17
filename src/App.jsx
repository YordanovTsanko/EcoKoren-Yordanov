import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AccountGate from "./components/auth/AccountGate.jsx";
import AccountInactive from "./pages/AccountInactive.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Contacts from "./pages/Contacts.jsx";
import Promotions from "./pages/Promotions.jsx";
import NewProducts from "./pages/NewProducts.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Store from "./pages/Store.jsx";
import Auth from "./pages/Auth.jsx";
import Cart from "./pages/Cart.jsx";
import { fetchMe } from "./store/slices/usersSlice";

export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  // При презареждане на страницата: ако има запазен accessToken, зареждаме профила,
  // за да сме сигурни че токенът все още е валиден и да имаме данните на потребителя.
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMe());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <AccountGate>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/new-products" element={<NewProducts />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/store" element={<Store />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account-inactive" element={<AccountInactive />} />

          {/* Защитени route-и - изискват логнат потребител.
              Добави тук всеки нов route, който трябва да е само за логнати потребители,
              напр. /account, /orders, /checkout */}
          <Route element={<ProtectedRoute />}>
            {/* <Route path="/account" element={<Account />} /> */}
            {/* <Route path="/orders" element={<Orders />} /> */}
          </Route>

          {/* Пример за route само за admin: */}
          {/* <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route> */}
        </Route>
      </Routes>
    </AccountGate>
  );
}