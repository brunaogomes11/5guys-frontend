"use client";

type Rota = {
  id: string;
  origem: string;
  destino: string;
  status: string;
  data: string;
};

type Props = {
  status: 'emAndamento' | 'concluidos' | 'emEspera';
  rotas: Rota[];
};

const statusLabel = {
  emAndamento: "Em Andamento",
  concluidos: "Concluídos",
  emEspera: "Em Espera",
};

const TransporteTable = ({ status, rotas }: Props) => {
  return (
    <div className="w-full mt-6">
      <h2 className="text-lg font-semibold mb-4">{statusLabel[status]}</h2>

      {rotas.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Nenhuma rota encontrada.
        </div>
      ) : (
        <table className="w-full border border-gray-300 rounded-md overflow-hidden text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Origem</th>
              <th className="p-3">Destino</th>
              <th className="p-3">Status</th>
              <th className="p-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {rotas.map((rota) => (
              <tr key={rota.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{rota.origem}</td>
                <td className="p-3">{rota.destino}</td>
                <td className="p-3">{statusLabel[rota.status as keyof typeof statusLabel] ?? rota.status}</td>
                <td className="p-3">{rota.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransporteTable;
