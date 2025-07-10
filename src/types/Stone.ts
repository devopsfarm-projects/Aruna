// ./src/types/Stone.ts

// An interface for your Vendor object (replaces 'any')
export interface Vendor {
  id: number;
  vendor: string;
  // ...add any other properties a vendor might have
}

// Your existing Stone interface is good
export interface Stone {
  id: number;
  munim: string | null;
  stoneType: string | null; // This is the property to display for Stone
  date: string | null;
  total_quantity: number | null;
  total_amount: number | null;
}

// NEW: A specific interface for Todi
export interface Todi {
  id: number;
  vender_id?: Vendor; // Use the specific Vendor type
  munim?: string;
  BlockType: string; // The property for Todi
  date?: string;
  l?: number;
  b?: number;
  h?: number;
  total_block_area?: number;
  total_block_cost?: number;
  final_cost?: number;
}

// NEW: A specific interface for Gala
export interface Gala {
  id: number;
  vender_id?: Vendor; // Use the specific Vendor type
  munim?: string;
  GalaType: string; // The property for Gala
  date?: string;
  total_gala_quantity?: number;
  total_gala_cost?: number;
}

// Your PageData interface, now with proper types instead of 'any'
export interface PageData {
  todis: Todi[];
  galas: Gala[];
  stones: Stone[];
}

// A helper "Union Type" that represents any possible item in your table
export type TableItem = Todi | Gala | Stone;