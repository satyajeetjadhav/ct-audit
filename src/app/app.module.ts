import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipePipe } from './date-pipe.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ReversePipe } from './reverse.pipe';
import { MetaToEnglishPipe } from './meta-to-english.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DatePipePipe,
    ReversePipe,
    MetaToEnglishPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
