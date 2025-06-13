import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private socket : Socket;

  constructor() {
    this.socket = io("http://localhost:3333");
   }
   sendMessage(message : string){
    this.socket.emit('message', message);
   }

   onMessage(): Observable<string>{
    return new Observable(observer =>{
      this.socket.on('message',(data:string)=>{
        observer.next(data);
      });
     return ()=>{
       this.socket.off('message');
     };
    });
   }

  updateProfile(data :any){
    this.socket.emit('update-profile-socket',data);
  }
  onUpdateSuccess(): Observable<any>{
    return new Observable(observer =>{
      this.socket.on('update-success' , (msg)=> observer.next(msg));
    })
  }
  onUpdateError():Observable<any>{
    return new Observable(observer=>{
      this.socket.on('update-error', (msg)=> observer.next(msg));
    })
  }

   disconnect(){
    if(this.socket){
      this.socket.disconnect();
    }
   }

}
