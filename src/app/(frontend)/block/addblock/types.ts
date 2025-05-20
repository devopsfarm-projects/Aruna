export type Measure = {
  qty: number
  l: number
  b: number
  h: number
}

export type Block = {
  vender_id: string
  BlockType: string
  date: string
  mines: string
  qty: number
  todi: {
    todicost: number
    addmeasures: Measure[]
  }[]
  total_quantity: number
  issued_quantity: number
  left_quantity: number
  final_total: number
  partyRemainingPayment: number
  partyAdvancePayment: number
  transportType: string
  createdBy: string
}

export type Vendor = {
  id: number
  vendor: string
  vendor_no: string
  address: string
  mail_id: string
  Company_no: string
  Mines_name: {
    id: number
    Mines_name: string
  }
  phone: Array<{
    number: string
    type?: string
  }>
  createdAt: string
  updatedAt: string
}

export type Mines = {
  id: number
  Mines_name: string
  address: string
  phone: Array<{
    number: string
    type?: string
  }>
  mail_id: string
  createdAt: string
  updatedAt: string
}
