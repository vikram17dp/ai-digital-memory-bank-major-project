"use client"

import { useState } from "react"
import { Download, Archive, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DataSettings() {
  const [loading, setLoading] = useState({
    export: false,
    archive: false,
    delete: false,
  })

  const handleExportData = async () => {
    setLoading((prev) => ({ ...prev, export: true }))

    // Mock export process
    setTimeout(() => {
      console.log("Exporting user data...")
      setLoading((prev) => ({ ...prev, export: false }))
      // In real app, this would trigger a download
    }, 2000)
  }

  const handleArchiveData = async () => {
    setLoading((prev) => ({ ...prev, archive: true }))

    setTimeout(() => {
      console.log("Archiving user data...")
      setLoading((prev) => ({ ...prev, archive: false }))
    }, 2000)
  }

  const handleDeleteData = async () => {
    if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
      setLoading((prev) => ({ ...prev, delete: true }))

      setTimeout(() => {
        console.log("Deleting user data...")
        setLoading((prev) => ({ ...prev, delete: false }))
      }, 2000)
    }
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <Archive className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Data Management</h2>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-4 rounded-lg bg-blue-500/10 border-blue-500/20">
          <div className="flex items-start gap-3">
            <Download className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-blue-400">Export Your Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Download all your memories, tags, and analytics in JSON format
              </p>
              <Button
                onClick={handleExportData}
                disabled={loading.export}
                className="mt-3 glass-button bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30"
              >
                {loading.export ? "Exporting..." : "Export Data"}
              </Button>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-lg bg-yellow-500/10 border-yellow-500/20">
          <div className="flex items-start gap-3">
            <Archive className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-yellow-400">Archive Old Memories</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Move memories older than 2 years to archive (keeps them but hides from main view)
              </p>
              <Button
                onClick={handleArchiveData}
                disabled={loading.archive}
                className="mt-3 glass-button bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/30"
              >
                {loading.archive ? "Archiving..." : "Archive Old Data"}
              </Button>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-lg bg-red-500/10 border-red-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-400">Delete All Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete all your memories, analytics, and account data. This cannot be undone.
              </p>
              <Button
                onClick={handleDeleteData}
                disabled={loading.delete}
                className="mt-3 glass-button bg-red-500/20 hover:bg-red-500/30 border-red-500/30"
              >
                {loading.delete ? "Deleting..." : "Delete All Data"}
              </Button>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-lg bg-muted/10">
          <h3 className="font-medium mb-2">Data Usage Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Memories</p>
              <p className="font-medium">0 items</p>
            </div>
            <div>
              <p className="text-muted-foreground">Storage</p>
              <p className="font-medium">0 MB</p>
            </div>
            <div>
              <p className="text-muted-foreground">Attachments</p>
              <p className="font-medium">0 files</p>
            </div>
            <div>
              <p className="text-muted-foreground">Account Age</p>
              <p className="font-medium">New</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
