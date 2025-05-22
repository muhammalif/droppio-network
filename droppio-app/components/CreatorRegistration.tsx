import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function CreatorRegistration() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/creator/register', {
        method: 'POST',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      // Handle successful registration
      alert('Successfully registered as creator!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        Please connect your wallet to register as a creator
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Register as Creator</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Register as Creator'}
      </button>
    </div>
  );
} 