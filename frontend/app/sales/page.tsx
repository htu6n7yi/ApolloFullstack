"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RegisterSaleSheet } from "@/components/RegisterSaleSheet";
import { CsvUploadModal } from "@/components/CsvUploadModal"; // Agora genérico!
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PackageOpen } from "lucide-react";

// Interface da Venda
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

  async function fetchSales() {
    try {
      setLoading(true);
      const response = await api.get("/sales/");
      // Ordena por ID decrescente (mais recentes primeiro)
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
           {/* Botão de Upload para VENDAS */}
           <CsvUploadModal 
              onSuccess={fetchSales} 
              endpoint="/upload-sales-csv/" 
              title="Importar Vendas CSV"
           />
           
           {/* Botão de Venda Manual */}
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">Carregando histórico...</TableCell>
              </TableRow>
            ) : sales.length === 0 ? (
               <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <PackageOpen className="h-8 w-8" />
                    <p>Nenhuma venda registrada ainda.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono text-xs text-slate-500">#{sale.id}</TableCell>
                  <TableCell className="font-medium">
                    {sale.product?.name || `Produto ID ${sale.product_id}`}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-mono">{sale.quantity}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {sale.total_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell className="text-right text-emerald-600 font-medium text-xs">
                    +{sale.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell className="text-right text-slate-500 text-sm">
                    {new Date(sale.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}