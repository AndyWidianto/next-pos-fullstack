import React, { useState } from 'react';
import { Category } from "@prisma/client";
import * as Icons from "lucide-react";
import { Filter, ChevronRight, ChevronDown } from "lucide-react";

interface SelectCategoryProps {
    categories: Category[];
    selectCategory: string;
    setSelectCategory: (result: string) => void;
}

const CategorySelector = ({ categories, selectCategory, setSelectCategory }: SelectCategoryProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const renderIcon = (iconName: string) => {
        const Icon = (Icons[iconName as keyof typeof Icons] as React.ElementType) || Icons.Package;
        return <Icon size={18} />;
    };

    return (
        <div className="relative w-full max-w-md">
            {/* Level 1: Main Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-1 rounded-xl border-2 transition-all duration-300 
                ${isOpen ? "border-blue-500 bg-white shadow-md" : "border-slate-100 bg-slate-50 hover:border-slate-200"}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isOpen ? "bg-blue-500 text-white" : "bg-white text-slate-400 border border-slate-200"}`}>
                        <Filter size={18} />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Kategori</p>
                        <p className="text-sm font-semibold text-slate-700">
                            {selectCategory || "Pilih Kategori Utama"}
                        </p>
                    </div>
                </div>
                {isOpen ? <ChevronDown className="text-slate-400" size={18} /> : <ChevronRight className="text-slate-400" size={18} />}
            </button>

            {/* Level 2: Baris yang muncul di bawah (Dropdown List) */}
            {isOpen && (
                <div className="absolute top-14 w-full overflow-hidden border border-slate-100 rounded-xl bg-white shadow-xl animate-in slide-in-from-top-2 duration-300">
                    <div className="p-2 max-h-64 overflow-y-auto">
                        {/* Opsi Reset/All */}
                        <button
                            onClick={() => {
                                setSelectCategory("");
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-sm text-slate-500 transition-colors"
                        >
                            <Icons.LayoutGrid size={16} />
                            <span>Semua Produk</span>
                        </button>

                        <div className="h-[1px] bg-slate-100 my-2" />

                        {/* Map Categories */}
                        <div className="space-y-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setSelectCategory(cat.name);
                                        // Jangan tutup jika ingin memanggil sub-kategori lagi di bawahnya
                                        // setIsOpen(false); 
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all
                                    ${selectCategory === cat.name 
                                        ? "bg-blue-50 text-blue-700 font-medium" 
                                        : "text-slate-600 hover:bg-slate-50"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={selectCategory === cat.name ? "text-blue-500" : "text-slate-400"}>
                                            {renderIcon(cat.icon)}
                                        </span>
                                        <span className="capitalize">{cat.name.toLowerCase()}</span>
                                    </div>
                                    <ChevronRight size={14} className={selectCategory === cat.name ? "opacity-100" : "opacity-30"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer baris bawah jika ingin memicu 'fetch' lagi */}
                    <div className="bg-slate-50 p-2 border-t border-slate-100">
                        <button className="w-full py-2 text-[11px] text-blue-600 font-bold uppercase tracking-widest hover:text-blue-700">
                            + Tambah Sub Kategori
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategorySelector;