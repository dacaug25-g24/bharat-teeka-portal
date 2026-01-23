import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer'; // Add this import
import AppRouter from './router/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <AppRouter />
        <Footer /> {/* Add Footer here */}
      </div>
    </BrowserRouter>
  );
}

export default App;