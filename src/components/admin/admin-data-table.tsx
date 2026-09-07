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

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/50">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-border/50 bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={cn("px-4 py-3 font-semibold", column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-border/40 last:border-0 hover:bg-secondary/30"
            >
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
  );
}
