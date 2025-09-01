
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { token, logout, user } = useAuth(); 

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link to="/" className={styles.logo}>MovieFlix</Link>
      </div>
      <div className={styles.navRight}>
        {token ? (
          // This content shows only when logged in
          <>
            {/* Conditionally render the Admin link */}
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className={styles.navLink}>Admin</Link>
            )}
            <Link to="/profile" className={styles.navLink}>Profile</Link>
            <button onClick={logout} className={styles.navButton}>
              Logout
            </button>
          </>
        ) : (
          // This content shows ONLY when logged out
          <>
            <Link to="/login" className={styles.navLink}>Login</Link>
            <Link to="/register" className={styles.navButton}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;