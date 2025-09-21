import { Routes, Route, NavLink } from 'react-router-dom';
import { ProductsPage } from '../pages/ProductsPage';
import { PagesPage } from '../pages/PagesPage';
import { PricePlansPage } from '../pages/PricePlansPage';

export default function App() {
  const linkClass = (isActive: boolean) =>
    `px-3 py-2 rounded font-medium transition-colors ${
      isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex gap-2 p-4 bg-white shadow-md">
        <NavLink to="/products" className={({ isActive }) => linkClass(isActive)}>
          Products
        </NavLink>
        <NavLink to="/pricePlan" className={({ isActive }) => linkClass(isActive)}>
          Price Plans
        </NavLink>
        <NavLink to="/pages" className={({ isActive }) => linkClass(isActive)}>
          Pages
        </NavLink>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/pricePlan" element={<PricePlansPage />} />
          <Route path="/pages" element={<PagesPage />} />
          <Route path="*" element={<h2>Choose a page</h2>} />
        </Routes>
      </main>
    </div>
  );
}
