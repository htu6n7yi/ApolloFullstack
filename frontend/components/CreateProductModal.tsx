"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Plus, Loader2 } from "lucide-react";

interface Category {
  id: number;
  name: string;
  discount_percentage?: number;
}

interface CreateProductModalProps {
  onSuccess: () => void;
}

export function CreateProductModal({ onSuccess }: CreateProductModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // Estados do Formulário
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Busca categorias ao abrir o modal
  useEffect(() => {
    if (open) {
      setLoadingCategories(true);
      // ✅ CORRIGIDO: Rota correta
      api.get("/categories/")
        .then((res) => {
          console.log("Categorias carregadas:", res.data);
          setCategories(res.data);
        })
        .catch((err) => {
          console.error("Erro ao buscar categorias:", err);
          alert("Erro ao carregar categorias. Verifique se o backend está rodando.");
        })
        .finally(() => setLoadingCategories(false));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/products/", {
        name,
        price: parseFloat(price),
        category_id: parseInt(categoryId),
      });
      
      console.log("Produto criado:", response.data);
      
      // Limpa e fecha
      setOpen(false);
      setName("");
      setPrice("");
      setCategoryId("");
      onSuccess(); // Avisa o pai que deu certo
      alert("Produto criado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);
      const errorMsg = error.response?.data?.detail || "Erro ao criar produto.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Teclado Mecânico"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            {loadingCategories ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm">Carregando categorias...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-sm text-muted-foreground py-2">
                Nenhuma categoria encontrada. Crie uma categoria primeiro.
              </div>
            ) : (
              <Select onValueChange={setCategoryId} value={categoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading || categories.length === 0}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Produto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}