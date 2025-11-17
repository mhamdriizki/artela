import {Component, LOCALE_ID} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {registerLocaleData} from '@angular/common';
import localeId from '@angular/common/locales/id';

registerLocaleData(localeId);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [{ provide: LOCALE_ID, useValue: 'id-ID' }]
})
export class App {
  protected title = 'invitation-wedding-app';
}
