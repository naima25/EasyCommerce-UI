import { useAppContext } from '../context/AppContext'; // Updated import
import { Navigate } from 'react-router-dom';

  // checks the role and 
  const ProtectedRoute = ({ role, element, fallback = '/account' }) => {
    const {userRole, loading} = useAppContext(); 

    if (loading) {
      return <div>Loading...</div>
    }
    
    if (userRole === role) {
      return element;
    }
    return <Navigate to={fallback} replace />;
  };


export default ProtectedRoute;