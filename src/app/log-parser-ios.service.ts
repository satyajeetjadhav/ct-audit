import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogParserIosService {

  flags = {
    AccountDetails: false,
    PushNotificationEnabled: false,
    registerPNDataEntry : false
  }


  result = {
    metadata: {
      CleverTapRegion: false,
      CleverTapAccountID: false,
      CleverTapToken: false,
      PushNotificationEnabled: false,
      SDK_Version: '',
      Profile_Method: '',
      Push_Token: ''
    },
    queue: []

  }

  constructor() { }

  init() {
    this.result = {
      metadata: {
       CleverTapRegion: false,
       CleverTapAccountID: false,
       CleverTapToken: false,
       SDK_Version: '',
       PushNotificationEnabled: false,
       Profile_Method: '',
       Push_Token: ''
      },
      queue: []
    }
  }

  parseLog(blob: String): Promise<Object> {
    this.init();
    return new Promise((resolve, reject) => {
      let logLines = blob.split('\n');
      logLines.forEach(line => {
        for (var key in this.flags) {
          if (!(this.flags[key])) {
            switch (key) {
              case 'AccountDetails':  {
                //statements; 
                this.accountDetails(line);
                break;
              }
              case 'PushNotificationEnabled': {
                //statements; 
                this.checkForPN(line);
                break;
              }
              default: {
                //statements; 
                break;
              }
            }
          }
        }
      });
      logLines.forEach(line => {
        if(line.includes('onUserLogin')){
          this.result.metadata.Profile_Method = 'onUserLogin';
        }
        this.queuedEvent(line);
      });
      resolve(this.result);
    })
  }


  accountDetails(logLine: String) {
    if (logLine.includes('Initializing default CleverTap SDK')) {
      this.flags.AccountDetails = true;
      /* Initializing default CleverTap SDK instance. CleverTapAccountID: W6Z-6Z5-975Z CleverTapToken: 516-160 CleverTapRegion: default */
      let splitLine = logLine.split('CleverTapAccountID:');
      let accountId = splitLine[1].trim();
      this.result.metadata.CleverTapAccountID = accountId.split(' ')[0];
      this.result.metadata.CleverTapToken = logLine.split('CleverTapToken:')[1].trim().split(' ')[0];
      this.result.metadata.CleverTapRegion = logLine.split('CleverTapRegion:')[1].trim().split(' ')[0];
    }
  }

  checkForPN(logLine : String){
  	if (logLine.includes('registering APNs device token')){
  		this.flags.PushNotificationEnabled = true;
  		this.result.metadata.PushNotificationEnabled = true;
  	}
  }

  queuedEvent(logLine : String){
  	if (logLine.includes('Sending')) {
      let tempStr = (logLine.split('Sending '))[1]
      //console.log('Temp String '+tempStr);
      let eventJSONArrayString = (tempStr.split('to'))[0]
      //console.log('Final String '+eventJSONArrayString);
      let eventJSONArray;
      try {
        eventJSONArray = JSON.parse(eventJSONArrayString);
        //get sdk version
      this.result.metadata.SDK_Version = eventJSONArray[0]['af']['SDK Version'];
      //console.log('SDK Version'+eventJSONArray[0]['af']['SDK Version']);
      } catch (e) {
        console.log(e);
        console.log(logLine);
      }
      var queueObj = {
        events: [],
        profile: [],
        meta: [],
        data: []
      }
      eventJSONArray.forEach(eventJSON => {
        if (eventJSON['type'] === 'profile') {
          queueObj.profile.push(eventJSON);
        } else if ((eventJSON['type'] === 'event')) {
          queueObj.events.push(eventJSON);
        } else if ((eventJSON['type'] === 'data')) {
        if(this.flags.PushNotificationEnabled){
              this.result.metadata.Push_Token = eventJSON['data']['id']
            }
          if(!this.flags.registerPNDataEntry){
            this.flags.registerPNDataEntry = true;
            queueObj.data.push(eventJSON);
          }
          
        } else if ((eventJSON['type'] === 'meta')) {
          queueObj.meta.push(eventJSON);
        }
      });
      this.result.queue.push(queueObj);
    }
  }
}
