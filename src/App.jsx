import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import Contacts from './pages/Contacts.jsx'
import Promotions from './pages/Promotions.jsx'
import NewProducts from './pages/NewProducts.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Store from './pages/Store.jsx'
import Auth from './pages/Auth.jsx'
import Cart from './pages/Cart.jsx'

export default function App() {
  return (
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
      </Route>
    </Routes>
  )
}
