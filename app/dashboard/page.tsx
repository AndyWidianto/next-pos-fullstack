"use client";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, Package, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import useAxios from '@/lib/axios.service';
import { toast } from 'sonner';
import { BestSeller, LowStock } from '@/lib/types/product';

const salesData = [
  { date: '01 Mei', amount: 4200000 },
  { date: '02 Mei', amount: 3800000 },
  { date: '03 Mei', amount: 5100000 },
  { date: '04 Mei', amount: 4700000 },
  { date: '05 Mei', amount: 6200000 },
];

export default function Dashboard() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { apiPrivate } = useAxios();
  const [productLowStock, setProductLowStock] = useState<LowStock[]>([]);
  const [productBestSeller, setProductBestSeller] = useState<BestSeller[]>([]);
  const [stats, setStats] = useState({
    income: 0,
    totalTransaction: 0,
    totalProduct: 0,
    productStockSmall: 0,
  });

  const statTransaction = async () => {
    try {
      const res = await apiPrivate.get(`/transactions/stats`);
      console.log(res.data)
      const data = res.data;
      setStats(prev => ({
        ...prev,
        income: Number(data.income),
        totalTransaction: data.total
      }));
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Gagal menagmbil stat transaction.";
      toast.error(errorMessage);
    }
  }
    const statProduct = async () => {
    try {
      const res = await apiPrivate.get(`/products/stats`);
      console.log(res.data)
      const data = res.data;
      setStats(prev => ({
        ...prev,
        totalProduct: data.total,
        productStockSmall: data.alerts,
      }));
      setProductBestSeller(data.bestSeller);
      setProductLowStock(data.lowStock);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Gagal menagmbil stat products.";
      toast.error(errorMessage);
    }
  }
  const statsData = [
    {
      title: "Total Penjualan",
      value: `Rp.${stats.income.toLocaleString("id-ID")}`,
      description: "Hari ini",
      icon: DollarSign,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+12.5%",
      trendIcon: TrendingUp,
      trendColor: "text-green-600",
      isUrgent: false,
    },
    {
      title: "Jumlah Transaksi",
      value: stats.totalTransaction.toString(),
      description: "Hari ini",
      icon: ShoppingBag,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+8.2%",
      trendIcon: TrendingUp,
      trendColor: "text-green-600",
      isUrgent: false,
    },
    {
      title: "Total Produk",
      value: stats.totalProduct.toString(),
      description: "Dalam stok",
      icon: Package,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      badgeText: "856 item",
      isUrgent: false,
    },
    {
      title: "Low Stock Alert",
      value: stats.productStockSmall.toString(),
      description: "Butuh restock",
      icon: AlertTriangle,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      isUrgent: true,
      badgeText: "Urgent",
    },
  ];
  useEffect(() => {
    statTransaction();
    statProduct();
  }, [])

  return (
    <div className="p-2 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Ringkasan penjualan dan performa toko</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>

              {/* Render Trend atau Badge */}
              {stat.trend ? (
                <span className={`text-sm font-medium ${stat.trendColor} flex items-center gap-1`}>
                  {stat.trendIcon && <stat.trendIcon className="w-4 h-4" />}
                  {stat.trend}
                </span>
              ) : stat.badgeText ? (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${stat.isUrgent ? 'bg-red-100 text-red-700' : 'text-gray-600'
                  }`}>
                  {stat.badgeText}
                </span>
              ) : null}
            </div>

            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </div>
        ))}
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
            {productBestSeller.map((product, index) => (
              <div key={product.id} className="flex items-start gap-3">
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
            {productLowStock.length}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productLowStock.map((item, index) => (
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
