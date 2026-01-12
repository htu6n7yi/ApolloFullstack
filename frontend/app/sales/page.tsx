"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RegisterSaleSheet } from "@/components/RegisterSaleSheet";
import { CsvUploadModal } from "@/components/CsvUploadModal";
import { ExportButton } from "@/components/ExportButton";
import { Pencil, PackageOpen, X, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Sale {
  id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  profit: number;
  date: string;
  product?: {
    name: string;
  };
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editForm, setEditForm] = useState({
    quantity: 0,
    total_price: 0,
    profit: 0,
    date: ""
  });
  const [saving, setSaving] = useState(false);

  async function fetchSales() {
    try {
      setLoading(true);
      const response = await api.get("/sales/");
      setSales(response.data.sort((a: Sale, b: Sale) => b.id - a.id));
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSales();
  }, []);

  function handleEditClick(sale: Sale) {
    setEditingSale(sale);
    setEditForm({
      quantity: sale.quantity,
      total_price: sale.total_price,
      profit: sale.profit,
      date: sale.date.split('T')[0]
    });
  }

  async function handleSaveEdit() {
    if (!editingSale) return;

    try {
      setSaving(true);
      
      // Atualiza no backend
      await api.put(`/sales/${editingSale.id}`, {
        quantity: editForm.quantity,
        total_price: editForm.total_price,
        profit: editForm.profit,
        date: editForm.date
      });

      // Atualiza localmente
      setSales(sales.map(sale => 
        sale.id === editingSale.id 
          ? { ...sale, ...editForm }
          : sale
      ));

      setEditingSale(null);
    } catch (error) {
      console.error("Erro ao atualizar venda:", error);
      alert("Erro ao salvar alterações. Verifique se o backend suporta PUT /sales/{id}");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendas Realizadas</h2>
          <p className="text-muted-foreground">
            Gerencie o fluxo de saída e importe históricos.
          </p>
        </div>
        
        <div className="flex gap-2">
          <ExportButton type="sales" />
          <CsvUploadModal 
            onSuccess={fetchSales} 
            endpoint="/upload-sales-csv/" 
            title="Importar Vendas CSV"
          />
          <RegisterSaleSheet onSuccess={fetchSales} />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="text-center">Qtd</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Lucro</TableHead>
              <TableHead className="text-right">Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Carregando histórico...
                </TableCell>
              </TableRow>
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <PackageOpen className="h-8 w-8" />
                    <p>Nenhuma venda registrada ainda.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono text-xs text-slate-500">
                    #{sale.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {sale.product?.name || `Produto ID ${sale.product_id}`}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-mono">
                      {sale.quantity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {sale.total_price.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}
                  </TableCell>
                  <TableCell className="text-right text-emerald-600 font-medium text-xs">
                    +{sale.profit.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}
                  </TableCell>
                  <TableCell className="text-right text-slate-500 text-sm">
                    {new Date(sale.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(sale)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Edição */}
      <Dialog open={!!editingSale} onOpenChange={() => setEditingSale(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Venda #{editingSale?.id}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantidade</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={editForm.quantity}
                onChange={(e) => setEditForm({
                  ...editForm,
                  quantity: parseInt(e.target.value) || 0
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-total">Total (R$)</Label>
              <Input
                id="edit-total"
                type="number"
                step="0.01"
                value={editForm.total_price}
                onChange={(e) => setEditForm({
                  ...editForm,
                  total_price: parseFloat(e.target.value) || 0
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-profit">Lucro (R$)</Label>
              <Input
                id="edit-profit"
                type="number"
                step="0.01"
                value={editForm.profit}
                onChange={(e) => setEditForm({
                  ...editForm,
                  profit: parseFloat(e.target.value) || 0
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date">Data</Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm({
                  ...editForm,
                  date: e.target.value
                })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditingSale(null)}
              disabled={saving}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              <Check className="mr-2 h-4 w-4" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}