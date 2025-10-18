'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Briefcase,
  Sparkles
} from 'lucide-react';

interface Lead {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  position?: string;
  location?: string;
  linkedinUrl?: string;
  seniority?: string;
  functional?: string[];
}

interface AILeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadsGenerated?: (leads: Lead[]) => void;
}

export function AILeadsModal({ isOpen, onClose, onLeadsGenerated }: AILeadsModalProps) {
  const [numberOfLeads, setNumberOfLeads] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLeads, setGeneratedLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string>('');

  const handleGenerateLeads = async () => {
    if (numberOfLeads < 1 || numberOfLeads > 50) {
      setError('Number of leads must be between 1 and 50');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedLeads([]);

    try {
      const response = await fetch('/api/leads/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_INTERNAL_API_KEY || ''
        },
        body: JSON.stringify({ totalResults: numberOfLeads }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate leads');
      }

      setGeneratedLeads(result.data || []);
      onLeadsGenerated?.(result.data || []);
    } catch (err) {
      console.error('Error generating leads:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate leads');
    } finally {
      setIsGenerating(false);
    }
  };

  const LeadCard = ({ lead }: { lead: Lead }) => (
    <Card className="border border-gray-200 hover:border-blue-300 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {lead.fullName || `${lead.firstName} ${lead.lastName}`}
          </CardTitle>
          {lead.seniority && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {lead.seniority}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {lead.position && (
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="h-4 w-4 mr-2" />
            {lead.position}
          </div>
        )}
        {lead.companyName && (
          <div className="flex items-center text-sm text-gray-600">
            <Building className="h-4 w-4 mr-2" />
            {lead.companyName}
          </div>
        )}
        {lead.email && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            {lead.email}
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            {lead.phone}
          </div>
        )}
        {lead.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {lead.location}
          </div>
        )}
        {lead.functional && Array.isArray(lead.functional) && lead.functional.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {lead.functional.map((func, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {func}
              </span>
            ))}
          </div>
        )}
        {lead.linkedinUrl && (
          <div className="mt-2">
            <a 
              href={lead.linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              View LinkedIn Profile
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Lead Generation
          </DialogTitle>
          <DialogDescription>
            Generate high-quality leads using AI-powered scraping
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {generatedLeads.length === 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfLeads">Number of leads to generate</Label>
                <Input
                  id="numberOfLeads"
                  type="number"
                  min="1"
                  max="50"
                  value={numberOfLeads}
                  onChange={(e) => setNumberOfLeads(Number(e.target.value))}
                  placeholder="Enter number of leads (1-50)"
                  className="max-w-xs"
                />
                <p className="text-sm text-gray-500">
                  Enter a number between 1 and 50
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateLeads} 
                  disabled={isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Leads
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Generated Leads ({generatedLeads.length})
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setGeneratedLeads([])}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate More
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {generatedLeads.map((lead, index) => (
                  <LeadCard key={index} lead={lead} />
                ))}
              </div>

              {generatedLeads.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No leads generated yet</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    // TODO: Implement save to database functionality
                    console.log('Save leads:', generatedLeads);
                  }}
                >
                  Save to Database
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}