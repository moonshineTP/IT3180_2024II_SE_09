import { useState, useEffect } from 'react';
import { getPrivateAccount } from '../Service/AccountService';

const usePrivateAccount = () => {
  const [userPrivate, setUserPrivate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPrivateAccount();
        setUserPrivate(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return { userPrivate, loading, error };
};

export default usePrivateAccount;