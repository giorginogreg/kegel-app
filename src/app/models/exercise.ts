import { Phase } from './phase';

export class Exercise {
  code: string;
  name: string;
  description?: string;
  duration?: number; // Equal to sum of all phases's transition if not specified
  phases: Phase[];
  cycles?: number;
}
