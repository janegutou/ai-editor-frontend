import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaPen, FaMagic, FaCog, FaBolt, FaStar} from "react-icons/fa";
import { BiExpand } from "react-icons/bi";
import { RiEdit2Line, RiAiGenerate } from "react-icons/ri";


const LandingPage = () => {

  const navigate = useNavigate();

  const features = [
    {
      icon: <FaBolt/>,
      title: "Smart Expansion",
      desc: "Transform brief outlines into detailed content with AI augmentation.",
      color: "text-secondary"
    },
    {
      icon: <FaPen/>,
      title: "Style Rewriting",
      desc: "Revise and polish your text while preserving core meaning.",
      color: "text-secondary"
    },
    {
      icon: <FaCog/>,
      title: "Custom Prompts",
      desc: "Tailor writing with customizable prompts to generate text as per your style.",
      color: "text-secondary"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Input Your Text",
      desc: "Paste or type your initial content",
      icon: <FaPen className="text-[#27AE60]" />
    },
    {
      step: "2", 
      title: "Select AI Mode",
      desc: "Choose expansion, rewriting or free generation",
      icon: <FaCog className="text-[#27AE60]" />
    },
    {
      step: "3",
      title: "Get Enhanced Content",
      desc: "Receive AI-generated versions instantly",
      icon: <FaMagic className="text-[#27AE60]" />
    }
  ]

  return (
    <div className="bg-white text-gray-900 font-sans">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-secondary-dark to-secondary text-white py-24 px-4 text-center overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-300 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-blue-400 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F39C12] to-[#F4D03F]">
              AI-Powered Writing
            </span> 
            <br />At Your Fingertips
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Generate, refine, and perfect content 10x faster with our intelligent writing assistant
          </p>
          <div className="space-x-4">
            <button 
              className="bg-[#F39C12] hover:bg-[#E67E22] text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-[200px]"
              onClick={() => navigate('/editor')}
            >
              Start Free Trial
            </button>
            <button 
              className="border-2 border-white/80 hover:border-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold backdrop-blur-sm transition-all w-[200px]"
              onClick={() => navigate('/pricing')}
            >
              <span className="drop-shadow-sm">See Pricing</span>
            </button>
          </div>          
          {/* 自然元素装饰 */}
          <div className="mt-16 flex justify-center space-x-6 opacity-80">
            <FaLeaf className="w-8 h-8 animate-float" />
            <FaPen className="w-8 h-8 animate-float delay-100" />
            <FaMagic className="w-8 h-8 animate-float delay-200" />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* 极简标题 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4">AI Writing Featurs</h2>            
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Supercharge your writing process
            </p>
          </div>

          {/* 科技卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-lg border border-gray-200 hover:border-[#27AE60] transition-all 
                hover:shadow-[0_8px_24px_rgba(39,174,96,0.1)]" // 绿色系微光阴影
              >
                <div className={`text-3xl mb-5 ${feature.color} opacity-90`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  <span className="border-b-4 border-[#27AE60] pb-1">{feature.title}</span>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* 简洁标题 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4">
              Simple Process
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Get quality content in just three steps
            </p>
          </div>

          {/* 步骤容器 */}

          <div className="relative">
            {/* 时间线装饰 - 改用树叶分隔 */}
            <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-[#27AE60] to-[#F39C12] transform -translate-x-1/2"></div>
            
            {steps.map((step, i) => (
              <div key={i} className={`relative mb-16 ${i%2===0 ? 'md:pr-48' : 'md:pl-48'}`}>
                <div className="bg-[#F8F9F9] p-6 rounded-lg border border-[#D5F5E3] relative">
                  <div className="absolute -top-5 left-5 w-10 h-10 bg-[#27AE60] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#27AE60]">{step.title}</h3>
                  <p className="text-[#7F8C8D]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>



      {/* Testimonials Section 
      <section className="py-20 bg-[#F8F9F9]">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2C3E50] mb-4">
              Trusted by Writers Worldwide
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Join thousands of users enhancing their workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Content Director, TechCorp",
                quote: "Reduced our content production time by 40% while maintaining quality.",
                rating: 5
              },
              {
                name: "Markus R.",
                role: "Lead Developer",
                quote: "The most precise AI tool for technical documentation we've used.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex mb-4 text-[#27AE60]">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5" />
                  ))}
                </div>
                
                <p className="italic text-gray-700 mb-5">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#27AE60]/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-[#27AE60] font-medium">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 text-gray-500 text-sm">
            Average rating: 4.9/5 from 1,200+ reviews
          </div>
        </div>
      </section> */}

      {/* Final CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary-dark to-secondary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Boost Your Writing?
          </h2>
          <div className="space-x-4">
            <button 
              className="bg-[#F39C12] hover:bg-[#E67E22] text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => navigate('/signup')}
            >
              Get Started - It's Free
            </button>
            <button 
              className="border-2 border-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              onClick={() => navigate('/demo')}
            >
              Watch Demo
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
