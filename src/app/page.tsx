"use client"

import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToogleTheme } from './toogleTheme'
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(0);

  const { toast } = useToast()

  const getDataFromBigquery = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/get_data_from_bigquery');
      setData(response.data);
      toast({
        title: "Data fetched successfully",
        description: "BigQuery data has been retrieved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data from BigQuery.",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  }

  const updateDataInBigQuery = async() => {
    try {
      const update = { new: qty }
      toast({
        title: "Updating data in BigQuery",
        description: `Setting quantity to ${qty}`,
      })
      await axios.post('/api/update_data_in_bigquery', update);
      toast({
        title: "Updated data in BigQuery",
        description: `Set quantity to ${qty}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update data in BigQuery.",
        variant: "destructive",
      })
    }
  }

  const updateQty = (quantity: string) => {
    setQty(Number(quantity))
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <ToogleTheme />
        </div>
        
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">BigQuery Test</h1>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Quantity</label>
              <Input 
                id="quantity"
                placeholder="Enter new quantity" 
                onChange={(e) => updateQty(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={getDataFromBigquery}
                className="w-1/2"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Get Data
              </Button>
              <Button 
                onClick={updateDataInBigQuery}
                className="w-1/2"
                disabled={loading}
              >
                Update Data
              </Button>
            </div>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : data ? (
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-x-auto text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center">No data loaded yet. Click "Get Data" to fetch from BigQuery.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}