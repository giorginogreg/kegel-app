import { Phase } from './phase';

export class Exercise {
  code: string;
  name: string;
  description?: string;
  phases: Phase[];
  cycles?: number;
}
