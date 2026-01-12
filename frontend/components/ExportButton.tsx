import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface ExportButtonProps {
  type: "products" | "sales";
  variant?: "default" | "outline";
}

export function ExportButton({ type, variant = "outline" }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      
      const endpoint = type === "products" ? "/export/products" : "/export/sales";
      const filename = type === "products" ? "produtos.csv" : "vendas.csv";
      
      // Faz download direto do backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`);
      
      if (!response.ok) {
        throw new Error("Erro ao exportar dados");
      }
      
      // Converte para blob e cria link de download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Limpa
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      alert("Erro ao exportar dados. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleExport}
      disabled={loading}
    >
      <Download className="mr-2 h-4 w-4" />
      {loading ? "Exportando..." : "Exportar CSV"}
    </Button>
  );
}