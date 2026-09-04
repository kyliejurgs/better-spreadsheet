import { Component, computed, signal } from '@angular/core';
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
  protected readonly replaceText = signal('');

  protected readonly matchCase = signal(false);
  protected readonly matchWholeValue = signal(false);
  protected readonly replaceExpanded = signal(false);

  protected toggleMatchCase(): void {
    this.matchCase.update((value) => !value);
  }

  protected toggleMatchWholeValue(): void {
    this.matchWholeValue.update((value) => !value);
  }

  protected toggleReplace(): void {
    this.replaceExpanded.update((expanded) => !expanded);
  }

  protected clearSearch(): void {
    this.searchText.set('');
  }

  protected clearReplace(): void {
    this.replaceText.set('');
  }

  protected readonly canReplaceAll = computed(() => {
    return this.searchText().length > 0 && this.replaceText().length > 0;
  });
}
