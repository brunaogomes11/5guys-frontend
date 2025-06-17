"use client";

type Rota = {
  id: string;
  origem: string;
  destino: string;
  status: string;
  data: string;
};

export default function VisualizarTransporteModal({
  rota,
  onClose,
}: {
  rota: Rota | null;
  onClose: () => void;
}) {
  if (!rota) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Detalhes da Rota</h2>
        <div className="space-y-2 text-sm">
          <p><strong>ID:</strong> {rota.id}</p>
          <p><strong>Origem:</strong> {rota.origem}</p>
          <p><strong>Destino:</strong> {rota.destino}</p>
          <p><strong>Status:</strong> {rota.status}</p>
          <p><strong>Data:</strong> {rota.data}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
