export interface Stone {
  id: number;
  munim: string | null;
  stoneType: string | null;
  date: string | null;
  total_quantity: number | null;
  total_amount: number | null;
}

export interface PageData {
  todis: any[];
  galas: any[];
  stones: Stone[];
}
