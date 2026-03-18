import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const Layout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: '1', marginTop: 'var(--header-height)' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
