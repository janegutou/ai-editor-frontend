const Footer = () => {
    return (
      <footer className="bg-gray-100 text-gray-600 py-6 px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-start">

            {/* 左侧版权信息 */}
            <div className="text-sm">
            © 2025 <span className="font-semibold">@Writyzen</span>. All rights reserved.
            </div>
    
            {/* 右侧链接部分 - 两列*/}
            <div className="flex text-sm gap-32">
                <div className="flex flex-col text-right space-y-2">
                    <a href="/pricing" className="hover:text-gray-800">Pricing</a>
                    <a href="/refund-policy" className="hover:text-gray-800">Refund</a>
                </div>
                <div className="flex flex-col text-right space-y-2">
                    <a href="/privacy-policy" className="hover:text-gray-800">Privacy</a>
                    <a href="/terms-of-service" className="hover:text-gray-800">Terms of Service</a>
                    <a href="mailto:support@writyzen.com" className="hover:text-gray-800">Contact Us</a>
                </div>
            </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  