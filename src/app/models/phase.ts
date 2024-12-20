import { PhaseStatus } from 'src/enums/status';

export class Phase {
  message: string;
  status: PhaseStatus;
  transition: number;
  duration?: number; // Equal to transition if not specified
}
