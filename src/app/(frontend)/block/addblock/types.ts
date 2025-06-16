import { ReactNode } from 'react'

export interface Measure {
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
  BlockType: string
  vender_id: string
  labour_name: string
  block: {
    blockcost: number
    addmeasures: Measure[]
  }[]
  qty: number
  vehicle_text: string
  hydra_cost: number
  truck_cost: number
  total_cost?: number
  total_area?: number
  total_todi_cost?: number
  todi_cost?: number
  final_total?: number
  estimateCost?: number
  finalCost?: number
  partyRemainingPayment?: number
  partyAdvancePayment?: number
  transportType?: string
  createdBy?: string
  block_id?: string
  l: number
  b: number
  h: number
  front_l?: number
  front_b?: number
  front_h?: number
  back_l?: number
  back_b?: number
  back_h?: number
  total_quantity?: number
  issued_quantity?: number
  left_quantity?: number
  transport_cost?: number
  depreciation?: number
  total_block_area?: number
  total_todi_area?: number
  total_b?: ReactNode
  remaining_amount?: ReactNode
  total_block_cost?: ReactNode
  Todi_cost?: string | number | readonly string[] | undefined
  g_hydra_cost?: string | number | readonly string[] | undefined
  g_truck_cost?: string | number | readonly string[] | undefined
  date?: string
  munim?: string
  _id?: string
  createdAt?: string
  updatedAt?: string
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

