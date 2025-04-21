import React, { useState } from 'react';

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setStatus('error');
      return;
    }

    try {
      const token = localStorage.getItem('supabaseToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 h-screen">
      <h1 className="text-3xl font-bold text-center m-8">We Value Your Feedback!</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="message" className="block mb-2 font-medium">
            Your Feedback <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            rows="5"
            className="w-full border border-gray-300 rounded-md p-3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 font-medium">
            Your Email (Optional)
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 rounded-md p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Used to contact you if necessary"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-md transition duration-200"
        >
          Submit
        </button>

        {status === 'success' && (
          <p className="text-green-600 mt-4 text-center">Thanks for your feedback! We appreciate your input and will use it to improve our service.</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 mt-4 text-center">Submission failed. Please try again later.</p>
        )}
      </form>
    </div>
  );
};

export default Feedback;
