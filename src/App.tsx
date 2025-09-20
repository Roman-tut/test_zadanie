import { Routes, Route, Link } from 'react-router-dom';
import { ProductsPage } from './pages/ProductsPage';
import { PagesPage } from './pages/PagesPage';
import { PricePlansPage } from './pages/PricePlansPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex gap-4 p-4 bg-white shadows">
        <Link to="/products" className="text-blue-600 hover:underline">
          Products
        </Link>
        <Link to="/pricePlan" className="text-black-200 hover:underline">
          Price Plans
        </Link>
        <Link to="/pages" className="text-red-600 hover:underline">
          Pages
        </Link>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/pricePlan" element={<PricePlansPage />} />
          <Route path="/pages" element={<PagesPage />} />
          <Route path="*" element={<h2>Выбери страницу</h2>} />
        </Routes>
      </main>
    </div>
  );
}
