import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 

const ProtectedRoutes = () => {
  const {isAuthenticated, loading} = useAuth(); 
  console.log(isAuthenticated);

  return loading ? <div></div> : isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
