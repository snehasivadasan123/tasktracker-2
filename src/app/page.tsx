'use client'
import WorkspaceCard from "../components/workspacecard"
import { useRouter } from "next/navigation"

const workspaces = [
  { id: 1, name: "Project Management", date: "2025-06-13" },
  { id: 2, name: "Digital Marketing", date: "2025-06-12" },
]

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Workspaces</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {workspaces.map((ws) => (
          <WorkspaceCard
            key={ws.id}
            name={ws.name}
            date={ws.date}
            onView={() => router.push(`/workspace/${ws.id}`)}
            onEdit={() => alert("Edit workspace")}
            onDelete={() => alert("Delete workspace")}
            onDownload={() => alert("Download workspace")}
          />
        ))}
      </div>
    </main>
  )
}
