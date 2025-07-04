export interface ApiResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  pagingCounter: number
  prevPage?: number
  nextPage?: number
}


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
}

export interface Group {
  g_hydra_cost: string;
  g_truck_cost: string;
  date: string;
  block: Block[];
  [key: string]: string | Block[];
}

// Define valid field names for each level
export type GroupField = keyof Group

export type Vendor = {
  id: number
  vendor: string
  vendor_no: string
  address: string
}

export type BlockType = {
  total_todi_cost: any
  block: any
  vender_id: number | Vendor
  total_todi_area: number
  munim: string
  todirate: string
  total_block_area: string
  final_cost: string
  depreciation: string
  l: string
  b: string
  h: string
  todi_cost: string
  hydra_cost: string
  truck_cost: string
  total_block_cost: string
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
  delivered_block: Array<{
    delivered_block_area: number
    delivered_block_cost: number
    date: string
    description: string
  }>
  received_amount: Array<{
    id: string
    amount: number
    date: string
    description: string
  }>
}
