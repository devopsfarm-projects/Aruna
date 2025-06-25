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


import { ReactNode } from 'react'

export type GroupField = 'g_hydra_cost' | 'g_truck_cost' | 'total_block_area' | 'total_block_cost' | 'remaining_amount' | 'date'

export interface Measure {
  id: string;
  length: number;
  breadth: number;
  height: number;
  blockArea: number;
  blockCost: number;
  blackArea: number;
  blackCost: number;
  rate: number;
}

export interface Block {
  id: string;
  blockType: string;
  vendorId: string;
  munim: string;
  blockCost: number;
  addMeasures: Measure[];
  totalTodiArea: number;
  totalTodiCost: number;
  hydraCost: number;
  truckCost: number;
  todiCost: number;
  totalCost: number;
  totalArea: number;
  length: number;
  breadth: number;
  height: number;
  estimateCost: number;
  finalCost: number;
  transportType: string;
  quantity: number;
  groupHydraCost: number;
  groupTruckCost: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  blocks: Block[];
  totalBlockArea: number;
  depreciation: number;
  frontLength: number;
  frontBreadth: number;
  frontHeight: number;
  backLength: number;
  backBreadth: number;
  backHeight: number;
  transportCost: number;
  issuedQuantity: number;
  leftQuantity: number;
  partyAdvancePayment: number;
  partyRemainingPayment: number;
  totalQuantity: number;
}

export interface Group {
  id: string;
  date: string;
  hydraCost: number;
  truckCost: number;
  totalBlockArea: number;
  totalBlockCost: number;
  totalTodiArea: number;
  totalTodiCost: number;
  todiCost: number;
  totalCost: number;
  totalArea: number;
  estimateCost: number;
  finalCost: number;
  transportType: string;
  quantity: number;
  groupHydraCost: number;
  groupTruckCost: number;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  remainingAmount: number;
}

export interface Todi {
  id: string;
  blockType: string;
  vendorId: string;
  blockCost: number;
  totalTodiArea: number;
  totalTodiCost: number;
  hydraCost: number;
  truckCost: number;
  todiCost: number;
  totalCost: number;
  totalArea: number;
  blocks: Block[];
  groups: Group[];
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  length: number;
  breadth: number;
  height: number;
  estimateCost: number;
  finalCost: number;
  transportType: string;
  quantity: number;
  groupHydraCost: number;
  groupTruckCost: number;
  date: string;
  totalBlockArea: number;
  totalBlockCost: number;
  remainingAmount: number;
  vendor: {
    id: string;
    address: string;
    vendor: string;
    vendorNo: string;
    updatedAt: string;
    createdAt: string;
  };
  munim: string;
  frontLength: number;
  frontBreadth: number;
  frontHeight: number;
  backLength: number;
  backBreadth: number;
  backHeight: number;
  transportCost: number;
  issuedQuantity: number;
  leftQuantity: number;
  partyAdvancePayment: number;
  partyRemainingPayment: number;
  totalQuantity: number;
  depreciation: number;
}


export type MeasureField = 'length' | 'breadth' | 'height' | 'blockArea' | 'blockCost';

export interface Vendor {
  id: number;
  vendor: string;
  vendor_no: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}
