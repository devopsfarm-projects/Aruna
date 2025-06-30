
export interface Measure {
  l: string
  b: string
  h: string
  block_area: string
  block_cost: string
  id?: string | number
}

export interface Block {
  addmeasures: Measure[]
  block_cost: string
  todi_cost?: string
}

export interface Group {
  g_hydra_cost: string;
  g_truck_cost: string;
  date: string;
  block: Block[];
  [key: string]: string | Block[];
}



export type Vendor = {
  id: number
  vendor: string
  vendor_no: string
  address: string
}

export type BlockType = {
  total_cost: any
  GalaType: string
  block: any
  vender_id: number
  todi_cost: string
  total_area: number
  munim: string
  todirate: string
  total_gala_area: string
  total_block_area: string
  total_block_cost: string
  estimate_cost: string
  depreciation: string
  final_cost: string
  l: string
  front_b: string
  back_b: string
  total_b: string
  h: string
  gala_cost: string
  hydra_cost: string
  truck_cost: string
  total_gala_cost: string
  id: number | string
  BlockType: string
  date: string
  mines: number
  labour_name: string
  addmeasures: Measure[]
  total_quantity: number | null
  issued_quantity: number | null
  left_quantity: number | null
  final_total: number
  partyRemainingPayment: number
  partyAdvancePayment: number | null
  transportType: string | null
  createdBy: { name: string } | null
  createdAt: string
  updatedAt: string
  vehicle_cost: number | null
  vehicle_number: string | null
  group: Group[]
}