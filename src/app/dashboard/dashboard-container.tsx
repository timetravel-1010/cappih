'use client';

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/lib/types";
import TransactionForm from "@/components/transaction-form";
import TransactionList from "@/components/transaction-list";
import Dashboard from "@/components/dashboard";
import { deleteTransactionAction, getDashboardSummary } from "./actions";
import { LayoutDashboard, List } from "lucide-react";

interface DashboardContainerProps {
  initialTransactions: Transaction[];
  dashboardSummary: Awaited<ReturnType<typeof getDashboardSummary>>;
}

export function DashboardContainer({
  initialTransactions,
  dashboardSummary,
}: DashboardContainerProps) {
  const { toast } = useToast();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [activeView, setActiveView] = useState<'dashboard' | 'list'>('dashboard');
  const [open, setOpen] = useState(false);

  const handleDeleteTransaction = async (id: string) => {
    const { error } = await deleteTransactionAction(id);
    if (error) {
      toast({
        title: "Error",
        description: error,
      });
      return;
    }

    toast({
      title: "Transacción eliminada",
      description: "La transacción ha sido eliminada exitosamente",
    });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setOpen(true);
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto py-8 px-2 md:px-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-main-foreground">Dashboard</h1>
          <p className="text-foreground">Gestiona tus finanzas de manera sencilla</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border-2 border-border rounded-base overflow-hidden bg-secondary-background">
            <button
              className={`p-2 transition-colors font-medium ${activeView === 'dashboard' ? 'bg-main text-main-foreground' : 'bg-secondary-background text-foreground'}`}
              onClick={() => setActiveView('dashboard')}
              style={{ minWidth: 40 }}
            >
              <LayoutDashboard size={20} />
            </button>
            <button
              className={`p-2 transition-colors font-medium ${activeView === 'list' ? 'bg-main text-main-foreground' : 'bg-secondary-background text-foreground'}`}
              onClick={() => setActiveView('list')}
              style={{ minWidth: 40 }}
            >
              <List size={20} />
            </button>
          </div>

          <TransactionForm
            editTransaction={editingTransaction}
            open={open}
            setOpen={setOpen}
          />
        </div>
      </div>

      {activeView === 'dashboard' ? (
        <Dashboard
          summary={{
            ...dashboardSummary,
            recentTransactions: initialTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
          }}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      ) : (
        <TransactionList
          transactions={initialTransactions}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      )}
    </div>
  );
}
