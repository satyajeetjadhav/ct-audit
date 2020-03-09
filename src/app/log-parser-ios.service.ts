import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogParserIosService {

  flags = {
    AccountDetails: false,
    PushNotificationEnabled: false,
    registerPNDataEntry: false,
    AutoIntegrate: false
  }


  result = {
    metadata: {
      CleverTapRegion: '',
      CleverTapAccountID: '',
      CleverTapToken: '',
      PushNotificationEnabled: false,
      SDK_Version: '',
      Profile_Method: '',
      Push_Token: '',
      AutoIntegrate: false
    },
    queue: []

  }

  constructor() { }

  init() {
    this.result = {
      metadata: {
        CleverTapRegion: '',
        CleverTapAccountID: '',
        CleverTapToken: '',
        PushNotificationEnabled: false,
        SDK_Version: '',
        Profile_Method: '',
        Push_Token: '',
        AutoIntegrate: false
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
              case 'AccountDetails': {
                //statements; 
                this.accountDetails(line);
                break;
              }
              case 'PushNotificationEnabled': {
                //statements; 
                this.checkForPN(line);
                break;
              }
              case 'AutoIntegrate':{
                this.checkForAutoIntegrate(line);
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
      /*logLines.forEach(line => {
        if (line.includes('onUserLogin')) {
          this.result.metadata.Profile_Method = 'onUserLogin';
        }
        this.queuedEvent(line);
      });*/
      let halfline = ''
      logLines.forEach(line => {
        if (line.includes('onUserLogin')) {
          this.result.metadata.Profile_Method = 'onUserLogin';
        }
        let lineBroken = false; // for really long log lines
        if (halfline.length > 0) {
          let splitline = line.split(' ');
          splitline.splice(0, 4);
          splitline.join(' ');
          console.log(splitline);
          lineBroken = this.queuedEvent(halfline + ' ' + splitline);
        } else {
          lineBroken = this.queuedEvent(line);
        }
        if (!lineBroken) {
          halfline = line;
        } else {
          halfline = ''
        }
      });
      resolve(this.result);
    })
  }

  checkForAutoIntegrate(logLine: String){
    if (logLine.includes('autoIntegration enabled')) {
      this.flags.AutoIntegrate = true;
      this.result.metadata.AutoIntegrate = true;
    }
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

  checkForPN(logLine: String) {
    if (logLine.includes('registering APNs device token')) {
      this.flags.PushNotificationEnabled = true;
      this.result.metadata.PushNotificationEnabled = true;
    }
  }

  queuedEvent(logLine: String) {
    if (logLine.includes('Sending')) {
    /*if (logLine.includes('New event processed:')) {
        var queueObj = {
        events: [],
        profile: [],
        meta: [],
        data: [],
        CTID: ''
      }
        let eventJSONArrayString = (logLine.split('New event processed:'))[1].trim();
        //console.log('JSON STR '+eventJSONArrayString);
        let eventJSONArray;
        let CTID;
        try{
          eventJSONArray = JSON.parse(eventJSONArrayString);
          //console.log('JSON Array '+eventJSONArray);
        }catch (e) {
          console.log('Exception '+e);
        }
        if (eventJSONArray['type'] === 'profile') {
          queueObj.profile.push(eventJSONArray);
        } else if ((eventJSONArray['type'] === 'event')) {
          this.result.metadata.SDK_Version = eventJSONArray['evtData']['SDK Version'];
          eventJSONArray['CTID'] = CTID;
          queueObj.events.push(eventJSONArray);
        } else if ((eventJSONArray['type'] === 'data')) {
          if (this.flags.PushNotificationEnabled) {
            this.result.metadata.Push_Token = eventJSONArray['data']['id']
          }
          if (!this.flags.registerPNDataEntry) {
            this.flags.registerPNDataEntry = true;
            queueObj.data.push(eventJSONArray);
          }

        } else if ((eventJSONArray['type'] === 'meta')) {
          CTID = eventJSONArray["g"];
          queueObj.meta.push(eventJSONArray);
        }*/
    
      let tempStr = (logLine.split('Sending '))[1]
      //console.log('Temp String '+tempStr);
      let eventJSONArrayString = (tempStr.split('to'))[0]
      //console.log('Final String '+eventJSONArrayString);
      let eventJSONArray;
      let CTID;
      try {
        eventJSONArray = JSON.parse(eventJSONArrayString);
        //get sdk version
        this.result.metadata.SDK_Version = eventJSONArray[0]['af']['SDK Version'];
        //console.log('SDK Version'+eventJSONArray[0]['af']['SDK Version']);
      } catch (e) {
        console.log(e);
        console.log(logLine);
        return false;
      }
      var queueObj = {
        events: [],
        profile: [],
        meta: [],
        data: [],
        CTID: ''
      }
      eventJSONArray.forEach(eventJSON => {
        if (eventJSON['type'] === 'profile') {
          queueObj.profile.push(eventJSON);
        } else if ((eventJSON['type'] === 'event')) {
          eventJSON['CTID'] = CTID;
          queueObj.events.push(eventJSON);
        } else if ((eventJSON['type'] === 'data')) {
          if (this.flags.PushNotificationEnabled) {
            this.result.metadata.Push_Token = eventJSON['data']['id']
          }
          if (!this.flags.registerPNDataEntry) {
            this.flags.registerPNDataEntry = true;
            queueObj.data.push(eventJSON);
          }

        } else if ((eventJSON['type'] === 'meta')) {
          CTID = eventJSON["g"];
          queueObj.meta.push(eventJSON);
        }
      });
      this.result.queue.push(queueObj);
    }
  }
}
