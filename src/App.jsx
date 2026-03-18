import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';

import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Auth/Login';
import Profile from './pages/Profile/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProductEdit from './pages/Admin/AdminProductEdit';
import AdminOrderDetails from './pages/Admin/AdminOrderDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/products/new" element={<AdminProductEdit />} />
          <Route path="admin/products/:id/edit" element={<AdminProductEdit />} />
          <Route path="admin/orders/:id" element={<AdminOrderDetails />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
