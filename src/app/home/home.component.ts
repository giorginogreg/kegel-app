import { Component, OnInit } from '@angular/core';
import { Status } from '../../enums/status';
import { Title } from '@angular/platform-browser';
import * as defaultSerie from '../../assets/series/defaultSerie.json';
import { Exercise } from '../models/exercise';
import exercises from '../../assets/exercises.json';
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

  sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  constructor(private titleService: Title) {
    // Per ogni esercizio nella defaultSerie mi creo un oggetto esercizio a partire dal codice
    // Carico la defaultSerie
    defaultSerie.exercises.forEach((exercise) => {
      this.exercises.push(this.findExerciseByCode(exercise));
    });
  }

  ngOnInit(): void {}


  
  async counterBtnClick() {
    switch (this.state) {
      case Status.Ready: {
        this.state = Status.Starting;
        this.counterClass = 'starting';
        //this.starting.play();
        let countdown = 3;

        this.counterBtnText = countdown.toString();

        //let intervalId = setInterval(() => {
        while (countdown > 0) {
          this.counterBtnText = countdown.toString();
          countdown--;
          await this.sleep(1000);
        }
        this.state = Status.Counting; // Exercise
        break;
      }
      case Status.Counting: {
        this.currentExercise = this.exercises[this.exerciseIndex];
        this.counterClass = 'counting';
        let cycles = this.currentExercise.cycles ?? 1;
        let remainingSeconds = this.currentExercise.duration ?? this.currentExercise.phases.reduce((partialSum, phase) => partialSum + phase.transition, 0);
        for (let index = 0; index < cycles; index++) {
          for (const phase of this.currentExercise.phases) {

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
    if (this.state !== Status.Ready) this.counterBtnClick();
  }

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
