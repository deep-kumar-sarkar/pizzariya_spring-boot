import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Outlets from './pages/Outlets';
import Cart from './pages/Cart';
import Review from './pages/Review';
import Orders from './pages/Orders';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <NavBar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/outlets" element={<Outlets />} />
              <Route path="/order" element={<Cart />} />
              <Route path="/review" element={<Review />} />
              <Route path="/history" element={<Orders />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
