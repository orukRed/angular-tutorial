import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages:string[] = [];

  public add(mes: string){
    this.messages.push(mes)
  }

  public clear(){
    this.messages=[];
  }
  
  constructor() { }
}
