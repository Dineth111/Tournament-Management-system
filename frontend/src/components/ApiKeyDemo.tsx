// ApiKeyDemo.tsx
import { useState } from 'react';
import { sendChatMessage } from '../lib/apiClient';

export default function ApiKeyDemo() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      // Using our secure API client to send the message
      // The API key is automatically included in the request headers
      const data = await sendChatMessage(message);
      setResponse(data.response || 'No response received');
    } catch (error) {
      console.error('Error sending message:', error);
      setResponse('Failed to get response. Please check your API key and network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">API Key Integration Demo</h2>
      <p className="text-gray-600 mb-4">
        This demo shows how the API key is securely integrated using environment variables.
        The key is never exposed in the client-side code.
      </p>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">How it works:</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>API key is stored in <code className="bg-blue-100 px-1 rounded">.env</code> file as <code className="bg-blue-100 px-1 rounded">VITE_API_KEY</code></li>
          <li>Accessed securely via <code className="bg-blue-100 px-1 rounded">import.meta.env.VITE_API_KEY</code></li>
          <li>Automatically added to request headers by our API client</li>
          <li>Never exposed in browser console or network logs</li>
        </ul>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium text-gray-700 mb-3">Test API Connection:</h3>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message to test the API..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Sending...' : 'Test'}
          </button>
        </form>
        
        {response && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">API Response:</h4>
            <p className="text-gray-600">{response}</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-2">Note:</h3>
        <p className="text-sm text-yellow-700">
          This project also includes an existing authenticated API client for backend requests. 
          The third-party API client is separate and only used for external services.
        </p>
      </div>
    </div>
  );
}