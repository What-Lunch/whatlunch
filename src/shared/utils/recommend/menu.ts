import { FoodTypeFilter, SituationFilter } from '../../../types/filters';

export interface MenuItem {
  name: string;
  types: FoodTypeFilter[];
  situations: SituationFilter[];
}
