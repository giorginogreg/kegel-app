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

  state = Status.Ready;

  sets = 5;
  currentSet = 1;

  currentExercise: Exercise;

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
        this.starting.play();
        let countdown = 3;

        this.counterBtnText = countdown.toString();
        this.titleService.setTitle(this.counterBtnText);

        //let intervalId = setInterval(() => {
        while (countdown >= 0) {
          this.counterBtnText = countdown.toString();
          this.titleService.setTitle(this.counterBtnText);

          if (countdown === 0) {
            this.state = Status.Counting;
            this.countAction();
            //  clearInterval(intervalId);
          }
          countdown--;
          await this.sleep(1000);
        }
        //}, 1000);
        break;
      }

      case Status.Starting || Status.Counting || Status.Resting: {
        this.state = Status.Ready;
        break;
      }
    }
  }

  async countAction() {
    while (this.exerciseIndex < this.exercises.length) {
      switch (this.state) {
        case Status.Starting: {
          this.state = Status.Ready;
          break;
        }

        case Status.Counting: {
          this.currentExercise = this.exercises[this.exerciseIndex];
          let cycles = this.currentExercise.cycles ?? 1;
          for (let index = 0; index < cycles; index++) {
            for (const phase of this.currentExercise.phases) {
              let remainingSeconds = phase.duration ?? phase.transition;

              while (remainingSeconds > 0) {
                await this.sleep(1000);

                // Attende 1 sec, poi...
                remainingSeconds--;
                this.counterBtnText = remainingSeconds.toString();
                this.titleService.setTitle(this.counterBtnText);
              }
            }
          }
          this.state = Status.Resting;
          this.exerciseIndex++;
          break;
        }

        case Status.Resting: {
          this.counterBtnText = defaultSerie.defaultRestTime.toString();
          this.counterClass = 'resting';
          let countdown = defaultSerie.defaultRestTime;

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
    }
    this.state = Status.Ready;
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

    return exercise;
  }
}
