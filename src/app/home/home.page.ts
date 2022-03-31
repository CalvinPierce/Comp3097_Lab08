import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mainForm: FormGroup;
  Data: any[] = [{ id: 1, title: "Test", details: "task" }];

  constructor(
    private db: DataService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.db.dbState().subscribe(
      async (res) => {
        if (res) {
          this.db.fetchTasks().subscribe(async item => {
            this.Data = item;
            let toast = await this.toast.create({
              message: 'db loaded',
              duration: 2000
            });
            toast.present();
          })
        } else {
          let toast = await this.toast.create({
            message: 'Res is empty',
            duration: 2000
          });
          toast.present();
        }
      }
    );
    this.mainForm = this.formBuilder.group({
      title: [''],
      details: ['']
    });
  }

  storeData() {
    this.db.dbState().subscribe(async res => {
      let toast = await this.toast.create({
        message: `DB state: ${res}`,
        duration: 2500
      });
      toast.present();
      if (res) { } else {
        this.db.init().then(res => {


        }).catch(async error => {
          let toast = await this.toast.create({
            message: `error: ${error}`,
            duration: 2500
          });
          toast.present();
        })
      }
    });
    this.db.addTask(
      this.mainForm.value.title,
      this.mainForm.value.details
    )
      .then((res) => {
        this.mainForm.reset();

      }).catch(async error => {
        let toast = await this.toast.create({
          message: `error: ${error}`,
          duration: 2500
        });
        toast.present();
      });
  }

  deleteTask(id) {
    this.db.deleteTask(id).then(async (res) => {
      let toast = await this.toast.create({
        message: 'Task deleted',
        duration: 2500
      });
      toast.present();
    })
  }
}
