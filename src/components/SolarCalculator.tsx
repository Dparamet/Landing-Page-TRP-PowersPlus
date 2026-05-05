'use client'; // 🛑 สำคัญมาก: ต้องใส่บรรทัดนี้ เพราะเราใช้ State สำหรับแถบเลื่อน

import { useState } from 'react';

export default function SolarCalculator() {
  // ตั้งค่าเริ่มต้นที่ 600 หน่วย เหมือนใน Figma
  const [units, setUnits] = useState(600);

  // สูตรคำนวณเบื้องต้น (นายปรับสูตรทีหลังได้เลย)
  const systemSize = (units / 120).toFixed(2);
  const investmentOnGrid = (parseFloat(systemSize) * 35000).toLocaleString();
  const investmentHybrid = (parseFloat(systemSize) * 45000).toLocaleString(); // Hybrid จะแพงกว่าเพราะมีแบต

  return (
    <section id="calculator" className="py-20 bg-blue-50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-12">
          Smart Solar Calculator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* การ์ดที่ 1: On-Grid System */}
          <div className="bg-white rounded-2xl shadow-lg border-t-4 border-blue-600 p-8">
            <h3 className="text-2xl font-bold text-center text-blue-600 mb-6">On-Grid System</h3>
            
            <div className="mb-8">
              <p className="text-blue-600 font-semibold mb-2">Monthly Electricity Usage (Units)</p>
              <input 
                type="range" min="100" max="2000" step="50"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <p className="text-center text-orange-500 font-bold text-xl mt-4">{units} unit/month</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 space-y-4">
              <div className="flex justify-between text-gray-600 border-b pb-2">
                <span>Recommended System Size:</span>
                <span className="text-blue-600 font-bold">{systemSize} kWp</span>
              </div>
              <div className="flex justify-between text-gray-600 border-b pb-2">
                <span>Net Investment:</span>
                <span className="text-blue-600 font-bold">฿{investmentOnGrid}</span>
              </div>
              <div className="flex justify-between text-lg pt-2">
                <span className="font-bold text-gray-800">10-Year ROI:</span>
                <span className="text-blue-600 font-bold">210%</span>
              </div>
            </div>
          </div>

          {/* การ์ดที่ 2: Hybrid System */}
          <div className="bg-white rounded-2xl shadow-lg border-t-4 border-orange-500 p-8">
            <h3 className="text-2xl font-bold text-center text-blue-600 mb-6">Hybrid System</h3>
            
            <div className="mb-8">
              <p className="text-blue-600 font-semibold mb-2">Monthly Electricity Usage (Units)</p>
              <input 
                type="range" min="100" max="2000" step="50"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <p className="text-center text-orange-500 font-bold text-xl mt-4">{units} unit/month</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 space-y-4">
              <div className="flex justify-between text-gray-600 border-b pb-2">
                <span>Recommended System Size:</span>
                <span className="text-blue-600 font-bold">{systemSize} kWp</span>
              </div>
              <div className="flex justify-between text-gray-600 border-b pb-2">
                <span>Net Investment:</span>
                <span className="text-blue-600 font-bold">฿{investmentHybrid}</span>
              </div>
              <div className="flex justify-between text-lg pt-2">
                <span className="font-bold text-gray-800">10-Year ROI:</span>
                <span className="text-blue-600 font-bold">210%</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}