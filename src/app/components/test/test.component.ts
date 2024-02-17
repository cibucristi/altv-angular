import { Component } from '@angular/core';
import { GameComponent } from '../../decorators/dynamic-component';

@GameComponent('test')
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

}
