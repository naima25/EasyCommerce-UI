import { useAppContext } from '../context/AppContext'; // Updated import
import { Navigate } from 'react-router-dom';

  
  const ProtectedRoute = ({ role, element, fallback = '/our-products' }) => {
    const {userRole, loading, isAuthenticated} = useAppContext(); 

    if (loading) {
      return <div>Loading...</div>
    }
    
    if (userRole === role && isAuthenticated) {
      return element;
    }
    return <Navigate to={fallback} replace />;
  };


export default ProtectedRoute;