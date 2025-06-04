export type Measure = {
  l: number
  b: number
  h: number
  rate: number
  labour?: string
  hydra?: string
  black_cost: number
  black_area: number
}

export interface Block {
  _id?: string
  block_id: string
  BlockType: string
  vender_id: string
  labour_name: string
  front_l: number
  front_b: number
  front_h: number
  back_l: number
  back_b: number
  back_h: number
  total_quantity: number
  issued_quantity: number
  left_quantity: number
  transport_cost: number
  hydra_cost: number
  truck_cost: number
  block: {
    blockcost: number
    addmeasures: Measure[]
  }[]
  final_total: number
  partyRemainingPayment: number
  partyAdvancePayment: number
  transportType: string
  date: string
  qty: number
  vehicle_number: string
  createdBy: string
  createdAt: string
  updatedAt: string
  total_cost?: number
  total_area?: number
  total_todi_cost?: number
  todirate?: number
  rate?: number
  block_amount?: number
  total_amount?: number
  munim?: string
}

export type Vendor = {
  id: number
  vendor: string
  vendor_no: string
  address: string
  mail_id: string
  Company_no: string
  phone: Array<{
    number: string
    type?: string
  }>
  createdAt: string
  updatedAt: string
}

