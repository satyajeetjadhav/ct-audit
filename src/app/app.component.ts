import { Component } from '@angular/core';
import { LogParserService } from './log-parser.service';
import { LogParserIosService } from './log-parser-ios.service'
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'audit';
  logForm;
  log;
  result;
  metadata;
  queue;

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
    // Process checkout data here
    
    this.metadata = {};
    this.queue = [];
    if(this.checkForOS(customerData.log)){
        this.logParseriOS.parseLog(customerData.log).then(
                result => {
                      this.metadata = result['metadata'];
                      this.queue = result['queue'];
                          }
              )
    }
    else{
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
    for(let line of logLines){
        if(line.includes('New event processed:')){
                return true;
                break;
          }
          else if (line.includes('Queued Event:')){
              return false;
              break;
          }
          else{
            continue;
          }
            
        }
        
    }


}
