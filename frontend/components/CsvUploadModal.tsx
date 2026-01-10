"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from "lucide-react";

// Agora aceitamos "endpoint" e "title" como props
interface CsvUploadModalProps {
  onSuccess: () => void;
  endpoint: string;       // Ex: "/upload-csv/" ou "/upload-sales-csv/"
  title?: string;         // Ex: "Importar Produtos"
}

export function CsvUploadModal({ onSuccess, endpoint, title = "Importar CSV" }: CsvUploadModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // O backend retorna chaves diferentes (products_added vs sales_added), então usamos 'any' aqui ou um tipo genérico
  const [result, setResult] = useState<{ added: number; errors: string[] } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Backend pode retornar 'products_added' ou 'sales_added', pegamos o que vier
      const count = response.data.products_added || response.data.sales_added || 0;
      
      setResult({
        added: count,
        errors: response.data.errors || [],
      });
      
      if (count > 0) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar arquivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 text-center">
          {!result && !loading && (
            <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center hover:bg-slate-50 transition cursor-pointer relative">
              <FileSpreadsheet className="h-10 w-10 text-slate-400 mb-2" />
              <p className="text-sm text-muted-foreground font-medium">
                Clique para selecionar seu arquivo .csv
              </p>
              <input
                type="file"
                accept=".csv"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          )}

          {loading && (
            <div className="py-10 flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-2" />
              <p className="text-sm text-slate-500">Processando dados...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-6 w-6" />
                <span className="font-bold text-lg">{result.added} registros importados!</span>
              </div>

              {result.errors.length > 0 && (
                <div className="bg-red-50 p-4 rounded-md text-left max-h-[200px] overflow-y-auto">
                  <h4 className="flex items-center gap-2 font-semibold text-red-700 mb-2">
                    <AlertCircle className="h-4 w-4" /> Erros encontrados:
                  </h4>
                  <ul className="list-disc pl-5 text-xs text-red-600 space-y-1">
                    {result.errors.map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button onClick={() => setOpen(false)} className="w-full mt-2">
                Fechar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}