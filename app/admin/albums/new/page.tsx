import { AlbumForm } from "@/components/admin/album-form";
import { getAdminGroups, getAdminIdols } from "@/lib/queries/admin-queries";
export default async function NewAlbumPage() {
  const [groups, idols] = await Promise.all([getAdminGroups(), getAdminIdols()]);
  return (
    <main className="p-6 text-zinc-100 sm:p-10">
      <h1 className="text-3xl font-semibold">New album</h1>
      <div className="mt-8">
        <AlbumForm
          groups={groups.map(({ id, name }) => ({ id, name }))}
          idols={idols.map(({ id, stageName }) => ({ id, stageName }))}
        />
      </div>
    </main>
  );
}
