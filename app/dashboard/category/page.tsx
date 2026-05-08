"use client";


import { Search, Filter, Download, Upload, Plus, Edit2, History, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import useCategory from '@/app/hooks/categoryHook';
import { AnimateMotion } from '@/app/components/MotionModal';
import { FormModal } from '@/app/components/FormModal';
import { InputText, SelectIcon, TextArea } from '@/app/components/Inputs';


const auditLog = [
    { time: '2026-05-05 09:45', action: 'Stock Adjustment', user: 'Admin', item: 'Mie Instan Ayam Bawang', change: '+50' },
    { time: '2026-05-05 08:30', action: 'Stock Adjustment', user: 'Admin', item: 'Kopi Arabica 250g', change: '+30' },
    { time: '2026-05-04 16:20', action: 'New Product', user: 'Manager', item: 'Roti Tawar Gandum', change: '+100' },
];

export default function Inventory() {
    const {
        paginationCategory,
        handleExport,
        handleImport,
        setSearchQuery,
        setShowAuditLog,
        currentPage,
        setShowImportModal,
        setCurrentPage,
        searchQuery,
        setShowStockModal,
        totalPages,
        showImportModal,
        showAuditLog,
        filteredCategory,
        showCreateModal,
        handleClose,
        setShowCreateModal,
        loading,
        handleSubmit,
        formData,
        setFormData,
        iconOptions,
        handleUpdate,
        handleDelete,
        categoryId
    } = useCategory();

    return (
        <div className="p-8">
            <AnimateMotion isOpen={showCreateModal} onClose={handleClose}>
                <FormModal title={categoryId ? "Update Category" : "Create Category"} loading={loading} isOpen={showCreateModal} onClose={handleClose} onSubmit={handleSubmit} >
                    <InputText label='Name' onChange={(e) => setFormData(prev => ({...prev, name: e.target.value }))} defaultValue={formData.name} /> 
                    <TextArea label='Description' onChange={(e) => setFormData(prev => ({...prev, description: e.target.value }))} defaultValue={formData.description} />
                    <SelectIcon label='Icon' onChange={(e) => setFormData(prev => ({...prev, icon: e.target.value }))} defaultValue={formData.icon} icons={iconOptions} />
                </FormModal>
            </AnimateMotion>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen Inventaris</h1>
                    <p className="text-gray-600 mt-1">Kelola stok produk dan data inventaris</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAuditLog(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <History className="w-4 h-4" />
                        Audit Log
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        Import
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari produk atau SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button onClick={() => setShowCreateModal(true)} className="flex justify-center  items-center bg-blue-500 hover:bg-blue-600 rounded-md text-white p-2 px-4">
                        <Plus size={20} />
                        Tambah
                    </button>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    Menampilkan {paginationCategory.length} dari {filteredCategory.length} produk
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Icon</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Update Terakhir</th> */}
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginationCategory.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                            {category.icon}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 truncate max-w-100">{category.description}</td>
                                    {/* <td className="px-6 py-4 text-sm text-gray-600">{category.lastUpdated}</td> */}
                                    <td className="px-6 py-4 flex items-center gap-1">
                                        <button
                                            onClick={() => handleUpdate(category)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Halaman {currentPage} dari {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stock Adjustment Modal */}
            {/* <Dialog.Root open={showStockModal} onOpenChange={setShowStockModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md z-50 shadow-xl">
                        <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
                            Adjustment Stok
                        </Dialog.Title>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root> */}

            {/* Import Modal */}
            <Dialog.Root open={showImportModal} onOpenChange={setShowImportModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md z-50 shadow-xl">
                        <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
                            Import Data Produk
                        </Dialog.Title>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600 mb-2">
                                    Drag & drop file Excel atau CSV
                                </p>
                                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                    Pilih File
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <Dialog.Close asChild>
                                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                        Batal
                                    </button>
                                </Dialog.Close>
                                <button
                                    onClick={handleImport}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Import
                                </button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Audit Log Modal */}
            <Dialog.Root open={showAuditLog} onOpenChange={setShowAuditLog}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-2xl z-50 shadow-xl max-h-[80vh] overflow-y-auto">
                        <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
                            Audit Log Aktivitas
                        </Dialog.Title>
                        <div className="space-y-3">
                            {auditLog.map((log, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-gray-900">{log.action}</p>
                                            <span className="text-xs text-gray-500">{log.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {log.item} - {log.change} oleh {log.user}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Dialog.Close asChild>
                            <button className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Tutup
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
