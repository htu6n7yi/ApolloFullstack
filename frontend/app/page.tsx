"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api"; // Nossa configuração do Axios
import { StatsCard } from "@/components/StatsCard"; // Nosso card reutilizável
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  AlertCircle 
} from "lucide-react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Tipagem dos dados que vêm do Python
interface DashboardData {
  total_products: number;
  total_sales_value: number;
  total_profit: number;
  chart_data: {
    date: string;
    total_sales: number;
    profit: number;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Função que busca os dados no Backend
  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError(false);
      // Chama a rota /dashboard-stats/ que criamos no Python
      const response = await api.get("/dashboard-stats/");
      setData(response.data);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // Carrega assim que a página abre
  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-200" />
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-red-500 gap-4">
        <AlertCircle size={48} />
        <h2 className="text-xl font-bold">Erro de Conexão</h2>
        <p className="text-slate-600 text-center max-w-md">
          Não conseguimos conectar com o servidor em <strong>{process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}</strong>.
          <br />Verifique se o terminal do Python está rodando.
        </p>
        <Button onClick={fetchDashboardData} variant="outline">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho da Página */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral da performance da loja.
          </p>
        </div>
      </div>

      {/* Seção 1: KPIs (Cards de Estatísticas) */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Faturamento Total"
          value={data.total_sales_value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={DollarSign}
          description="Receita bruta acumulada"
        />
        <StatsCard
          title="Lucro Líquido"
          value={data.total_profit.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={TrendingUp}
          description="Margem estimada de 30%"
        />
        <StatsCard
          title="Produtos Ativos"
          value={data.total_products}
          icon={Package}
          description="Itens cadastrados no estoque"
        />
      </div>

      {/* Seção 2: Gráfico Principal */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance de Vendas (Mensal)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.chart_data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(value)
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="total_sales"
                    name="Vendas"
                    fill="#0f172a"
                    radius={[4, 4, 0, 0]}
                    barSize={50}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Lucro"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10b981" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}