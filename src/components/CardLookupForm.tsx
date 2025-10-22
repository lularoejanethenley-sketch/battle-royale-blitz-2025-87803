import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const CardLookupForm = () => {
  const [last4, setLast4] = useState("");
  const [action, setAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!last4.trim()) {
      toast({
        title: "Error",
        description: "Please enter the last 4 digits of your card",
        variant: "destructive",
      });
      return;
    }

    if (!action) {
      toast({
        title: "Error",
        description: "Please select an action",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-discord-notification', {
        body: { last4Digits: last4.trim(), action },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your request has been submitted",
      });

      setLast4("");
      setAction("");
    } catch (error: any) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Card Service Request</CardTitle>
        <CardDescription>
          Enter your card's last 4 digits to submit a service request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="last4">Last 4 Digits</Label>
            <Input
              id="last4"
              type="text"
              placeholder="1234"
              maxLength={4}
              value={last4}
              onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select value={action} onValueChange={setAction} disabled={isLoading}>
              <SelectTrigger id="action">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="replace">Replace Card</SelectItem>
                <SelectItem value="report_lost">Report Lost/Stolen</SelectItem>
                <SelectItem value="dispute">Dispute Transaction</SelectItem>
                <SelectItem value="update_info">Update Information</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
