import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface BroadcastMessage {
  name: string;
  args?: Array<any>;
}

export interface BroadcastEvent {
  name: string;
}

export type BroadcastListener = (event: BroadcastEvent, ...args: Array<any>) => void;

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private broadcastSubject: Subject<BroadcastMessage> = new Subject();

  broadcast(name: string, ...args: Array<any>) {
    const message = {
      name,
      args
    } as BroadcastMessage;
    this.broadcastSubject.next(message);
  }

  on(name: string, listener: BroadcastListener): Subscription {
    return this.broadcastSubject.asObservable().pipe(
      filter((message) => message.name === name)
    ).subscribe(
      (message) => {
        const event = {
          name: message.name
        } as BroadcastEvent;
        listener(event, message.args);
      }
    );
  }

}