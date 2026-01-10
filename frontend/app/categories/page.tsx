"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, Loader2, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Category {
  id: number;
  name: string;
  discount_percentage: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal de Upload
  const [openUpload, setOpenUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function fetchCategories() {
    try {
      const response = await api.get("/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // Função de Upload de Categorias (CSV)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Nota: Rota específica para categorias que criamos no backend
      await api.post("/upload-categories-csv/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Categorias atualizadas com sucesso!");
      setOpenUpload(false);
      fetchCategories(); // Recarrega a lista com os nomes novos
    } catch (error) {
      alert("Erro ao enviar arquivo.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
          <p className="text-muted-foreground">
            Gerencie os departamentos da sua loja.
          </p>
        </div>
        
        {/* Botão de Upload de Categorias */}
        <Dialog open={openUpload} onOpenChange={setOpenUpload}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importar CSV de Categorias
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar Categorias</DialogTitle>
            </DialogHeader>
            <div className="py-8 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg">
              {uploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-2" />
                  <p>Processando...</p>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <FileSpreadsheet className="h-12 w-12 text-slate-300 mb-2" />
                  <span className="text-sm font-medium">Clique para selecionar categories.csv</span>
                  <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                </label>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid de Estatísticas Rápidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nome da Categoria</TableHead>
              <TableHead>Desconto (%)</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">Carregando...</TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-mono">#{cat.id}</TableCell>
                  <TableCell className="font-semibold">
                    {/* Se o nome for igual ao ID, destaca que precisa corrigir */}
                    {cat.name === cat.id.toString() ? (
                      <span className="text-orange-500 flex items-center gap-2">
                        {cat.name} 
                        <Badge variant="outline" className="text-[10px] border-orange-200 bg-orange-50">
                          Aguardando CSV
                        </Badge>
                      </span>
                    ) : (
                      cat.name
                    )}
                  </TableCell>
                  <TableCell>{cat.discount_percentage}%</TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-emerald-500">Ativa</Badge>
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