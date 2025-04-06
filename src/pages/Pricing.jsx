import { React } from 'react';
import { useNavigate } from "react-router-dom";



const Pricing = () => {

  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-gray-900 mt-2 mb-6">Flexible Pay-As-You-Go, Start Using the AI Writing Assistant Now!</h1>
        <p className=" text-gray-600 text-lg mt-4 mb-8">Recharge with credits and consume as needed. Simple and efficient!</p>
        
        {/* Recharge and Free Trial side by side */}
        <div className="mt-8 flex justify-center flex-wrap gap-10">
            {/* Free Trial Section */}
            <div className="bg-white shadow-lg rounded-2xl p-8 w-[320px] flex flex-col">
                <h2 className="text-2xl font-semibold text-gray-900 min-h-[64px]">Free Trial</h2>
                <p className="flex-grow mt-4 text-gray-600">Sign up and get 1,000 credits for free to experience our service!</p>
                
                <button 
                  className="mt-6 w-full py-3 px-6 bg-secondary text-white font-semibold rounded-lg hover:bg-primary transition duration-300 "
                  onClick={() => navigate('/login')}
                >
                Start Free
                </button>
            </div>

            {/* Recharge Section */}
            <div className="bg-white shadow-lg rounded-2xl p-8 w-[320px] flex flex-col">
                <h2 className="text-2xl font-semibold text-gray-900 min-h-[64px]">Recharge <br /> $1 = 1,000 credits</h2>
                <p className="flex-grow mt-4 text-gray-600">Ideal for users who frequently use the AI Assistant. Offers a reasonable price and flexible usage options.</p>
                <button 
                  className="mt-6 w-full py-3 px-6 bg-white border-4 border-secondary text-secondary font-bold shadow-md rounded-lg hover:bg-[#FFFF99] transition duration-300"
                  onClick={() => navigate('/billing')} 
                >
                Recharge Now
                </button>
            </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto text-left">
            <h3 className="text-3xl font-semibold text-gray-900 mb-6">FAQs</h3>
            <ul className="mt-4 space-y-4 text-gray-600">
                <li><strong>How to use credits?</strong> Each token represents a unit of usage. You can use credits for AI generating content. Credits are deducted as you use the service.</li>
                <li><strong>When do I receive the credits after recharge?</strong> Credits are added immediately after you complete your payment.</li>
                <li><strong>Can I get a refund for unused credits?</strong> Credits are non-refundable once recharged, so please ensure you only recharge the amount you need.</li>
                <li><strong>What happens if I run out of tokcreditsens?</strong> You can top-up anytime by purchasing more credits.</li>
                <li><strong>Is there a limit to how many credits I can recharge?</strong> There is no limit; you can recharge as many times as you want based on your usage.</li>
                <li><strong>How many credits does the free trial include?</strong> After signing up, you will receive 1000 free credits to experience our service.</li>
        </ul>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
