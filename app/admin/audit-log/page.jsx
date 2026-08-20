import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getUserRole } from '@/app/data/userProfile';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 50;

const ACTION_TYPES = [
  'inventory.created',
  'inventory.updated',
  'inventory.deleted',
  'show.created',
  'show.deleted',
  'show_inventory.assigned',
  'show_inventory.updated',
  'show_inventory.removed',
  'user.created',
];

export default async function AuditLogPage({ searchParams: searchParamsPromise }) {
  const searchParams = await searchParamsPromise;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const role = await getUserRole(supabase, user);
  if (role !== 'admin') {
    redirect('/');
  }

  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);
  const filter = searchParams?.filter ?? '';

  // Build main query
  let query = supabase
    .from('actions_log')
    .select('id, user_id, action_type, action_details, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (filter) {
    query = query.eq('action_type', filter);
  }

  const { data: logs, count, error } = await query;

  if (error) {
    console.error('[AuditLog] Query error:', error.message);
  }

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

  if (error) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto">
        <h1 className="text-2xl text-center font-bold mt-4">Audit Log</h1>
        <div className="p-4">
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load audit log: {error.message}
          </div>
        </div>
      </div>
    );
  }

  function buildUrl(newPage, newFilter) {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', String(newPage));
    if (newFilter) params.set('filter', newFilter);
    const qs = params.toString();
    return `/admin/audit-log${qs ? `?${qs}` : ''}`;
  }

  function formatTimestamp(ts) {
    if (!ts) return '—';
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date(ts));
    } catch {
      return ts;
    }
  }

  function formatDetails(details) {
    if (details === null || details === undefined) return '—';
    if (typeof details === 'string') return details;
    try {
      return JSON.stringify(details, null, 2);
    } catch {
      return String(details);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <h1 className="text-2xl text-center font-bold mt-4">Audit Log</h1>

      <div className="p-4">
        {/* Filter controls */}
        <form method="GET" action="/admin/audit-log" className="flex items-center gap-3 mb-4">
          <label htmlFor="filter" className="text-sm font-medium text-muted-foreground">
            Filter by action type:
          </label>
          <select
            id="filter"
            name="filter"
            defaultValue={filter}
            className={cn(
              'h-10 rounded-md border border-input bg-background px-3 py-2 text-sm',
              'ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          >
            <option value="">All</option>
            {ACTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className={cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium',
              'h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90',
              'ring-offset-background transition-colors focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
          >
            Apply
          </button>
          {filter && (
            <a
              href="/admin/audit-log"
              className={cn(
                'inline-flex items-center justify-center rounded-md text-sm font-medium',
                'h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                'ring-offset-background transition-colors focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              )}
            >
              Clear
            </a>
          )}
        </form>

        {/* Results summary */}
        <p className="text-sm text-muted-foreground mb-3">
          {count !== null && count !== undefined
            ? `${count} total entries${filter ? ` for "${filter}"` : ''} — page ${page} of ${totalPages}`
            : 'Loading…'}
        </p>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-52">Timestamp</TableHead>
                <TableHead className="w-72">User ID</TableHead>
                <TableHead className="w-48">Action Type</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!logs || logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No audit log entries found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {formatTimestamp(entry.created_at)}
                    </TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[288px]">
                      {entry.user_id ?? '—'}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                        {entry.action_type ?? '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <pre className="text-xs whitespace-pre-wrap break-all max-w-xl font-mono">
                        {formatDetails(entry.action_details)}
                      </pre>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <a
              href={page > 1 ? buildUrl(page - 1, filter) : undefined}
              aria-disabled={page <= 1}
              className={cn(
                'inline-flex items-center justify-center rounded-md text-sm font-medium',
                'h-10 px-4 py-2 border border-input bg-background',
                'ring-offset-background transition-colors focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                page <= 1
                  ? 'opacity-50 pointer-events-none'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              Previous
            </a>

            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>

            <a
              href={page < totalPages ? buildUrl(page + 1, filter) : undefined}
              aria-disabled={page >= totalPages}
              className={cn(
                'inline-flex items-center justify-center rounded-md text-sm font-medium',
                'h-10 px-4 py-2 border border-input bg-background',
                'ring-offset-background transition-colors focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                page >= totalPages
                  ? 'opacity-50 pointer-events-none'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              Next
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
