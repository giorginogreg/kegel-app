import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Status } from '../../enums/status';
import { Title } from '@angular/platform-browser';
import * as defaultSerie from '../../assets/series/defaultSerie.json';
import { Exercise } from '../models/exercise';
import exercises from '../../assets/exercises.json';
import { CircleComponent } from '../circle/circle.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html', 
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  

  starting = new Audio();
  tick = new Audio();
  counterClass = 'ready';
  counterBtnText = 'Start';

  public Status = Status; // For letting the template recognize statuses

  state = Status.Ready;

  currentExercise: Exercise | null;

  exercises: Exercise[] = [];
  exerciseIndex = 0;


  constructor(private titleService: Title) {
    
  }

  ngOnInit(): void {

    // Per ogni esercizio nella defaultSerie mi creo un oggetto esercizio a partire dal codice
    // Carico la defaultSerie
    defaultSerie.exercises.forEach((exercise) => {
      this.exercises.push(this.findExerciseByCode(exercise));
    });

  }


  async counterBtnClick() {
    
    switch (this.state) {
      case Status.Ready: {

        // If i am ready, i have to do countdown now
        this.counterClass = 'starting';
        
        //this.starting.play();
        let countdown = 3;

        while (countdown > 0) {
          this.counterBtnText = countdown.toString();
          countdown--;
          await this.sleep(1000);
        }

        // Changing status to counting (countdown - 3... 2... 1...)
        this.state = Status.Counting; // Exercise

        break;
      }

      case Status.Counting: {
        this.currentExercise = this.exercises[this.exerciseIndex];
        this.counterClass = 'counting';

        let cycles = this.currentExercise.cycles ?? 1;

        for (let i = 0; i < cycles; i++) {
          let remainingSeconds =
            this.currentExercise.duration ??
            this.currentExercise.phases.reduce(
              (partialSum, phase) => partialSum + phase.transition,
              0
            );

          for (const phase of this.currentExercise.phases) {
            //this.startAnimation(phase.transition * 1000);

            while (remainingSeconds > 0) {
              this.counterBtnText = remainingSeconds.toString();
              await this.sleep(1000);

              // Attende 1 sec, poi...
              remainingSeconds--;
            }
          }
        }

        this.exerciseIndex++;
        this.state =
          this.exerciseIndex > this.exercises.length
            ? Status.Ready
            : Status.Resting;
        if (this.state == Status.Ready) this.counterClass = 'ready'; // Finished serie

        break;
      }
      case Status.Resting: {
        this.counterBtnText = defaultSerie.defaultRestTime.toString();
        this.counterClass = 'resting';
        let countdown = defaultSerie.defaultRestTime;
        this.currentExercise = null;

        while (countdown > 0) {
          await this.sleep(1000);
          countdown--;
          this.counterBtnText = countdown.toString();
        }

        //this.currentSet++;
        //this.state =
        //  this.currentSet > this.sets ? Status.Ready : Status.Counting;
        this.state = Status.Counting;
        break;
      }
    }
    this.counterBtnClick();
  }


  sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };


  findExerciseByCode(code: string): Exercise {
    const allExercises: Exercise[] = exercises.exercises;
    let maybeExercise = allExercises.filter(
      (exercise) => exercise.code === code
    );
    const exercise = new Exercise();
    exercise.code = maybeExercise[0]['code'];
    exercise.name = maybeExercise[0]['name'];
    exercise.phases = maybeExercise[0]['phases'];
    exercise.cycles = maybeExercise[0]['cycles'];
    exercise.duration = maybeExercise[0]['duration'];

    return exercise;
  }
}
