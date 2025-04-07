import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { FiArrowRight, FiRepeat, FiClock, FiDollarSign, FiCreditCard, FiZap, FiAward } from 'react-icons/fi';
import { BsGem } from 'react-icons/bs';

//const PADDLE_VENDOR_ID = 29398; // test vendor id

const Billing = () => {
  const [credits, setCredits] = useState( Number(localStorage.getItem("remainingTokens")).toLocaleString() || null) ; // use local storage to initialize the credits
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();

  // product price items
  const items = [
    { 
      id: "pri_01jqwy9mp2aw1vmnq68yc9zvp0", 
      amount: 5, 
      label: "$5", 
      credits: "5,000 credits",
      calls: "≈ 1,000 AI generations"  // 500 次调用生成
    },
    { 
      id: "pri_01jqwy2gavsm89a15sezkaet24", 
      amount: 10, 
      label: "$10", 
      credits: "10,500 credits",
      calls: "≈ 2,100 AI generations" 
    },
    { 
      id: "pri_01jqwy8yntga8hrcyw3rrv384x", 
      amount: 20, 
      label: "$20", 
      credits: "22,000 credits",
      calls: "≈ 4,400 AI generations" 
    },
  ];

  const fetchBilling = async () => {
    try {
      const token = localStorage.getItem("supabaseToken");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/billing`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch billing data");

      const data = await response.json();
      setCredits(data.balance || 0);
      localStorage.setItem("remainingTokens", data.balance); // save to local storage
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("Error fetching billing data:", err);
    }
  };

  useEffect(() => {
      if (user) {
      fetchBilling();
    }
  }, [user]);
  

  const handleTopUp = (priceId) => {
    window.Paddle.Checkout.open({
      items: [{priceId: priceId, quantity: 1}],
      customer: {email: user.email}, 
      customData: {user_id: user.id, email: user.email}, // TODO: to pass the actual user_id and email to paddle
      successCallback: async () => {
        console.log("Payment succeeded");
        // after 2 seconds, request billing data again to update the balance
        await new Promise((res) => setTimeout(res, 2000));
        fetchBilling();
        toast.success("Top-up successful!");
      },
      closeCallback: () => {
        console.log("Checkout closed");
      },
    });
  };

  return (
    <div className="w-full mx-auto p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Billing</h1>
          <p className="text-gray-600">Manage your credits and subscription</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-secondary-dark to-secondary rounded-xl p-6 mb-8 text-white shadow-lg">
          <p className="text-sm font-medium text-green-100 mb-1">Available Credits</p>
          <div className="flex items-end mb-2">
            <p className="text-4xl font-bold mr-2">{credits.toLocaleString()}</p>
          </div>
          <p className="text-green-100 text-sm">Credits will be automatically deducted for usage</p>
        </div>

        {/* Top Up Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiCreditCard className="w-5 h-5 mr-2 text-green-600" />
            Purchase Credits
          </h3>
          <p className="text-gray-600 mb-6">Select a package to add to your balance</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                className="group border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-all duration-200 hover:shadow-md"
                onClick={() => handleTopUp(item.id)}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-gray-800 group-hover:text-green-600">{item.label}</span>
                  <span className="text text-green-600 font-bold mt-1">{item.credits}</span>
                  <span className="text-xs text-gray-500 mt-2">{item.calls}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiRepeat className="w-5 h-5 mr-2 text-green-600" />
              Recent Transactions
            </h3>
            <button className="text-gray-500 hover:text-gray-600 text-sm font-medium flex items-center">
              View all
              <FiArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="py-8 text-center">
              <FiClock className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-500">No transactions yet</p>
              <p className="text-xs text-gray-400">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(-3).reverse().map((txn, index) => ( // only show the last 3 transactions, and in reverse order
                <div
                  key={index}
                  className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-50 text-primary">
                      {txn.tx_type === 'top-up' ? (
                        <FiZap className="w-5 h-5" />
                      ) : (
                        <BsGem className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-800 capitalize">{txn.tx_type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(txn.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600"> {/* Always green */}
                      +${txn.amount.toLocaleString()} {/* Always show + */}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      +{txn.token_amount.toLocaleString()} credits
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="p-6 text-gray-400">
          <p>• 1 AI generation ≈ 2-10 credits (varies by model and length)</p>
          <p>• Different models cost different amounts of credits</p>
          <p>• Both input and output text consume credits</p>
          <p>• Credits never expire</p>
          <p>• All purchases are final</p>
        </div>
      </div>
    </div>
  );
};

export default Billing;