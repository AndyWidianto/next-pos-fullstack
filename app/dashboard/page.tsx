"use client";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, Package, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const salesData = [
  { date: '01 Mei', amount: 4200000 },
  { date: '02 Mei', amount: 3800000 },
  { date: '03 Mei', amount: 5100000 },
  { date: '04 Mei', amount: 4700000 },
  { date: '05 Mei', amount: 6200000 },
];

const topProducts = [
  { name: 'Kopi Arabica 250g', sold: 145, revenue: 2900000 },
  { name: 'Susu UHT Full Cream', sold: 230, revenue: 2300000 },
  { name: 'Roti Tawar Gandum', sold: 189, revenue: 1890000 },
  { name: 'Mie Instan Ayam Bawang', sold: 312, revenue: 1560000 },
];

const lowStockItems = [
  { name: 'Gula Pasir 1kg', stock: 8, minStock: 50 },
  { name: 'Tepung Terigu', stock: 12, minStock: 30 },
  { name: 'Minyak Goreng 2L', stock: 5, minStock: 25 },
];

export default function Dashboard() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Ringkasan penjualan dan performa toko</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Penjualan</h3>
          <p className="text-2xl font-bold text-gray-900">Rp 6.200.000</p>
          <p className="text-xs text-gray-500 mt-1">Hari ini</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +8.2%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Jumlah Transaksi</h3>
          <p className="text-2xl font-bold text-gray-900">342</p>
          <p className="text-xs text-gray-500 mt-1">Hari ini</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">856 item</span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Produk</h3>
          <p className="text-2xl font-bold text-gray-900">1.234</p>
          <p className="text-xs text-gray-500 mt-1">Dalam stok</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              Urgent
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Low Stock Alert</h3>
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-xs text-gray-500 mt-1">Butuh restock</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Grafik Penjualan</h2>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${period === p
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : 'Bulanan'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => {
                  if (typeof value !== 'number') return 'Rp 0';
                  return `Rp ${value.toLocaleString('id-ID')}`;
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Produk Terlaris</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sold} terjual</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {(product.revenue / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
            {lowStockItems.length}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lowStockItems.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="font-medium text-gray-900 mb-2">{item.name}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{item.stock}</p>
                  <p className="text-xs text-gray-600">Stok tersisa</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Min: {item.minStock}</p>
                  <button className="mt-1 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors">
                    Restock
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
