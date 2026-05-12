import HistoryTable from "@/componets/HistoryTable";
import PromptForm from "@/componets/PromptForm";
import StatsCards from "@/componets/StatsCards";


export default function Home() {
  return (
    <main className="max-w-full mx-auto p-10">
      <h1 className="text-center font-bolt text-4xl mb-6">Smart AI Failover</h1>
      <p className="text-gray-500 mb-8 text-center">
        Zero downtime AI assistant
      </p>
      <PromptForm />

      <StatsCards />

      <HistoryTable />

    </main>
  )
}
