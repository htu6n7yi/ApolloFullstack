"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Loader2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface RegisterSaleSheetProps {
  onSuccess: () => void;
}

export function RegisterSaleSheet({ onSuccess }: RegisterSaleSheetProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Estados do Form
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");

  // Dados calculados
  const selectedProduct = products.find(p => p.id.toString() === selectedProductId);
  const estimatedTotal = selectedProduct ? selectedProduct.price * parseInt(quantity || "0") : 0;

  // Carrega produtos ao abrir para preencher o Select
  useEffect(() => {
    if (open) {
      api.get("/products/")
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedProductId || !quantity) return;
    
    setLoading(true);
    try {
      await api.post("/sales/", {
        product_id: parseInt(selectedProductId),
        quantity: parseInt(quantity)
      });
      
      setOpen(false);
      setSelectedProductId("");
      setQuantity("1");
      onSuccess();
      alert("Venda registrada com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar venda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Nova Venda
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Registrar Venda</SheetTitle>
          <SheetDescription>
            Lance uma venda manual. O lucro será calculado automaticamente.
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-6 py-6">
          {/* Seleção de Produto */}
          <div className="grid gap-2">
            <Label>Produto</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o item..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((prod) => (
                  <SelectItem key={prod.id} value={prod.id.toString()}>
                    {prod.name} - R$ {prod.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantidade */}
          <div className="grid gap-2">
            <Label>Quantidade</Label>
            <Input 
              type="number" 
              min="1" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
            />
          </div>

          {/* Card de Resumo (Feedback visual imediato) */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-slate-500">Valor Unitário:</span>
              <span className="font-medium">
                {selectedProduct ? `R$ ${selectedProduct.price.toFixed(2)}` : "--"}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-2 mt-2">
              <span className="font-bold text-slate-700">Total Estimado:</span>
              <span className="font-bold text-xl text-emerald-600">
                {estimatedTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button onClick={handleSubmit} disabled={loading || !selectedProductId} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Venda
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}