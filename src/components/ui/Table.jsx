import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Table = forwardRef(({ className, columns, data, rowKey = "id", ...props }, ref) => {
  return (
    <div className="w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props}>
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
                  col.headerClassName
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data?.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                No results.
              </td>
            </tr>
          ) : (
            data?.map((row, index) => (
              <tr
                key={row[rowKey] || index}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
                      col.cellClassName
                    )}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});
Table.displayName = "Table";
