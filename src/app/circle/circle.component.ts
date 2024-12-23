import { Component, ElementRef, ViewChild } from '@angular/core';
import { Status } from 'src/enums/status';

@Component({
  selector: 'app-circle',
  imports: [],
  standalone: true,
  templateUrl: './circle.component.html',
  styleUrl: './circle.component.scss',
})
export class CircleComponent {
  @ViewChild('circleCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('duration') durationRef!: ElementRef<any>;
  canvas: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  private readonly startRadius = 50; // width of btn / 2
  private readonly endRadius = 125; // width of canvas / 2

  canvasXcenter: number;
  canvasYcenter: number;

  // Stato corrente del raggio
  currentRadius: number;
  animationFrame: number;
  isAnimating: boolean;

  constructor() {}

  ngOnInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.canvasXcenter = this.canvas.width / 2;
    this.canvasYcenter = this.canvas.height / 2;

    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.currentRadius = this.startRadius;
  }

  private drawCircle(radius: number): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw circle
    this.ctx.beginPath();
    this.ctx.arc(
      this.canvasXcenter,
      this.canvasYcenter,
      radius,
      0,
      Math.PI * 2
    );

    this.ctx.fillStyle = 'rgba(41, 199, 26, 0.8)';
    this.ctx.fill();
    this.ctx.closePath();
  }

  private animate = (duration: number, increase: boolean): void => {
    if (this.isAnimating) return;
    const targetRadius = increase ? this.endRadius : this.startRadius;
    const startTime = performance.now();
    const initialRadius = this.currentRadius;

    const step = (now: number) => {
      const elapsedTime = now - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      this.currentRadius =
        initialRadius + (targetRadius - initialRadius) * progress;
      this.drawCircle(this.currentRadius);

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      } else this.isAnimating = false;
    };

    cancelAnimationFrame(this.animationFrame); // Annulla eventuali animazioni precedenti
    this.animationFrame = requestAnimationFrame(step);
  };

  decrease() {
    this.animate(this.durationRef.nativeElement.value, false);
  }

  increase() {
    this.animate(this.durationRef.nativeElement.value, true);
  }

  clear() {
    cancelAnimationFrame(this.animationFrame);
    this.isAnimating = false;
    this.currentRadius = this.startRadius;
    this.canvas.width = this.canvas.width;
    this.canvas.height = this.canvas.height;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
