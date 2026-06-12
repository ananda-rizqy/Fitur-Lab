import { Button } from "../../components/ui/button";
export function AlatTable() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Inventaris Alat</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          {" "}
          + Tambah Alat{" "}
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Nama Alat</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="p-4 font-medium">Osiloskop Digital</td>
              <td className="p-4 text-gray-600">Elektronika</td>
              <td className="p-4">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Tersedia
                </span>
              </td>
              <td className="p-4 flex justify-center gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  Hapus
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
