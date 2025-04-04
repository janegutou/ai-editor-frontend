import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";


//const PADDLE_VENDOR_ID = 29398; // test vendor id

const Billing = () => {
  const [credits, setCredits] = useState( localStorage.getItem("remainingTokens") || null) ; // use local storage to initialize the credits
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();

  // product price items
  const items = [
    { 
      id: "pri_01jqwy9mp2aw1vmnq68yc9zvp0", 
      amount: 5, 
      label: "$5", 
      credits: "500 credits",
      calls: "≈ 50k words" 
    },
    { 
      id: "pri_01jqwy2gavsm89a15sezkaet24", 
      amount: 10, 
      label: "$10", 
      credits: "1,050 credits",
      calls: "≈ 105k words" 
    },
    { 
      id: "pri_01jqwy8yntga8hrcyw3rrv384x", 
      amount: 20, 
      label: "$20", 
      credits: "2,200 credits",
      calls: "≈ 220k words" 
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
      customData: {user_id: user.id, email: user}, // TODO: to pass the actual user_id and email to paddle
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Purchase Credits</h3>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="font-medium">Credit Purchase</p>
                <p className="text-sm text-gray-500">Today, 10:30 AM</p>
              </div>
              <p className="text-green-600 font-medium">+1,000 credits</p>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="font-medium">API Usage</p>
                <p className="text-sm text-gray-500">Yesterday, 3:45 PM</p>
              </div>
              <p className="text-red-500 font-medium">-250 credits</p>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="font-medium">Credit Purchase</p>
                <p className="text-sm text-gray-500">May 28, 2024</p>
              </div>
              <p className="text-green-600 font-medium">+2,200 credits</p>
            </div>
          </div>
          <button className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium">
            View all transactions →
          </button>
        </div>
          
        {/* Recent Transactions option 2 */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-gray-400">No recent transactions</p>
            ) : (
              transactions.map((txn, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-gray-100"
                >
                  <div>
                    <p className="font-medium">{ txn.tx_type.toUpperCase() }</p>
                    <p className="text-sm text-gray-500">
                      {new Date(txn.created_at).toLocaleString()}
                    </p>
                  </div>
                  <p
                    className={
                      txn.tx_type === "top-up"
                        ? "text-green-600 font-medium"
                        : "text-red-500 font-medium"
                    }
                  >
                    {txn.tx_type === "top-up" ? "+" : "-"}
                    ${txn.amount.toLocaleString()}, {txn.token_amount.toLocaleString()} credits
                  </p>
                </div>
              ))
            )}
          </div>
          <button className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium">
            View all transactions →
          </button>
        </div>


        {/* Help Text */}
        <div className="p-6 text-gray-400">
          <p>• 1 credit ≈ 100 English words</p>
          <p>• Both input and output text consume credits</p>
          <p>• Credits never expire</p>
          <p>• All purchases are final</p>
        </div>
      </div>
    </div>
  );
};

export default Billing;