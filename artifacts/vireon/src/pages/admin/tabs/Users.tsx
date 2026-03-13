import { useListUsers, useBanUser, useUnbanUser } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CyberCard, CyberBadge, CyberButton } from "@/components/ui/cyber-ui";
import { format } from "date-fns";
import { Ban, CheckCircle, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const { data, isLoading, error } = useListUsers();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const banMutation = useBanUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
        toast({ title: "USER_BANNED", description: "Access revoked." });
      }
    }
  });

  const unbanMutation = useUnbanUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
        toast({ title: "USER_UNBANNED", description: "Access restored." });
      }
    }
  });

  if (isLoading) return <div className="text-primary animate-pulse p-8">FETCHING_USER_RECORDS...</div>;
  if (error) return <div className="text-destructive p-8">ERROR_RETRIEVING_DATA</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
        <ShieldAlert className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-display font-bold">USER_REGISTRY</h2>
      </div>

      <CyberCard className="overflow-x-auto p-0 border-0">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-primary uppercase bg-primary/5 border-b border-primary/20">
            <tr>
              <th className="px-6 py-4">Username / ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Expiry</th>
              <th className="px-6 py-4">HWID</th>
              <th className="px-6 py-4">Scripts</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((user) => (
              <tr key={user.id} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-white">{user.username}</div>
                  <div className="text-xs text-muted-foreground">{user.id.substring(0,8)}...</div>
                </td>
                <td className="px-6 py-4">
                  {user.isBanned ? (
                    <CyberBadge variant="destructive">BANNED</CyberBadge>
                  ) : user.isActive ? (
                    <CyberBadge variant="success">ACTIVE</CyberBadge>
                  ) : (
                    <CyberBadge variant="warning">EXPIRED</CyberBadge>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {format(new Date(user.expiresAt), "yyyy-MM-dd HH:mm")}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  {user.hwid ? user.hwid.substring(0, 12) + "..." : "UNBOUND"}
                </td>
                <td className="px-6 py-4 font-mono text-primary">
                  [{user.scriptCount}]
                </td>
                <td className="px-6 py-4 text-right">
                  {user.isBanned ? (
                    <CyberButton 
                      variant="outline" 
                      className="px-3 py-1 text-xs border-green-500/50 text-green-400 hover:bg-green-500 hover:text-black"
                      onClick={() => unbanMutation.mutate({ userId: user.id })}
                      disabled={unbanMutation.isPending}
                    >
                      <CheckCircle className="w-3 h-3 inline mr-1" /> UNBAN
                    </CyberButton>
                  ) : (
                    <CyberButton 
                      variant="destructive" 
                      className="px-3 py-1 text-xs"
                      onClick={() => banMutation.mutate({ userId: user.id })}
                      disabled={banMutation.isPending}
                    >
                      <Ban className="w-3 h-3 inline mr-1" /> BAN
                    </CyberButton>
                  )}
                </td>
              </tr>
            ))}
            {(!data?.users || data.users.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  NO_RECORDS_FOUND
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CyberCard>
    </div>
  );
}
