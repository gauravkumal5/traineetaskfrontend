import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface IMessage {
    text: string,
    category: string
}

@Injectable({
    providedIn: 'root'
})

export class MessageService {
    constructor() { }
    private subject = new BehaviorSubject<any>(null);

    sendMessage(data: IMessage) {
        console.log("Sending message: ", data)
        this.subject.next({ data: data });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

}