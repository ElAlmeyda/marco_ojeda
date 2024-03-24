import { Component } from '@angular/core';
import { UsuariosService } from './backend/usuarios.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  showList = false;
  change = false;

  public citas = [
    {
      dia :"13/02/2023",
      hora : "09:00"
    },
    {
      dia :"14/02/2023",
      hora : "10:00"
    }

];

  toggleList() {
    this.showList = !this.showList;
  }

  constructor(private changeLogin: UsuariosService) {
    this.change= changeLogin.getLogin();
  }

  logout(){
    this.change = !this.change;
    this.changeLogin.changeUserLogin(this.change);
  }
}
