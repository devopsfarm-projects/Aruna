
export interface Block {
  id: string;
  addmeasures: {
    id: string;
    l: string;
    b: string;
    h: string;
    block_area: string;
    block_cost: string;
  }[];
}

export interface Group {
  g_hydra_cost: string
  g_truck_cost: string
  date: string
  block: Block[]
  total_block_area: string
  total_block_cost: string
  [key: string]: string | Block[]
}

export interface TodiState {
  id: string;
  total_gala_cost: string;
  total_gala_area: string;
  total_block_cost: string;
  total_block_area: string;
  vender_id: string | number | readonly string[] | undefined;
  munim: string;
  GalaType: string;
  date: Date | string;
  l: string;
  front_b: string;
  back_b: string;
  total_b: string;
  h: string;
  gala_cost: string;
  hydra_cost: string;
  truck_cost: string;

  estimate_cost: string;
  depreciation: string;
  final_cost: string;
  group: Group[];
}