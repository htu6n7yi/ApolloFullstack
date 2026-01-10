"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Upload, 
  Search, 
  PackageOpen, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  X
} from "lucide-react";
import { CreateProductModal } from "@/components/CreateProductModal";
import { CsvUploadModal } from "@/components/CsvUploadModal";

// Tipagem
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category_id: number;
  category?: {
    id: number;
    name: string;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Ajuste conforme necessário

  // Busca produtos e categorias
  async function fetchData() {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products/"),
        api.get("/categories/")
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Aplicar Filtros
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      product.category_id.toString() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Aplicar Paginação
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Resetar para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Limpar todos os filtros
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== "" || selectedCategory !== "all";

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground">
            {products.length} totais • {filteredProducts.length} filtrados
          </p>
        </div>

        <div className="flex gap-2">
          <CsvUploadModal
            onSuccess={fetchData}
            endpoint="/upload-csv/"
            title="Importar Produtos"
          />
          <CreateProductModal onSuccess={fetchData} />
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Busca por Nome */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Filtro por Categoria */}
        <div className="w-full md:w-[240px]">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Todas categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botão Limpar Filtros */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Tabela de Dados */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Carregando estoque...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <PackageOpen className="h-8 w-8" />
                    <p>
                      {hasActiveFilters
                        ? "Nenhum produto encontrado com esses filtros."
                        : "Nenhum produto cadastrado."}
                    </p>
                    {hasActiveFilters && (
                      <Button variant="link" onClick={clearFilters}>
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-slate-500">
                    #{product.id}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {product.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {product.category?.name || "Sem Categoria"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {product.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Paginação */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
              <span className="font-medium">
                {Math.min(endIndex, filteredProducts.length)}
              </span>{" "}
              de <span className="font-medium">{filteredProducts.length}</span> produtos
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Lógica para mostrar páginas ao redor da atual
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}