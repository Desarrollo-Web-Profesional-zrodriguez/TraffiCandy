export default function CheckoutProgressBar({ step }) {
  return (
    <div className="flex justify-between items-center mb-10 px-4 md:px-12 relative mt-4">
      <div className="absolute left-6 right-6 md:left-10 md:right-10 top-1/2 h-1 bg-white/10 -z-10 rounded-full overflow-hidden">
        <div className="h-full bg-[#FF006E] transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
      </div>
      
      {[1, 2, 3].map((num) => (
        <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step >= num ? 'bg-[#FF006E] text-white shadow-[0_0_15px_rgba(255,0,110,0.5)]' : 'bg-gray-800 text-gray-400'}`}>
          {num}
        </div>
      ))}
    </div>
  );
}
