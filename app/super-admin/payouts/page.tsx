'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllWithdrawalRequests, processWithdrawal } from '@/lib/actions/finance';
import { formatRupiah } from '@/lib/utils';
import { Loader2, CheckCircle, XCircle, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import FadeIn from '@/components/animations/fade-in';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PayoutsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Process Modal State
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [proofUrl, setProofUrl] = useState('');
    const [note, setNote] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getAllWithdrawalRequests();
            setRequests(data);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data pencairan.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenProcess = (req: any) => {
        setSelectedRequest(req);
        setProofUrl('');
        setNote('');
        setIsDialogOpen(true);
    };

    const handleProcess = async (status: 'approved' | 'rejected') => {
        if (!selectedRequest) return;
        
        // Validation for approval
        if (status === 'approved' && !proofUrl) {
            toast.error("Mohon sertakan url bukti transfer untuk menyetujui.");
            return; 
        }

        setIsProcessing(true);
        try {
            const res = await processWithdrawal(selectedRequest.id, status, proofUrl, note);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(`Permintaan berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
                setIsDialogOpen(false);
                loadData();
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <FadeIn>
            <div className="space-y-6">
                <div>
                   <h1 className="text-3xl font-bold font-heading">Kelola Pencairan Dana</h1>
                   <p className="text-muted-foreground">Proses permintaan tarik saldo dari toko.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Permintaan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 text-xs uppercase font-medium text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Tanggal</th>
                                        <th className="px-6 py-3 text-left">Toko</th>
                                        <th className="px-6 py-3 text-left">Bank</th>
                                        <th className="px-6 py-3 text-right">Jumlah</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-border/50">
                                    {requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4">
                                                {new Date(req.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{req.stores?.name}</div>
                                                <div className="text-xs text-muted-foreground font-mono">ID: {req.stores?.owner_id.slice(0,8)}...</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                <div className="font-bold">{req.bank_info?.bank_name}</div>
                                                <div>{req.bank_info?.account_number}</div>
                                                <div className="text-muted-foreground">a.n {req.bank_info?.account_holder}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-base">
                                                {formatRupiah(req.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant={
                                                    req.status === 'approved' ? 'default' : 
                                                    req.status === 'rejected' ? 'destructive' : 'secondary'
                                                }>
                                                    {req.status === 'approved' ? 'SELESAI' : 
                                                     req.status === 'rejected' ? 'DITOLAK' : 'PENDING'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {req.status === 'pending' && (
                                                    <Button size="sm" onClick={() => handleOpenProcess(req)}>
                                                        Proses
                                                    </Button>
                                                )}
                                                {req.status === 'approved' && req.proof_url && (
                                                    <Button size="sm" variant="ghost" asChild>
                                                        <a href={req.proof_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                            <ExternalLink size={14} /> Bukti
                                                        </a>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {requests.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Belum ada permintaan pencairan.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* --- PROCESS DIALOG --- */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Proses Pencairan Dana</DialogTitle>
                            <DialogDescription>
                                Pastikan Anda sudah mentransfer dana ke rekening tujuan sebelum menyetujui.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedRequest && (
                            <div className="space-y-4 py-4">
                                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Bank Tujuan:</span>
                                        <span className="font-bold">{selectedRequest.bank_info?.bank_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">No. Rekening:</span>
                                        <span className="font-bold">{selectedRequest.bank_info?.account_number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Atas Nama:</span>
                                        <span className="font-bold">{selectedRequest.bank_info?.account_holder}</span>
                                    </div>
                                    <div className="border-t border-border/50 my-2 pt-2 flex justify-between">
                                        <span className="text-muted-foreground">Jumlah Transfer:</span>
                                        <span className="font-bold text-lg text-primary">{formatRupiah(selectedRequest.amount)}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>URL Bukti Transfer (Image URL)</Label>
                                    <Input 
                                        placeholder="https://..." 
                                        value={proofUrl}
                                        onChange={(e) => setProofUrl(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Upload bukti transfer ke storage dan paste linknya di sini.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Catatan (Opsional)</Label>
                                    <Input 
                                        placeholder="Contoh: Transfer berhasil via BCA" 
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="destructive" onClick={() => handleProcess('rejected')} disabled={isProcessing}>
                                Tolak Permintaan
                            </Button>
                            <Button onClick={() => handleProcess('approved')} disabled={isProcessing}>
                                {isProcessing ? <Loader2 className="animate-spin mr-2"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                                Konfirmasi Transfer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </FadeIn>
    );
}
