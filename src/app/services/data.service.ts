import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Task } from './task';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private storage: SQLiteObject;
  tasksList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform, 
    private sqlite: SQLite, 
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
  ) {
    this.platform.ready().then(() => {
      this.init();
    });
   }


   init(){
    return this.sqlite.create(
      {
        name:'lab8_db.db',
        location:'default'
      }
    ).then((db: SQLiteObject) => {
      this.storage = db;
      this.storage.executeSql('SELECT * FROM tasktable', [])
      .then(res=>{
        if(res.rows.length > 0){
          this.getTasks();
          this.isDbReady.next(true);
        }else{
          this.getFakeData();
        }
      })
      
    });
   }

  dbState() {
    return this.isDbReady.asObservable();
  }
 
  fetchTasks(): Observable<Task[]> {
    return this.tasksList.asObservable();
  }

    // Render fake data
    getFakeData() {
      this.httpClient.get(
        'assets/dump.sql', 
        {responseType: 'text'}
      ).subscribe(data => {
        this.sqlPorter.importSqlToDb(this.storage, data)
          .then(_ => {
            this.getTasks();
            this.isDbReady.next(true);
          })
          .catch(error => console.error(error));
      });
    }

  // Get list
  getTasks(){
    return this.storage.executeSql('SELECT * FROM tasktable', []).then(res => {
      let items: Task[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            id: res.rows.item(i).id,
            title: res.rows.item(i).title,  
            details: res.rows.item(i).details
           });
        }
      }
      this.tasksList.next(items);
    });
  }

  // Add
  addTask(title, details) {
    let data = [title, details];
    return this.storage.executeSql('INSERT INTO tasktable (title, details) VALUES (?, ?)', data)
    .then(res => {
      this.getTasks();
    });
  }
 
  // Get single object
  getTask(id): Promise<Task> {
    return this.storage.executeSql('SELECT * FROM tasktable WHERE id = ?', [id]).then(res => { 
      return {
        id: res.rows.item(0).id,
        title: res.rows.item(0).title,  
        details: res.rows.item(0).details
      }
    });
  }

  // Delete
  deleteTask(id) {
    return this.storage.executeSql('DELETE FROM tasktable WHERE id = ?', [id])
    .then(_ => {
      this.getTasks();
    });
  }
}
