// src/components/tables/TabelaRotas.tsx
import React from "react";
import { RotaResumo } from "./RotaResumo";

type Rota = {
  id: string;
  origem: string;
  destino: string;
  status: string;
  data: string;
};

export const TabelaRotas = ({ rotas }: { rotas: Rota[] }) => {
  return (
    <table className="w-full table-auto border">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2">Origem</th>
          <th className="p-2">Destino</th>
          <th className="p-2">Status</th>
          <th className="p-2">Data</th>
        </tr>
      </thead>
      <tbody>
        {rotas.map((rota) => (
          <RotaResumo key={rota.id} rota={rota} />
        ))}
      </tbody>
    </table>
  );
};
