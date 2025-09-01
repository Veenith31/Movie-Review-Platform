

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, deleteUser } from '../services/api';

interface AppUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleDeleteUser = async (userId: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await deleteUser(userId, token);
      // Refresh the list by filtering out the deleted user
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  if (loading) return <p>Loading user data...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard - User Management</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #555' }}>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Username</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '0.5rem' }}>{user.username}</td>
              <td style={{ padding: '0.5rem' }}>{user.email}</td>
              <td style={{ padding: '0.5rem' }}>{user.role}</td>
              <td style={{ padding: '0.5rem' }}>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  style={{ backgroundColor: '#e50914', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '4px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;