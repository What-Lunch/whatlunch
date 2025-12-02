import { FoodTypeFilter, SituationFilter } from './filters';

export interface MenuItem {
  name: string;
  types: FoodTypeFilter[];
  situations: SituationFilter[];
}
