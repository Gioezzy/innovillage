'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatRupiah } from '@/lib/utils';
import { toast } from 'sonner';
import { 
    getStoreFinanceOverview, 
    updateBankSettings, 
    requestPayout, 
    getWithdrawalHistory 
} from '@/lib/actions/finance';
import { Loader2, Landmark, Wallet, History, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FadeIn from '@/components/animations/fade-in';

export default function FinancePage() {
    const [overview, setOverview] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [payoutAmount, setPayoutAmount] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getStoreFinanceOverview();
            if (data) {
                setOverview(data);
                if (data.bankDetails) {
                    setBankName(data.bankDetails.bank_name || '');
                    setAccountNumber(data.bankDetails.account_number || '');
                    setAccountHolder(data.bankDetails.account_holder || '');
                }
                
                const historyData = await getWithdrawalHistory(data.storeId);
                setHistory(historyData);
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data keuangan.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveBank = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (!overview?.storeId) return;
            const res = await updateBankSettings(overview.storeId, {
                bankName,
                accountNumber,
                accountHolder
            });

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Informasi rekening berhasil disimpan.");
                loadData();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePayout = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = Number(payoutAmount);
        if (!amount || amount <= 0) {
            toast.error("Jumlah penarikan tidak valid.");
            return;
        }

        setIsSubmitting(true);
        try {
            if (!overview?.storeId) return;
            const res = await requestPayout(overview.storeId, amount);

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Permintaan penarikan berhasil dikirim.");
                setPayoutAmount('');
                loadData();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <FadeIn>
            <div className="space-y-6">
                <div>
                   <h1 className="text-3xl font-bold font-heading">Keuangan Toko</h1>
                   <p className="text-muted-foreground">Kelola saldo penghasilan dan penarikan dana.</p>
                </div>

                {/* --- BALANCE CARD --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Tersedia</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">
                                {formatRupiah(overview?.availableBalance || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Siap dicairkan ke rekening Anda.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pendapatan Bersih</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatRupiah(overview?.totalIncome || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Setelah dipotong biaya platform (1%).</p>
                        </CardContent>
                    </Card>

                    <Card>
                         <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Dicairkan</CardTitle>
                        </CardHeader>
                         <CardContent>
                            <div className="text-2xl font-bold">
                                {formatRupiah(overview?.totalWithdrawn || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Akumulasi dana yang sudah ditarik.</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="payout" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="payout" className="flex gap-2"><Wallet size={16}/> Tarik Saldo</TabsTrigger>
                        <TabsTrigger value="history" className="flex gap-2"><History size={16}/> Riwayat</TabsTrigger>
                        <TabsTrigger value="settings" className="flex gap-2"><Landmark size={16}/> Pengaturan Rekening</TabsTrigger>
                    </TabsList>

                    {/* --- TARIK SALDO --- */}
                    <TabsContent value="payout">
                        <Card>
                            <CardHeader>
                                <CardTitle>Request Pencairan Dana (Payout)</CardTitle>
                                <CardDescription>Dana akan ditransfer ke rekening {overview?.bankDetails?.bank_name} - {overview?.bankDetails?.account_number} a.n {overview?.bankDetails?.account_holder}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!overview?.bankDetails?.account_number ? (
                                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 mt-0.5" />
                                        <div>
                                            <p className="font-semibold">Rekening Belum Diatur</p>
                                            <p className="text-sm mb-2">Anda perlu mengatur informasi rekening bank terlebih dahulu sebelum melakukan penarikan.</p>
                                            <Button variant="outline" size="sm" onClick={() => document.querySelector<HTMLElement>('[data-state="inactive"][value="settings"]')?.click()}>Atur Rekening</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handlePayout} className="space-y-4 max-w-md">
                                        <div className="space-y-2">
                                            <Label>Jumlah Penarikan (Rp)</Label>
                                            <Input 
                                                type="number" 
                                                placeholder="Contoh: 100000"
                                                value={payoutAmount}
                                                onChange={(e) => setPayoutAmount(e.target.value)}
                                                min={10000}
                                                max={overview?.availableBalance}
                                            />
                                            <p className="text-xs text-muted-foreground">Minimal Rp 10.000. Maksimal {formatRupiah(overview?.availableBalance)}</p>
                                        </div>
                                        <Button type="submit" disabled={isSubmitting || overview?.availableBalance < 10000}>
                                            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                                            Ajukan Penarikan
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- RIWAYAT --- */}
                    <TabsContent value="history">
                        <Card>
                             <CardHeader>
                                <CardTitle>Riwayat Penarikan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {history.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-8">Belum ada riwayat penarikan.</p>
                                    ) : (
                                        history.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50">
                                                <div>
                                                    <p className="font-medium">{formatRupiah(item.amount)}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(item.created_at).toLocaleDateString()} - {new Date(item.created_at).toLocaleTimeString()}
                                                    </p>
                                                    {item.admin_note && (
                                                        <p className="text-xs text-muted-foreground mt-1">Note: {item.admin_note}</p>
                                                    )}
                                                </div>
                                                <Badge variant={
                                                    item.status === 'approved' ? 'default' : 
                                                    item.status === 'rejected' ? 'destructive' : 'secondary'
                                                }>
                                                    {item.status === 'approved' ? 'Berhasil' : 
                                                     item.status === 'rejected' ? 'Ditolak' : 'Proses'}
                                                </Badge>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- PENGATURAN REKENING --- */}
                    <TabsContent value="settings">
                         <Card>
                            <CardHeader>
                                <CardTitle>Informasi Rekening Bank</CardTitle>
                                <CardDescription>Data ini digunakan sebagai tujuan transfer pencairan dana.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSaveBank} className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <Label>Nama Bank</Label>
                                        <Input 
                                            placeholder="Contoh: BCA, Mandiri, BRI" 
                                            value={bankName}
                                            onChange={e => setBankName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nomor Rekening</Label>
                                        <Input 
                                            placeholder="Contoh: 1234567890" 
                                            value={accountNumber}
                                            onChange={e => setAccountNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nama Pemilik Rekening</Label>
                                        <Input 
                                            placeholder="Sesuai buku tabungan" 
                                            value={accountHolder}
                                            onChange={e => setAccountHolder(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                                        Simpan Rekening
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </FadeIn>
    );
}
