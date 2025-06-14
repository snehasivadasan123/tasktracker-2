// components/WorkspaceCard.tsx

import { Pencil, Trash2, Eye, Download } from "lucide-react"

interface WorkspaceCardProps {
  name: string
  date: string
  onView: () => void
  onEdit?: () => void
  onDelete?: () => void
  onDownload?: () => void
}

export default function WorkspaceCard({
  name,
  date,
  onView,
  onEdit,
  onDelete,
  onDownload,
}: WorkspaceCardProps) {
  return (
    <div className="bg-white rounded-xl border p-4 shadow-md hover:shadow-lg transition-all w-[250px]">
      <h2 className="text-lg font-semibold mb-1">{name}</h2>
      <p className="text-sm text-gray-500 mb-3">Created on: {date}</p>

      <div className="flex justify-between items-center text-gray-600">
        <button onClick={onEdit}>
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
        <button onClick={onDownload}>
          <Download className="w-4 h-4" />
        </button>
        <button onClick={onView}>
          <Eye className="w-4 h-4 text-blue-500" />
        </button>
      </div>
    </div>
  )
}
