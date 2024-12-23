import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CircleAnimatingService {
  constructor() {}
  private methodCallSource = new Subject<{
    duration: number;
    shouldGrow: boolean;
  }>();
  private secondCallSource = new Subject<void>();

  // Observable per ascoltare i metodi
  toggleIncrease$ = this.methodCallSource.asObservable();
  clearCircle$ = this.secondCallSource.asObservable();

  toggleIncrease(params: { duration: number; shouldGrow: boolean }) {
    this.methodCallSource.next(params);
  }

  clearCircle() {
    this.secondCallSource.next();
  }
}
