"use client";

import { Search, Barcode, CreditCard, DollarSign, QrCode, Pause, Printer, Trash2, Plus, Minus, ShoppingCart, ChevronUp } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import usePos from '@/app/hooks/postHook';
import { AnimateMotion } from '@/app/components/MotionModal';
import ProductScanner from '@/app/components/ProductScanner';


export default function POSCashier() {
  const {
    products,
    searchQuery,
    setSearchQuery,
    addToCart,
    isCartOpen,
    setIsCartOpen,
    cart,
    grandTotal,
    removeFromCart,
    updateQuantity,
    setShowPaymentModal,
    showPaymentModal,
    showReceiptModal,
    total,
    tax,
    setCart,
    handleHoldTransaction,
    setPaymentMethod,
    handlePayment,
    paymentMethod,
    calculateChange,
    cashReceived,
    setCashReceived,
    handlePrintReceipt,
    setShowReceiptModal,
    setShowCamera,
    showCamera,
    findProduct
  } = usePos(); 

  return (
    <div className="h-screen flex flex-col lg:grid lg:grid-cols-[1fr,40px] bg-gray-50 overflow-hidden">
      <AnimateMotion isOpen={showCamera} onClose={() => setShowCamera(false)}>
        <ProductScanner onResult={(result) => findProduct(result)} />
      </AnimateMotion>

      {/* LEFT: Product Selection */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header/Search Area */}
        <div className="p-4 lg:p-6 bg-white border-b lg:bg-transparent lg:border-none">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari produk atau scan barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 lg:py-4 text-base lg:text-lg border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm transition-all outline-none"
              autoFocus
            />
            <button onClick={() => setShowCamera(true)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <Barcode className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 lg:pt-0 pb-32 lg:pb-6">
          {/* Quick Search Results */}
          {searchQuery && (
            <div className="mb-6 bg-white rounded-2xl p-2 border border-blue-100 shadow-lg animate-in fade-in slide-in-from-top-2">
              {/* ... (isi filtered products sama) */}
            </div>
          )}

          {/* Grid Produk - Responsive cols */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white rounded-2xl p-3 lg:p-4 border border-gray-100 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left flex flex-col group active:scale-95"
              >
                <div className="aspect-square bg-blue-50 rounded-xl mb-3 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <span className="text-3xl lg:text-4xl transform group-hover:scale-110 transition-transform">📦</span>
                </div>
                <h3 className="font-bold text-gray-800 text-xs lg:text-sm mb-1 line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                <p className="text-[10px] lg:text-xs text-gray-400 mb-2 font-mono uppercase tracking-wider">{product.sku}</p>
                <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-50">
                  <p className="font-black text-blue-600 text-sm lg:text-base">
                    Rp {(Number(product.price) / 1000).toFixed(0)}K
                  </p>
                  <span className="hidden sm:inline text-[10px] text-gray-400">Stok: {product.stock}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Cart & Checkout (Desktop: Sidebar, Mobile: Drawer) */}
      <div className={`
        fixed inset-x-0 bottom-0 z-40 bg-white border-t border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-[0_-10px_40px_rgba(0,0,0,0.1)]
        ${isCartOpen ? 'h-[85vh] lg:left-64' : 'h-20 lg:left-64'}
      `}>
        {/* Mobile Header / Toggle */}
        <div
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="p-4 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Total Belanja</p>
              <p className="text-xs text-blue-600 font-bold">Rp {grandTotal.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <ChevronUp className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isCartOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900">Keranjang</h2>
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {cart.length} Item
            </span>
          </div>
        </div>

        {/* Cart Items Area */}
        <div className={`flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 ${!isCartOpen && 'hidden lg:block'}`}>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40 py-10 lg:py-0">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <p className="font-bold uppercase tracking-widest text-xs">Belum ada item</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">{item.name}</h3>
                    <p className="text-xs text-blue-500 font-semibold mt-1">
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden p-1 shadow-sm">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-gray-50 transition-colors text-blue-600"><Minus className="w-4 h-4" /></button>
                    <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-gray-50 transition-colors text-blue-600"><Plus className="w-4 h-4" /></button>
                  </div>
                  <p className="font-black text-gray-900 text-sm italic">
                    Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Summary & Actions */}
        <div className={`p-4 lg:p-6 bg-white border-t border-gray-100 space-y-4 ${!isCartOpen && 'hidden lg:block'}`}>
          <div className="space-y-2">
            <div className="flex justify-between text-xs lg:text-sm">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="font-bold text-gray-800">Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-xs lg:text-sm">
              <span className="text-gray-500 font-medium">Pajak (10%)</span>
              <span className="font-bold text-gray-800">Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-lg lg:text-xl font-black pt-3 border-t border-dashed border-gray-200">
              <span className="text-gray-900 italic">TOTAL</span>
              <span className="text-blue-600 underline decoration-blue-200 decoration-4">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0}
              className="col-span-2 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              BAYAR SEKARANG
            </button>
            <button onClick={handleHoldTransaction} className="py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 flex items-center justify-center gap-2 border border-gray-100"><Pause className="w-4 h-4" /> HOLD</button>
            <button onClick={() => setCart([])} className="py-3 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-100 flex items-center justify-center gap-2 border border-red-50"><Trash2 className="w-4 h-4" /> RESET</button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog.Root open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md z-50 shadow-xl">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-6">
              Pilih Metode Pembayaran
            </Dialog.Title>

            {/* Payment Methods */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'cash'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium text-gray-900">Tunai</p>
              </button>
              <button
                onClick={() => setPaymentMethod('qris')}
                className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'qris'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <QrCode className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium text-gray-900">QRIS</p>
              </button>
              <button
                onClick={() => setPaymentMethod('transfer')}
                className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'transfer'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium text-gray-900">Transfer</p>
              </button>
            </div>

            {/* Total */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {grandTotal.toLocaleString('id-ID')}
              </p>
            </div>

            {/* Cash Input */}
            {paymentMethod === 'cash' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uang Diterima
                </label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {cashReceived && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Kembalian</p>
                    <p className={`text-xl font-bold ${calculateChange() < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                      Rp {Math.abs(calculateChange()).toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Dialog.Close asChild>
                <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Batal
                </button>
              </Dialog.Close>
              <button
                onClick={handlePayment}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proses Pembayaran
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Receipt Modal */}
      <Dialog.Root open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md z-50 shadow-xl">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-6 text-center">
              Struk Pembayaran
            </Dialog.Title>

            {/* Receipt Preview */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 font-mono text-sm">
              <div className="text-center mb-4 border-b border-gray-300 pb-4">
                <h3 className="font-bold text-lg">ModernPOS</h3>
                <p className="text-xs text-gray-600">Toko Pusat</p>
                <p className="text-xs text-gray-600">2026-05-05 14:32</p>
              </div>

              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between">
                      <span>{item.name}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-xs">
                      <span>{item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}</span>
                      <span>Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-300 pt-3 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (10%)</span>
                  <span>Rp {tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-2">
                  <span>Total</span>
                  <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>

                {paymentMethod === 'cash' && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span>Tunai</span>
                      <span>Rp {parseFloat(cashReceived).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Kembalian</span>
                      <span>Rp {calculateChange().toLocaleString('id-ID')}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center mt-4 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-600">Terima kasih atas kunjungan Anda!</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Cetak Struk
              </button>
              <Dialog.Close asChild>
                <button
                  onClick={() => {
                    setCart([]);
                    setCashReceived('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Selesai
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
