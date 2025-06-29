import React from 'react'

const ImpactStats = () => {
    return (
        <div className="bg-white p-3 rounded-xl shadow-lg mt-5">
            <h3 className="font-bold text-xl mb-3 text-gray-800 text-center">Your Impact</h3>
            <div className="space-y-2 p-2">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                        <span className="text-purple-600 text-base">👁️</span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">120+</p>
                        <p className="text-xs text-gray-500 leading-tight">successful life-saving surgeries</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <span className="text-green-600 text-base">🎓</span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">35,850+</p>
                        <p className="text-xs text-gray-500 leading-tight">children supported through education</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <span className="text-amber-600 text-base">🛠️</span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">10,620+</p>
                        <p className="text-xs text-gray-500 leading-tight">individuals trained for sustainable livelihoods</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <span className="text-amber-600 text-base">🛠️</span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">20,250+</p>
                        <p className="text-xs text-gray-500 leading-tight">lives improved through community development initiatives</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImpactStats