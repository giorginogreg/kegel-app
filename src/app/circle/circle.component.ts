import { Component, ElementRef, ViewChild } from '@angular/core';
import { Status } from 'src/enums/status';

@Component({
  selector: 'app-circle',
  imports: [],
  standalone: true,
  templateUrl: './circle.component.html',
  styleUrl: './circle.component.scss'
})
export class CircleComponent {

  @ViewChild('circleCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  canvas: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  private readonly startRadius = 50; // width of btn / 2
  private readonly endRadius = 125; // width of canvas / 2

  canvasXcenter: number;
  canvasYcenter: number;

  private startTime!: number;

  constructor() {
    
  }
  
  ngOnInit() {
    
    this.canvas = this.canvasRef.nativeElement;
    this.canvasXcenter = this.canvas.width / 2;
    this.canvasYcenter = this.canvas.height / 2;

    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
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
  
    private animate = (currentTime: number, duration: number): void => {
      if (!this.startTime) {
        this.startTime = currentTime;
      }
  
      const elapsedTime = currentTime - this.startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      let currentRadius =
        this.startRadius + progress * (this.endRadius - this.startRadius);
      let growing = false;
  
      if (growing) {
        currentRadius += 2;
        if (currentRadius >= this.endRadius) {
          growing = false;
          requestAnimationFrame((curtime) => {
            this.animate(curtime, duration);
          });
        }
      } else {
        currentRadius -= 2;
        if (currentRadius <= this.startRadius) {
          growing = true;
          requestAnimationFrame((curtime) => {
            this.animate(curtime, duration);
          });
        }
      }
  
      this.drawCircle(currentRadius);
  
      if (progress < 1) {
        requestAnimationFrame((curtime) => {
          this.animate(curtime, duration);
        });
      }
      
    };
  
    private startAnimation(duration: number): void {
      requestAnimationFrame((curtime) => {
        this.animate(curtime, duration);
      });
    }
}
