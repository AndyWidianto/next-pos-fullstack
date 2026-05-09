"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, ScanLine } from "lucide-react";

export default function ProductScanner({ onResult }: { onResult: (val: string) => void }) {
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        scannerRef.current = new Html5Qrcode("reader");
        return () => {
            if (scannerRef.current?.isScanning) scannerRef.current.stop();
        };
    }, []);

    const startScan = async () => {
        setIsScanning(true);
        try {
            await scannerRef.current?.start(
                { facingMode: "environment" },
                {
                    fps: 30,
                    videoConstraints: {
                        width: { min: 640, ideal: 1280, max: 1920 },
                        height: { min: 480, ideal: 720, max: 1080 },
                    }
                },
                (text) => {
                    onResult(text);
                    stopScan();
                },
                () => { }
            );
        } catch (err) {
            console.error(err);
            setIsScanning(false);
        }
    };

    const stopScan = async () => {
        await scannerRef.current?.stop();
        setIsScanning(false);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6">
            {/* Container Utama dengan Glassmorphism */}
            <div className="relative w-full aspect-square md:aspect-video bg-white/30 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[10px] border-white/80">

                {/* Placeholder saat kamera belum aktif */}
                {!isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/50 z-10">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <ScanLine size={40} className="text-blue-500 opacity-50" />
                        </div>
                        <p className="text-gray-400 font-medium">Kamera Siap</p>
                    </div>
                )}

                {/* Video Feed */}
                <div id="reader" className="w-full h-full object-cover"></div>

                {/* Overlay saat Scanning */}
                {isScanning && (
                    <div className="absolute inset-0 pointer-events-none z-20">
                        {/* Latar belakang putih transparan (Frosted Glass Effect) */}
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>

                        {/* Kotak Fokus */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Masking menggunakan shadow putih yang sangat soft */}
                            <div className="w-[280px] h-[180px] bg-transparent border-[3px] border-white rounded-3xl shadow-[0_0_0_9999px_rgba(255,255,255,0.4)] relative">

                                {/* Siku-siku Biru Terang */}
                                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-[6px] border-l-[6px] border-blue-500 rounded-tl-xl"></div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-[6px] border-r-[6px] border-blue-500 rounded-tr-xl"></div>
                                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-[6px] border-l-[6px] border-blue-500 rounded-bl-xl"></div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-[6px] border-r-[6px] border-blue-500 rounded-br-xl"></div>

                                {/* Animasi Laser Soft Blue */}
                                <div className="absolute w-full h-[4px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-scan-bounce top-1/2"></div>
                            </div>
                        </div>

                        <div className="absolute bottom-12 w-full text-center">
                            <span className="bg-white/80 backdrop-blur-md text-blue-600 text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full shadow-sm border border-blue-100">
                                Scanning Barcode...
                            </span>
                        </div>
                    </div>
                )}

                {/* Control Button */}
                <div className="absolute bottom-8 inset-x-0 flex justify-center z-30">
                    {!isScanning ? (
                        <button
                            onClick={startScan}
                            className="group bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-3xl shadow-[0_10px_25px_rgba(37,99,235,0.4)] transition-all active:scale-90 flex items-center gap-3"
                        >
                            <Camera size={24} />
                            <span className="font-bold pr-2">Buka Pemindai</span>
                        </button>
                    ) : (
                        <button
                            onClick={stopScan}
                            className="bg-white/90 hover:bg-red-50 text-red-500 p-4 rounded-2xl shadow-xl backdrop-blur-md transition-all active:scale-95 border border-red-100"
                        >
                            <X size={28} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}