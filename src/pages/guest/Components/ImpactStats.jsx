import React from 'react'

const ImpactStats = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md mt-8">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Your Impact</h3>
            <div className="space-y-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <span className="text-purple-600">👁️</span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">120+</p>
                        <p className="text-sm text-gray-500">successful life-saving surgeries</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <span className="text-green-600">🎓</span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">35,850+</p>
                        <p className="text-sm text-gray-500">children supported through education</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <span className="text-amber-600">🛠️</span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">10,620+</p>
                        <p className="text-sm text-gray-500"> individuals trained for sustainable livelihoods</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <span className="text-amber-600">🛠️</span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">20,250+</p>
                        <p className="text-sm text-gray-500">lives improved through community development initiatives</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImpactStats