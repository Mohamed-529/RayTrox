import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HardwareProvider } from './context/HardwareContext';

createRoot(document.getElementById('root')!).render(
  <HardwareProvider>
    <App />
  </HardwareProvider>
);

