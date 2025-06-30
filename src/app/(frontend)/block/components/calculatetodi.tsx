import { Group } from "./type"

const calculateTotalTodiArea = (l: string, b: string, h: string): string => {
    const length = parseFloat(l) || 0;
    const breadth = parseFloat(b) || 0;
    const height = parseFloat(h) || 0;
    return (length * breadth * height).toFixed(2);
  };

 const calculateTotalTodiCost = (todiCost: string, hydraCost: string, truckCost: string): string => {
    const todi = parseFloat(todiCost) || 0;
    const hydra = parseFloat(hydraCost) || 0;
    const truck = parseFloat(truckCost) || 0;
    return (todi + hydra + truck).toFixed(2);
  };

 const calculateEstimateCost = (totalArea: string, totalCost: string): string => {
    return (parseFloat(totalArea) * parseFloat(totalCost)).toFixed(2);
  };

 const calculateFinalCost = (estimate: string, depreciation: string): string => {
    return ((parseFloat(estimate) - ((parseFloat(depreciation)/100)*parseFloat(estimate)))).toFixed(2);
  };

 export const calculateTotalBlockArea = (group: Group[]): string => {
    return group.reduce((total, group) => {
      return total + group.block.reduce((groupTotal, block) => {
        return groupTotal + block.addmeasures.reduce((measureTotal, measure) => {
          return measureTotal + parseFloat(measure.block_area || '0');
        }, 0);
      }, 0);
    }, 0).toFixed(2);
  };

 export const calculateTotalBlockCost = (group: Group[]): string => {
    return group.reduce((total, group) => {
      return total + group.block.reduce((groupTotal, block) => {
        return groupTotal + block.addmeasures.reduce((measureTotal, measure) => {
          return measureTotal + parseFloat(measure.block_cost || '0');
        }, 0);
      }, 0);
    }, 0).toFixed(2);
  };




 export const handleInput = (e: any, setTodi: (prev: any) => void) => {
    const { name, value } = e.target;
    // Update the state with the new value
    setTodi((prev: any) => {
      const updatedTodi = { ...prev, [name]: value };
      
      // If any dimension changes, recalculate total_todi_area
      if (name === 'l' || name === 'b' || name === 'h') {
        updatedTodi.total_todi_area = calculateTotalTodiArea(
          updatedTodi.l || '0',
          updatedTodi.b || '0',
          updatedTodi.h || '0'
        );
      }

      // If any cost field changes, recalculate total_todi_cost
      if (name === 'todi_cost' || name === 'hydra_cost' || name === 'truck_cost') {
        // Convert input value to number and back to string
        const todiNum = parseFloat(updatedTodi.todi_cost || '0');
        updatedTodi.todi_cost = todiNum.toFixed(2);
        
        updatedTodi.total_todi_cost = calculateTotalTodiCost(
          updatedTodi.todi_cost || '0',
          updatedTodi.hydra_cost || '0',
          updatedTodi.truck_cost || '0'
        );
      }

      // Always recalculate estimate_cost if total_gala_area or total_gala_cost is available
      if (updatedTodi.total_todi_area && typeof updatedTodi.total_todi_area === 'string' &&
          updatedTodi.total_todi_cost && typeof updatedTodi.total_todi_cost === 'string') {
        const area = parseFloat(updatedTodi.total_todi_area);
        const cost = parseFloat(updatedTodi.total_todi_cost);
        if (area > 0 && cost > 0) {
          updatedTodi.estimate_cost = calculateEstimateCost(
            updatedTodi.total_todi_area,
            updatedTodi.total_todi_cost
          );
        }
      }

      // Always recalculate final_cost if estimate_cost is available
      if (updatedTodi.estimate_cost) {
        const depreciation = parseFloat(updatedTodi.depreciation || '0');
        if (depreciation > 0) {
          updatedTodi.final_cost = calculateFinalCost(
            updatedTodi.estimate_cost,
            updatedTodi.depreciation
          );
        } else {
          // If depreciation is removed or 0, set final_cost to estimate_cost
          updatedTodi.final_cost = updatedTodi.estimate_cost;
        }
      }

      // Recalculate total block area and cost whenever group data changes
      if (name.startsWith('group.') || name.startsWith('block.') || name.startsWith('addmeasures.')) {
        updatedTodi.total_block_area = calculateTotalBlockArea(updatedTodi.group);
        updatedTodi.total_block_cost = calculateTotalBlockCost(updatedTodi.group);
      }
      
      return updatedTodi;
    });
  }




  