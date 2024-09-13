import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListDataComponent } from './components/list-data/list-data.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ListDataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'list-app';
}
