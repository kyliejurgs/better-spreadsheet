import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-search',
  imports: [FormsModule, TuiIcon, TuiTextfield],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  protected readonly searchText = signal('');
  protected readonly matchCase = signal(false);
  protected readonly matchWholeWord = signal(false);

  protected toggleMatchCase(): void {
    this.matchCase.update((value) => !value);
  }

  protected toggleMatchWholeWord(): void {
    this.matchWholeWord.update((value) => !value);
  }

  protected clearSearch(): void {
    this.searchText.set('');
  }
}
