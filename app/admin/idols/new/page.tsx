import { IdolForm } from "@/components/admin/idol-form";
import { getAdminAgencies } from "@/lib/queries/admin-queries";
export default async function NewIdolPage() {
  const agencies = await getAdminAgencies();
  return (
    <main className="p-6 text-zinc-100 sm:p-10">
      <h1 className="text-3xl font-semibold">New idol</h1>
      <p className="mt-2 text-zinc-500">Tambahkan profil idol ke katalog KPedia.</p>
      <div className="mt-8">
        <IdolForm agencies={agencies.map(({ id, name }) => ({ id, name }))} />
      </div>
    </main>
  );
}
