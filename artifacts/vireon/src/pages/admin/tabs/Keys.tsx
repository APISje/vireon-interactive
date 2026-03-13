import { useState } from "react";
import { useListKeys, useGenerateKey, useRevokeKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CyberCard, CyberBadge, CyberButton, CyberInput } from "@/components/ui/cyber-ui";
import { format } from "date-fns";
import { Key as KeyIcon, Plus, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminKeys() {
  const { data, isLoading } = useListKeys();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [newKeyForm, setNewKeyForm] = useState({ username: "", durationDays: 30, notes: "" });

  const generateMutation = useGenerateKey({
    mutation: {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/keys'] });
        toast({ title: "KEY_GENERATED", description: `Key created for ${res.username}` });
        setNewKeyForm({ username: "", durationDays: 30, notes: "" });
      }
    }
  });

  const revokeMutation = useRevokeKey({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/keys'] });
        toast({ title: "KEY_REVOKED", description: "Access key destroyed." });
      }
    }
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateMutation.mutate({ data: newKeyForm });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "COPIED", description: "Key copied to clipboard" });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
        <KeyIcon className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-display font-bold">LICENSE_MANAGEMENT</h2>
      </div>

      <CyberCard className="border-secondary/30">
        <h3 className="text-secondary font-bold mb-4">GENERATE_NEW_LICENSE</h3>
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs text-muted-foreground uppercase mb-1 block">Target Username</label>
            <CyberInput 
              value={newKeyForm.username}
              onChange={(e) => setNewKeyForm({...newKeyForm, username: e.target.value})}
              placeholder="Username"
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase mb-1 block">Duration (Days)</label>
            <CyberInput 
              type="number"
              min="1"
              max="1095"
              value={newKeyForm.durationDays}
              onChange={(e) => setNewKeyForm({...newKeyForm, durationDays: parseInt(e.target.value) || 1})}
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase mb-1 block">Notes (Opt)</label>
            <CyberInput 
              value={newKeyForm.notes}
              onChange={(e) => setNewKeyForm({...newKeyForm, notes: e.target.value})}
              placeholder="Discord ID, etc."
            />
          </div>
          <div>
            <CyberButton type="submit" disabled={generateMutation.isPending} className="w-full">
              <Plus className="w-4 h-4 mr-2 inline" /> GENERATE
            </CyberButton>
          </div>
        </form>
      </CyberCard>

      <CyberCard className="p-0 border-0 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-primary animate-pulse">LOADING_KEY_DATABASE...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-primary uppercase bg-primary/5 border-b border-primary/20">
              <tr>
                <th className="px-6 py-4">Key / User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.keys?.map((keyObj) => (
                <tr key={keyObj.id} className="border-b border-primary/10 hover:bg-primary/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-secondary font-bold bg-secondary/10 px-2 py-1 rounded">
                        {keyObj.key}
                      </code>
                      <button onClick={() => copyToClipboard(keyObj.key)} className="text-muted-foreground hover:text-primary">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 uppercase">{keyObj.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    {keyObj.isBanned ? (
                      <CyberBadge variant="destructive">REVOKED</CyberBadge>
                    ) : keyObj.isActive ? (
                      <CyberBadge variant="success">ACTIVE</CyberBadge>
                    ) : (
                      <CyberBadge variant="warning">EXPIRED</CyberBadge>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {format(new Date(keyObj.expiresAt), "yyyy-MM-dd HH:mm")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!keyObj.isBanned && (
                      <CyberButton 
                        variant="destructive" 
                        className="px-3 py-1 text-xs"
                        onClick={() => revokeMutation.mutate({ keyId: keyObj.id })}
                        disabled={revokeMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" /> REVOKE
                      </CyberButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CyberCard>
    </div>
  );
}
