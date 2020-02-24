import { Component } from '@angular/core';
import { LogParserService } from './log-parser.service';
import { LogParserIosService } from './log-parser-ios.service'
import { FormBuilder } from '@angular/forms';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'audit';
  logForm;
  metadata;
  queue;
  EDSMap = new Map();
  iOS = false;

  constructor(
    private logParser: LogParserService,
    private logParseriOS: LogParserIosService,
    private formBuilder: FormBuilder
  ) {
    this.logForm = this.formBuilder.group({
      log: ''
    });
  }

  onSubmit(customerData) {
    this.metadata = {};
    this.queue = [];
    if (this.checkForOS(customerData.log)) {
      this.logParseriOS.parseLog(customerData.log).then(
        result => {
          this.metadata = result['metadata'];
          this.queue = result['queue'];
        }
      )
    }
    else {
      this.logParser.parseLog(customerData.log).then(
        result => {
          this.metadata = result['metadata'];
          this.queue = result['queue'];
        }
      )
    }
  }

  checkForOS(logData: String): boolean {

    let logLines = logData.split('\n');
    for (let line of logLines) {
      if (line.includes('New event processed:')) {
        this.iOS = true;
        return true;
      }
      else if (line.includes('Queued Event:')) {
        return false;
      }
      else {
        continue;
      }

    }

  }

  getProfileUrl(CTID: String) {
    let region = this.metadata['AccountRegion'] === '' ? 'eu1' : this.metadata['AccountRegion'];
    let accountId = this.metadata['AccountId'];
    return 'https://' + region + '.dashboard.clevertap.com/' + accountId + '/' + CTID + '/profile-view.html';
  }

  onFileLoad(fileLoadedEvent) {
    let currentlyProcessingEvent = '';
    let self = this;
    Papa.parse(fileLoadedEvent.target.result, {
      worker: true,
      header: true,
      step: function (row) {
        let iName = 'Event Name';
        let iProperty = 'Event Property';
        if (row.data[iName] !== '') {
          currentlyProcessingEvent = row.data[iName];
          self.EDSMap.set(row.data[iName], [row.data[iProperty]]);
        } else {
          self.EDSMap.get(currentlyProcessingEvent).push(row.data[iProperty]);
        }
      }
    });
  }

  onFileSelect(input: HTMLInputElement) {

    const files = input.files;

    if (files && files.length) {
      const fileToRead = files[0];

      const fileReader = new FileReader();
      fileReader.onload = this.onFileLoad.bind(this);

      fileReader.readAsText(fileToRead, "UTF-8");
    }


  }

  isEventInEDS(eventName: String) {
    return this.EDSMap.has(eventName);
  }

  isEventPropertyInEDS(eventName: String, eventProperty: String) {
    if (this.EDSMap.has(eventName)) {
      if (this.EDSMap.get(eventName).indexOf(eventProperty) > -1) {
        return true;
      }
    } else {
      return false;
    }
  }

  wasEventRaised(eventName: String) {
    for (let i = 0; i < this.queue.length; i++) {
      for (let j = 0; j < this.queue[i].events.length; j++) {
        if (this.queue[i].events[j].evtName === eventName) {
          return true;
        }
      }
    }
    return false;
  }

  wasEventPropertyRaised(eventName: String, propertyName: string) {
    for (let i = 0; i < this.queue.length; i++) {
      for (let j = 0; j < this.queue[i].events.length; j++) {
        if (this.queue[i].events[j].evtName === eventName) {
          if (Object.keys(this.queue[i].events[j].evtData).indexOf(propertyName) > -1) {
            return true;
          }
        }
      }
    }
    return false;
  }

  reset() {
    for (const prop of Object.getOwnPropertyNames(this.metadata)) {
      delete this.metadata[prop];
    }
    this.queue = [];
    this.EDSMap = new Map();
  }

  showResults() {
    if ((this.metadata != null && (Object.keys(this.metadata)).length > 0)
      || (this.queue != null && this.queue.length > 0)) {
      return true;
    } else {
      return false;
    }
  }
}
