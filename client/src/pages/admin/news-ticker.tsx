import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Megaphone, Clock, Calendar } from "lucide-react";
import type { NewsTicker, InsertNewsTicker } from "@shared/schema";
import { format } from "date-fns";

interface TickerFormData extends Omit<InsertNewsTicker, 'createdBy'> {
  startDate?: string;
  endDate?: string;
}

export default function AdminNewsTicker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTicker, setEditingTicker] = useState<NewsTicker | null>(null);
  const [formData, setFormData] = useState<TickerFormData>({
    text: "",
    isActive: true,
    priority: 0,
    startDate: "",
    endDate: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tickers = [], isLoading } = useQuery<NewsTicker[]>({
    queryKey: ["/api/admin/news-ticker"],
    queryFn: () => fetch('/api/admin/news-ticker', { credentials: 'include' }).then(res => res.json()),
  });

  const createTickerMutation = useMutation({
    mutationFn: async (data: TickerFormData) => {
      const response = await fetch('/api/admin/news-ticker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
          endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create news ticker');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news-ticker"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news-ticker"] });
      toast({
        title: "Success",
        description: "News ticker created successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTickerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TickerFormData> }) => {
      const response = await fetch(`/api/admin/news-ticker/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
          endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update news ticker');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news-ticker"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news-ticker"] });
      toast({
        title: "Success",
        description: "News ticker updated successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTickerMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/news-ticker/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete news ticker');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news-ticker"] });
      queryClient.invalidateQueries({ queryKey: ["/api/news-ticker"] });
      toast({
        title: "Success",
        description: "News ticker deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      text: "",
      isActive: true,
      priority: 0,
      startDate: "",
      endDate: "",
    });
    setEditingTicker(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTicker) {
      updateTickerMutation.mutate({ id: editingTicker.id, data: formData });
    } else {
      createTickerMutation.mutate(formData);
    }
  };

  const handleEdit = (ticker: NewsTicker) => {
    setEditingTicker(ticker);
    setFormData({
      text: ticker.text,
      isActive: ticker.isActive,
      priority: ticker.priority || 0,
      startDate: ticker.startDate ? format(new Date(ticker.startDate), 'yyyy-MM-dd') : "",
      endDate: ticker.endDate ? format(new Date(ticker.endDate), 'yyyy-MM-dd') : "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this news ticker?')) {
      deleteTickerMutation.mutate(id);
    }
  };

  const filteredTickers = tickers.filter(ticker =>
    ticker.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Ticker Management</h1>
          <p className="text-gray-600 mt-1">Manage scrolling announcements for the homepage</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add News Ticker
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTicker ? 'Edit News Ticker' : 'Create New News Ticker'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Ticker Text *</Label>
                <Textarea
                  id="text"
                  placeholder="Enter the scrolling text message..."
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    placeholder="0"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="999"
                  />
                  <p className="text-xs text-gray-500">Higher numbers appear first</p>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date (Optional)</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createTickerMutation.isPending || updateTickerMutation.isPending}
                >
                  {editingTicker ? 'Update' : 'Create'} Ticker
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Search Tickers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search news tickers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Tickers List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tickers...</p>
        </div>
      ) : filteredTickers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No news tickers found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTickers.map((ticker) => (
            <Card key={ticker.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticker.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {ticker.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {ticker.priority > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Priority: {ticker.priority}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-lg font-medium text-gray-900 mb-2">{ticker.text}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {ticker.startDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Start: {format(new Date(ticker.startDate), 'MMM dd, yyyy')}
                        </div>
                      )}
                      {ticker.endDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          End: {format(new Date(ticker.endDate), 'MMM dd, yyyy')}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Created: {format(new Date(ticker.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ticker)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ticker.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}