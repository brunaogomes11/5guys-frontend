// src/components/tables/RotaResumo.tsx
import React from "react";

type Rota = {
  id: string;
  origem: string;
  destino: string;
  status: string;
  data: string;
};

export const RotaResumo = ({ rota }: { rota: Rota }) => {
  return (
    <tr className="border-b">
      <td className="p-2">{rota.origem}</td>
      <td className="p-2">{rota.destino}</td>
      <td className="p-2">{rota.status}</td>
      <td className="p-2">{rota.data}</td>
    </tr>
  );
};
