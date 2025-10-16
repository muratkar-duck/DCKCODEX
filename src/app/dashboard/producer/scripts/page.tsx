import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { producerNavItems } from "@/constants/dashboard";

const sampleScripts = [
  { title: "Göbeklitepe Günlükleri", writer: "writer@ducktylo.test", price: 3200 },
  { title: "Sahildeki Düşler", writer: "writer@ducktylo.test", price: 2700 },
];

export default function ProducerScriptsPage() {
  return (
    <AuthGuard allowedRoles={["producer"]}>
      <DashboardShell
        title="Satın Aldığım Senaryolar"
        description="orders tablosu üzerinden filtrelenmiş senaryolar burada listelenir."
        navItems={producerNavItems}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Senaryo</TableHeaderCell>
              <TableHeaderCell>Yazar</TableHeaderCell>
              <TableHeaderCell className="text-right">Tutar</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleScripts.map((script) => (
              <TableRow key={script.title}>
                <TableCell>{script.title}</TableCell>
                <TableCell>{script.writer}</TableCell>
                <TableCell className="text-right">
                  {script.price.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardShell>
    </AuthGuard>
  );
}
