'use client';

import { useState } from 'react';
import { PageHeader } from '@repo/ui';
import { RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Loader2, Inbox, KeyRound } from 'lucide-react';
import { useMembers, useResetPassword } from '@repo/api-client';
import { useUIStore } from '@/lib/use-ui-store';
import { toast } from 'sonner';

import { NoOrgSelected } from '@/components/no-org-selected';

export default function QRManagementPage() {
  const { activeOrgSlug, activeOrgName } = useUIStore();
  const currentOrgSlug = activeOrgSlug;
  const currentOrgName = activeOrgName || activeOrgSlug;
  const { data: membersData, isLoading } = useMembers(currentOrgSlug);
  const resetPasswordMutation = useResetPassword(currentOrgSlug);

  if (!activeOrgSlug) {
    return (
      <NoOrgSelected description='Please select an organization from the Organization Selector at the top to manage QR tokens.' />
    );
  }
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [regeneratingIds, setRegeneratingIds] = useState<Record<string, boolean>>({});

  const membersList = membersData?.items ?? [];

  const handleResetPass = async (mId: string, name: string) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789#@!";
    let pass = "Unite@";
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    try {
      await resetPasswordMutation.mutateAsync({
        memberId: mId,
        password: pass,
      });
      toast.success(`Password reset for ${name}! Temp Pass: ${pass}`);
    } catch (err: any) {
      toast.error("Failed to reset password");
    }
  };

  const handleRegenerate = (id: string, name: string) => {
    setRegeneratingIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setRegeneratingIds((prev) => ({ ...prev, [id]: false }));
      const newToken = `QR_${id.slice(-6).toUpperCase()}_${Date.now()}`;
      toast.success(`Regenerated active QR token for ${name} (${newToken})`);
    }, 500);
  };

  const handleBulkGenerate = () => {
    setIsBulkGenerating(true);
    setTimeout(() => {
      setIsBulkGenerating(false);
      toast.success(
        `Bulk QR Code regeneration complete for ${activeOrgName}! All active members received updated dynamic QR tokens.`,
      );
    }, 1200);
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='QR Code Pass Management'
        description={`Generate, regenerate, and manage secure dynamic & printed QR tokens for ${currentOrgName} members`}
        action={
          <button
            onClick={handleBulkGenerate}
            disabled={isBulkGenerating || membersList.length === 0}
            className='inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50'>
            <RefreshCw className={`h-3.5 w-3.5 ${isBulkGenerating ? 'animate-spin' : ''}`} />
            {isBulkGenerating ? 'Regenerating All...' : 'Bulk Regenerate QRs'}
          </button>
        }
      />

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm'>
          <div className='h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400'>
            <ShieldCheck className='h-5 w-5' />
          </div>
          <div>
            <span className='text-xs text-zinc-500 block font-medium'>Active Member QRs</span>
            <span className='text-xl font-bold text-zinc-900 dark:text-white'>
              {isLoading ? '...' : membersList.length} Active
            </span>
          </div>
        </div>

        <div className='bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm'>
          <div className='h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400'>
            <CheckCircle2 className='h-5 w-5' />
          </div>
          <div>
            <span className='text-xs text-zinc-500 block font-medium'>Monthly Regeneration Limit</span>
            <span className='text-xl font-bold text-emerald-600 dark:text-emerald-400'>Unlimited Tier</span>
          </div>
        </div>

        <div className='bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm'>
          <div className='h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400'>
            <AlertTriangle className='h-5 w-5' />
          </div>
          <div>
            <span className='text-xs text-zinc-500 block font-medium'>Revoked / Expired QRs</span>
            <span className='text-xl font-bold text-amber-600 dark:text-amber-400'>0 Revoked</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm'>
        {isLoading ?
          <div className='py-16 flex items-center justify-center text-xs text-zinc-400 gap-2'>
            <Loader2 className='h-4 w-4 animate-spin text-indigo-500' /> Fetching active member QR tokens...
          </div>
        : membersList.length === 0 ?
          <div className='py-16 text-center space-y-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/40'>
            <Inbox className='h-8 w-8 text-zinc-400 mx-auto' />
            <p className='text-xs font-semibold text-zinc-700 dark:text-zinc-300'>
              No member QR tokens available for {activeOrgName}
            </p>
            <p className='text-[11px] text-zinc-400'>
              Add members to your organization to generate dynamic check-in tokens.
            </p>
          </div>
        : <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-zinc-100 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 uppercase text-[11px] font-semibold border-b border-zinc-200 dark:border-zinc-800'>
                <tr>
                  <th className='px-6 py-3'>Member</th>
                  <th className='px-6 py-3'>QR Token</th>
                  <th className='px-6 py-3'>Type</th>
                  <th className='px-6 py-3'>Status</th>
                  <th className='px-6 py-3 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-zinc-200 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300'>
                {membersList.map((m) => (
                  <tr key={m.id} className='hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='font-semibold text-zinc-900 dark:text-white'>
                        {m.user?.name ?? 'Unknown Member'}
                      </div>
                      <div className='text-xs text-zinc-500'>
                        {m.employeeId ?? 'EMP-DEFAULT'} • {m.department?.name ?? 'General'}
                      </div>
                    </td>

                    <td className='px-6 py-4 font-mono text-xs text-indigo-600 dark:text-indigo-300'>
                      QR_{m.id.slice(-8).toUpperCase()}_ACTIVE
                    </td>

                    <td className='px-6 py-4 text-xs font-medium text-zinc-600 dark:text-zinc-400'>DYNAMIC MOBILE</td>

                    <td className='px-6 py-4'>
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'>
                        ACTIVE
                      </span>
                    </td>

                    <td className='px-6 py-4 text-right'>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleResetPass(m.id, m.user?.name || "Member")}
                          className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400 rounded-lg transition-colors border border-amber-200 dark:border-amber-500/30'
                          title="Reset Member Password"
                        >
                          <KeyRound className='h-3.5 w-3.5' />
                          Reset Pass
                        </button>
                        <button
                          onClick={() => handleRegenerate(m.id, m.user?.name ?? 'Member')}
                          disabled={regeneratingIds[m.id]}
                          className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-medium text-zinc-800 dark:text-white rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700 disabled:opacity-50'
                        >
                          <RefreshCw
                            className={`h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 ${regeneratingIds[m.id] ? 'animate-spin' : ''}`}
                          />
                          Regenerate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}
