import { Component, OnInit } from '@angular/core';
import { Status } from '../status';
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    starting = new Audio();
    tick = new Audio();
    counterClass = "ready";
    counterBtnText = "Start";

    state = Status.Ready;

    sets = 5;
    currentSet = 1;
    seconds = 10;
    rest = 5;

    constructor(private titleService:Title) { }

    ngOnInit(): void {
        this.starting.src = "../../../assets/audio/starting.mp3";
        this.tick.src = "../../../assets/audio/tick.mp3";
        this.starting.load();
        this.tick.load();
    }

    counterBtnClick(): void {
        switch(this.state) {

            case Status.Ready: {
                this.state = Status.Starting;
                this.counterClass = "starting";
                this.starting.play();
                let num = 3;
                
                this.counterBtnText = num.toString();   
                this.titleService.setTitle(this.counterBtnText);

                let intervalId = setInterval(() => 
                {
                    num--;
                    this.counterBtnText = num.toString();
                    this.titleService.setTitle(this.counterBtnText);
            
                    if (num === 0) {
                        this.state = Status.Counting;
                        this.countAction();
                        clearInterval(intervalId);
                    }
                }, 1000)
                break;
            }

            case Status.Starting: {
                this.state = Status.Ready;
                break;
            }

            case Status.Counting: {
                this.state = Status.Ready;
                break;
            }

            case Status.Resting: {
                this.state = Status.Ready;
                break;
            }
        }
    }

    countAction(): void {
        switch(this.state) {
            case Status.Starting: {
                this.state = Status.Ready;
                break;
            }

            case Status.Counting: {
                this.counterBtnText = this.seconds.toString();
                this.titleService.setTitle("Kegeling... " + this.counterBtnText + ". Set " + this.currentSet + " of " + this.sets);
                this.counterClass = "counting"

                let countdown = this.seconds;
                this.tick.play();

                let intervalId = setInterval(() => 
                {
                    countdown--;
                    this.tick.play();
                    this.counterBtnText = countdown.toString();
                    this.titleService.setTitle("Kegeling... " + this.counterBtnText + ". Set " + this.currentSet + " of " + this.sets);
                
                    if (countdown === 0) {
                        this.state = Status.Resting;
                        clearInterval(intervalId);
                        this.countAction();
                    }
                }, 1000)
                break;
            }

            case Status.Resting: {
                this.counterBtnText = this.rest.toString();
                this.titleService.setTitle("Resting... " + this.counterBtnText + ". Set " + this.currentSet + " of " + this.sets);
                this.counterClass = "resting"

                let countdown = this.rest;

                let intervalId = setInterval(() => 
                {
                    countdown--;
                    this.counterBtnText = countdown.toString();
                    this.titleService.setTitle("Resting... " + this.counterBtnText + ". Set " + this.currentSet + " of " + this.sets);
                
                    if (countdown === 0) {
                        this.currentSet++;
                        if (this.currentSet > this.sets) {
                            this.state = Status.Ready;
                        } else {
                            this.state = Status.Counting;
                        }
                        clearInterval(intervalId);
                        this.countAction();
                    }
                }, 1000)
                break;
            }
        }
    }
}
