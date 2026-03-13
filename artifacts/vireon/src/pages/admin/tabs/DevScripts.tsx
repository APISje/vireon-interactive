import { useState } from "react";
import { useListDevScripts, useUploadDevScript } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CyberCard, CyberButton, CyberInput, CyberTextarea } from "@/components/ui/cyber-ui";
import { format } from "date-fns";
import { Code, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDevScripts() {
  const { data, isLoading } = useListDevScripts();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", content: "" });

  const uploadMutation = useUploadDevScript({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/dev-scripts'] });
        toast({ title: "UPLOAD_SUCCESS", description: "Core script stored in registry." });
        setForm({ name: "", content: "" });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate({ data: form });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
        <Code className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-display font-bold">CORE_DEV_SCRIPTS</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CyberCard className="lg:col-span-1 h-fit">
          <h3 className="text-secondary font-bold mb-4 flex items-center gap-2">
            <UploadCloud className="w-5 h-5" /> UPLOAD_CORE_LUA
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase mb-1 block">Module Name</label>
              <CyberInput 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                placeholder="MainFramework.lua"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase mb-1 block">Raw Lua Content</label>
              <CyberTextarea 
                value={form.content}
                onChange={(e) => setForm({...form, content: e.target.value})}
                placeholder="print('Vireon Loaded')"
                required
                className="h-48"
              />
            </div>
            <CyberButton type="submit" disabled={uploadMutation.isPending} className="w-full">
              UPLOAD_TO_CORE
            </CyberButton>
          </form>
        </CyberCard>

        <CyberCard className="lg:col-span-2 p-0 border-0 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-primary animate-pulse">FETCHING_CORE_MODULES...</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-primary uppercase bg-primary/5 border-b border-primary/20">
                <tr>
                  <th className="px-6 py-4">Module</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {data?.scripts?.map((script) => (
                  <tr key={script.id} className="border-b border-primary/10 hover:bg-primary/5">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{script.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{script.id.substring(0,8)}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-primary">
                      {Math.round(script.content.length / 1024)} KB
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {format(new Date(script.createdAt), "yyyy-MM-dd HH:mm")}
                    </td>
                  </tr>
                ))}
                {(!data?.scripts || data.scripts.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                      NO_CORE_MODULES_FOUND
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CyberCard>
      </div>
    </div>
  );
}
