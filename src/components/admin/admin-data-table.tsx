import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AdminTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
};

interface AdminDataTableProps<T> {
  columns: AdminTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty: ReactNode;
}

export function AdminDataTable<T>({ columns, rows, rowKey, empty }: AdminDataTableProps<T>) {
  if (rows.length === 0) {
    return <>{empty}</>;
  }

  const primary = columns[0];

  return (
    <>
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <article key={rowKey(row)} className="rounded-2xl border border-border/50 bg-card/40 p-4">
            {primary ? <div className="mb-3">{primary.cell(row)}</div> : null}
            <dl className="space-y-2 text-sm">
              {columns.slice(1).map((column) =>
                column.hideOnMobile ? null : (
                  <div key={column.id} className="flex items-start justify-between gap-3">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {column.header}
                    </dt>
                    <dd className="text-right">{column.cell(row)}</dd>
                  </div>
                )
              )}
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-border/50 md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/50 bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column.id} scope="col" className={cn("px-4 py-3 font-semibold", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-border/40 last:border-0 hover:bg-secondary/30">
                {columns.map((column) => (
                  <td key={column.id} className={cn("px-4 py-3 align-middle", column.className)}>
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
