'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { exportOrdersAction } from '@/lib/actions/order'
import { toast } from 'react-hot-toast'

export default function ExportOrdersButton() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      const result = await exportOrdersAction()
      
      if (result.success && result.csv) {
        // Create a blob from the CSV string
        const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
        
        // Create a download link
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        
        // Generate filename with current date
        const date = new Date().toISOString().split('T')[0]
        const filename = `orders-export-${date}.csv`
        
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up the URL object
        URL.revokeObjectURL(url)
        
        toast.success('Orders exported successfully!')
      } else {
        toast.error(result.error || 'Failed to export orders')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('An error occurred while exporting orders')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      className="rounded-xl gap-2"
    >
      <Download className="w-4 h-4" />
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </Button>
  )
}
