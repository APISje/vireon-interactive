import { useListAllScripts } from "@workspace/api-client-react";
import { CyberCard } from "@/components/ui/cyber-ui";
import { Code, TerminalSquare } from "lucide-react";
import { format } from "date-fns";

export default function AdminScripts() {
  const { data, isLoading } = useListAllScripts();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
        <TerminalSquare className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-display font-bold">PROTECTED_PAYLOADS</h2>
      </div>

      <CyberCard className="p-0 border-0 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-primary animate-pulse">SCANNING_PAYLOADS...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-primary uppercase bg-primary/5 border-b border-primary/20">
              <tr>
                <th className="px-6 py-4">Script Name</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Script URL (Endpoint)</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {data?.scripts?.map((script) => (
                <tr key={script.id} className="border-b border-primary/10 hover:bg-primary/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-secondary" />
                      <span className="font-bold text-white">{script.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{script.id.substring(0,8)}...</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-primary">
                    {script.username}
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-muted-foreground break-all">
                      {script.scriptUrl}
                    </code>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {format(new Date(script.createdAt), "yyyy-MM-dd")}
                  </td>
                </tr>
              ))}
              {(!data?.scripts || data.scripts.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    NO_PAYLOADS_DETECTED
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </CyberCard>
    </div>
  );
}
