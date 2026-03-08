'use client';

import { useState, useEffect } from 'react';
import { scanSongket } from '@/lib/actions/smart-lens';
import { UploadCloud, Loader2, ScanLine, Info, History as HistoryIcon, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function SmartLensPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [scanTimeMs, setScanTimeMs] = useState<number | null>(null);

  // Wake up AI service on mount (Client-Side fetch to bypass Node.js issues)
  useEffect(() => {
    const wakeUpClientSide = async () => {
      try {
        const AI_URL = 'https://gioezzy-fast-api.hf.space'; 
        console.log('[WakeUp] Pinging AI Service from Browser...');
        await fetch(AI_URL, { method: 'GET', cache: 'no-store', mode: 'cors' });
        console.log('[WakeUp] Success (Client-Side)');
      } catch (e) {
        console.log('[WakeUp] Failed (Client-Side):', e);
      }
    };
    wakeUpClientSide();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setScanTimeMs(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setScanTimeMs(null);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) return;

    setIsScanning(true);
    setScanTimeMs(null);
    const formData = new FormData();
    formData.append('file', selectedFile);

    const startTime = performance.now();

    try {
      const response = await scanSongket(formData);
      const endTime = performance.now();
      
      if (response.success && response.data) {
        setResult(response.data);
        setScanTimeMs(endTime - startTime);
        toast.success("Motif berhasil dikenali!");
      } else {
        toast.error(response.message || "Gagal mengenali motif");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Innovillage Smart lens
        </h1>
        <p className="text-muted-foreground text-lg">
          Unggah foto kain songket Anda, dan AI kami akan mengenali motif serta filosofinya.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Scan Gambar</CardTitle>
            <CardDescription>Format yang didukung: JPG, PNG, WEBP</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                previewUrl ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-400'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-lg shadow-md mb-4 group">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setResult(null);
                    }}>
                        Ganti Foto
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <UploadCloud className="w-10 h-10 text-indigo-600" />
                  </div>
                  <p className="font-medium mb-1">Klik atau Geser Foto ke Sini</p>
                  <p className="text-sm">Maksimal ukuran 10MB</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              
              {!previewUrl && (
                <Button variant="outline" className="mt-4" onClick={() => document.getElementById('file-upload')?.click()}>
                  Pilih dari Galeri
                </Button>
              )}

              {previewUrl && (
                <Button 
                  size="lg" 
                  className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-200"
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <ScanLine className="w-5 h-5 mr-2" />
                      Identifikasi Motif
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {result ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
               <Card className="border-indigo-100 bg-white/50 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-1"></div>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl text-indigo-950">{result.motifName}</CardTitle>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                            {scanTimeMs !== null && (
                              <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                                <span>⚡ {(scanTimeMs / 1000).toFixed(2)}s</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                <span>{(result.confidence * 100).toFixed(1)}% Akurasi</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                {result.referenceImageUrl && (
                  <div className="px-6 pb-2">
                     <p className="text-sm text-muted-foreground mb-2 font-medium">Referensi Motif Asli:</p>
                     <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                         <Image 
                            src={result.referenceImageUrl} 
                            alt={`Referensi ${result.motifName}`}
                            fill
                            className="object-cover"
                         />
                     </div>
                  </div>
                )}
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
                            <Info className="w-5 h-5" />
                            <h3>Filosofi</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                            {result.philosophy}
                        </p>
                    </div>

                    {result.origin && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                    (Asal: {result.origin})
                                </span>
                            </div>
                        </div>
                    )}

                    {result.history && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-purple-600 font-semibold text-lg">
                                <HistoryIcon className="w-5 h-5" />
                                <h3>Sejarah</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-sm">
                                {result.history}
                            </p>
                        </div>
                    )}

                    {result.relatedProducts && result.relatedProducts.length > 0 && (
                        <div className="pt-6 border-t border-gray-100">
                             <div className="flex items-center gap-2 text-indigo-700 font-semibold text-lg mb-4">
                                <ShoppingBag className="w-5 h-5" />
                                <h3>Tertarik memiliki motif ini?</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {result.relatedProducts.map((product: any) => (
                                    <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
                                        <div className="relative h-32 w-full">
                                            {product.imageUrls && product.imageUrls[0] ? (
                                                <Image 
                                                    src={product.imageUrls[0]} 
                                                    alt={product.name} 
                                                    fill 
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="bg-gray-100 h-full w-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                                            <p className="text-indigo-600 font-bold text-sm mt-1">
                                                Rp {parseInt(product.price).toLocaleString('id-ID')}
                                            </p>
                                            <Button size="sm" variant="secondary" className="w-full mt-2 h-8 text-xs" asChild>
                                                <a href={`/product/${product.slug}`}>Lihat Produk</a>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
               </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
               <ScanLine className="w-16 h-16 text-gray-300 mb-4" />
               <h3 className="text-xl font-semibold text-gray-400">Hasil Scan</h3>
               <p className="text-gray-400 mt-2 max-w-xs">
                 Hasil identifikasi motif dan filosofinya akan muncul di sini setelah proses scan selesai.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
