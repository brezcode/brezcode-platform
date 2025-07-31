import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Plus, Stethoscope, ShoppingCart, Briefcase, GraduationCap, Building2 } from 'lucide-react';

interface BusinessCreationDialogProps {
  children: React.ReactNode;
}

export default function BusinessCreationDialog({ children }: BusinessCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    industry: '',
    description: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const businessTypes = [
    { value: 'Health & Wellness', label: 'Health & Wellness', icon: <Stethoscope className="h-4 w-4" /> },
    { value: 'E-commerce', label: 'E-commerce', icon: <ShoppingCart className="h-4 w-4" /> },
    { value: 'Business Consulting', label: 'Business Consulting', icon: <Briefcase className="h-4 w-4" /> },
    { value: 'Education & Training', label: 'Education & Training', icon: <GraduationCap className="h-4 w-4" /> },
    { value: 'Other Business', label: 'Other Business', icon: <Building2 className="h-4 w-4" /> }
  ];

  const createBusinessMutation = useMutation({
    mutationFn: async (businessData: any) => {
      const response = await fetch('/api/universal-training/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData)
      });
      if (!response.ok) {
        throw new Error('Failed to create business');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Business Created Successfully!",
        description: `${data.business.name} has been added to your business portfolio.`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/universal-training/businesses'] });
      setOpen(false);
      setFormData({ name: '', type: '', industry: '', description: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create business. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.type || !formData.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    createBusinessMutation.mutate({
      ...formData,
      industry: formData.industry || formData.type
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-blue-600" />
            <span>Create New Business</span>
          </DialogTitle>
          <DialogDescription>
            Set up a new business and start training your AI assistant for any industry.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name *</Label>
            <Input
              id="business-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your business name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-type">Business Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      {type.icon}
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry (Optional)</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              placeholder="Specific industry (e.g., Healthcare, Technology)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what your business does and who it serves"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={createBusinessMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createBusinessMutation.isPending}
            >
              {createBusinessMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Business
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}