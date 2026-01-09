import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private socket!: Socket;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  connect(employeeId: string) {
  this.socket = io('http://localhost:5000', { transports: ['websocket'] });

  this.socket.on('connect', () => {
    console.log('✅ Socket connected:', this.socket.id);
    console.log('🟢 Registering employeeId:', employeeId);
    this.socket.emit('register', employeeId);
  });

  this.socket.on('new-notification', (notif) => {
    console.log('🔔 New Notification:', notif);
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([notif, ...current]);
  });
}

}
