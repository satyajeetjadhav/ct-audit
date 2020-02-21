import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogParserService {

  flags = {
    activityLifecycleCallback: false,
    accountRegion: false,
    accountId: false,
    accountToken: false,
    sdkVersion: false,
    CTPushNotificationReceiver: false,
    InstallReferrerBroadcastReceiver: false,
    CTNotificationIntentService: false,
    CTBackgroundJobService: false,
    CTBackgroundIntentService: false,
    InAppNotificationActivity: false,
    FcmMessageListenerService: false,
    FcmTokenListenerService: false,
    UIEditor: false
  }

  result = {
    metadata: {
      ActivityLifecycleCallback: false,
      AccountRegion: '',
      AccountId: '',
      AccountToken: '',
      SdkVersion: '',
      CTPushNotificationReceiver: false,
      InstallReferrerBroadcastReceiver: false,
      CTNotificationIntentService: false,
      CTBackgroundJobService: false,
      CTBackgroundIntentService: false,
      InAppNotificationActivity: false,
      FcmMessageListenerService: false,
      FcmTokenListenerService: false,
      UIEditor: false,
    },
    queue: []

  }

  /*
      events: [],
    profile: [],
    data: [],
    meta: []
    */


  constructor() { }

  init() {

    this.result = {
      metadata: {
        ActivityLifecycleCallback: false,
        AccountRegion: '',
        AccountId: '',
        AccountToken: '',
        SdkVersion: '',
        CTPushNotificationReceiver: false,
        InstallReferrerBroadcastReceiver: false,
        CTNotificationIntentService: false,
        CTBackgroundJobService: false,
        CTBackgroundIntentService: false,
        InAppNotificationActivity: false,
        FcmMessageListenerService: false,
        FcmTokenListenerService: false,
        UIEditor: false,
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
              case 'activityLifecycleCallback': {
                this.activityLifeCycleCallBack(line);
                break;
              }
              case 'accountRegion':  {
                //statements;
                console.log('Entered Account Region ');
                this.accountRegion(line);
                break;
              }
              case 'accountId': {
                //statements; 
                this.accountId(line);
                break;
              }
              case 'sdkVersion': {
                //statements; 
                this.sdkVersion(line);
                break;
              }
              case 'CTPushNotificationReceiver': {
                //statements; 
                this.CTPushNotificationReceiver(line);
                break;
              }
              case 'InstallReferrerBroadcastReceiver': {
                //statements; 
                this.InstallReferrerBroadcastReceiver(line);
                break;
              }
              case 'CTNotificationIntentService': {
                //statements; 
                this.CTNotificationIntentService(line);
                break;
              }
              case 'CTBackgroundJobService': {
                //statements; 
                this.CTBackgroundJobService(line);
                break;
              }
              case 'CTBackgroundIntentService': {
                //statements; 
                this.CTBackgroundIntentService(line);
                break;
              }
              case 'InAppNotificationActivity': {
                //statements; 
                this.InAppNotificationActivity(line);
                break;
              }
              case 'FcmMessageListenerService': {
                //statements; 
                this.FcmMessageListenerService(line);
                break;
              }
              case 'FcmTokenListenerService': {
                //statements; 
                this.FcmTokenListenerService(line);
                break;
              }
              //
              case 'UIEditor': {
                //statements; 
                this.UIEditor(line);
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
        this.QueuedEvent(line);
      });
      resolve(this.result);
    })
  }


  activityLifeCycleCallBack(logLine: String) {
    if (logLine.includes('Activity Lifecycle Callback successfully registered')) {
      this.flags.activityLifecycleCallback = true;
      this.result.metadata.ActivityLifecycleCallback = true;
    }
  }

  accountRegion(logLine: String) {
    if (logLine.includes('Account Region')) {
      this.flags.accountRegion = true;
      if (logLine.includes('Account Region not specified')) {
        this.result.metadata.AccountRegion = '';
      } else {
        this.result.metadata.AccountRegion = 'logLine'
      }
    }
  }

  accountId(logLine: String) {
    if (logLine.includes('CleverTap SDK initialized with accountId')) {
      this.flags.accountId = true;
      this.flags.accountToken = true;
      // CleverTap SDK initialized with accountId: R95-W5Z-Z45Z accountToken: 150-5c2 accountRegion: null
      let splitLine = logLine.split('accountId:');
      let accountId = splitLine[1].trim();
      this.result.metadata.AccountId = accountId.split(' ')[0];
      this.result.metadata.AccountToken = logLine.split('accountToken:')[1].trim().split(' ')[0];

    }
  }

  sdkVersion(logLine: String) {
    if (logLine.includes('SDK Version Code is ')) {
      this.flags.sdkVersion = true;
      // SDK Version Code is 30601
      let splitLine = logLine.split(' ');
      this.result.metadata.SdkVersion = splitLine.pop();

    }
  }

  CTPushNotificationReceiver(logLine: String) {
    if (logLine.includes('CTPushNotificationReceiver')) {
      this.flags.CTPushNotificationReceiver = true;
      // CTPushNotificationReceiver is present
      if (logLine.includes('CTPushNotificationReceiver is present')) {
        this.result.metadata.CTPushNotificationReceiver = true;
      } else {
        this.result.metadata.CTPushNotificationReceiver = false;
      }
    }
  }

  InstallReferrerBroadcastReceiver(logLine: String) {
    if (logLine.includes('InstallReferrerBroadcastReceiver')) {
      this.flags.InstallReferrerBroadcastReceiver = true;
      // InstallReferrerBroadcastReceiver is present
      if (logLine.includes('InstallReferrerBroadcastReceiver is present')) {
        this.result.metadata.InstallReferrerBroadcastReceiver = true;
      } else {
        this.result.metadata.InstallReferrerBroadcastReceiver = false;
      }
    }
  }

  CTNotificationIntentService(logLine: String) {
    if (logLine.includes('CTNotificationIntentService')) {
      this.flags.CTNotificationIntentService = true;
      // CTNotificationIntentService is present
      if (logLine.includes('CTNotificationIntentService is present')) {
        this.result.metadata.CTNotificationIntentService = true;
      } else {
        this.result.metadata.CTNotificationIntentService = false;
      }
    }
  }

  CTBackgroundJobService(logLine: String) {
    if (logLine.includes('CTBackgroundJobService')) {
      this.flags.CTBackgroundJobService = true;
      // CTBackgroundJobService is present
      if (logLine.includes('CTBackgroundJobService is present')) {
        this.result.metadata.CTBackgroundJobService = true;
      } else {
        this.result.metadata.CTBackgroundJobService = false;
      }
    }
  }

  CTBackgroundIntentService(logLine: String) {
    if (logLine.includes('CTBackgroundIntentService')) {
      this.flags.CTBackgroundIntentService = true;
      // CTBackgroundIntentService is present
      if (logLine.includes('CTBackgroundIntentService is present')) {
        this.result.metadata.CTBackgroundIntentService = true;
      } else {
        this.result.metadata.CTBackgroundIntentService = false;
      }
    }
  }


  InAppNotificationActivity(logLine: String) {
    if (logLine.includes('InAppNotificationActivity')) {
      this.flags.InAppNotificationActivity = true;
      // InAppNotificationActivity is present
      if (logLine.includes('InAppNotificationActivity is present')) {
        this.result.metadata.InAppNotificationActivity = true;
      } else {
        this.result.metadata.InAppNotificationActivity = false;
      }
    }
  }


  FcmMessageListenerService(logLine: String) {
    if (logLine.includes('FcmMessageListenerService')) {
      this.flags.FcmMessageListenerService = true;
      // FcmMessageListenerService is present
      if (logLine.includes('FcmMessageListenerService is present')) {
        this.result.metadata.FcmMessageListenerService = true;
      } else {
        this.result.metadata.FcmMessageListenerService = false;
      }
    }
  }

  FcmTokenListenerService(logLine: String) {
    if (logLine.includes('FcmTokenListenerService')) {
      this.flags.FcmTokenListenerService = true;
      // FcmTokenListenerService is present
      if (logLine.includes('FcmTokenListenerService is present')) {
        this.result.metadata.FcmTokenListenerService = true;
      } else {
        this.result.metadata.FcmTokenListenerService = false;
      }
    }
  }

  UIEditor(logLine: String) {
    if (logLine.includes('UIEditor')) {
      this.flags.UIEditor = true;
      // FcmTokenListenerService is present
      if (logLine.includes('UIEditor connection is enabled')) {
        this.result.metadata.UIEditor = true;
      } else {
        this.result.metadata.UIEditor = false;
      }
    }
  }

  QueuedEvent(logLine: String) {
    /* if (logLine.includes('Queued event:')) {
      let eventJsonString = logLine.split('Queued event:')[1]
      let eventJSON = JSON.parse(eventJsonString);
      if (eventJSON['type'] === 'profile') {
        this.result.profile.push(eventJSON);
      } else if ((eventJSON['type'] === 'event')) {
        this.result.events.push(eventJSON);
      } else if ((eventJSON['type'] === 'data')) {
        this.result.data.push(eventJSON);
      } else if ((eventJSON['type'] === 'meta')) {
        this.result.meta.push(eventJSON);
      }
    } else  */if (logLine.includes('Send queue contains')) {
      let eventJSONArrayString = logLine.split('items:')[1]
      let eventJSONArray;
      let CTID;
      try {
        eventJSONArray = JSON.parse(eventJSONArrayString);
      } catch (e) {
        console.log(e);
        console.log(logLine);
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
          queueObj.data.push(eventJSON);
        } else if ((eventJSON['type'] === 'meta')) {
          CTID = eventJSON["g"];
          queueObj.meta.push(eventJSON);
        }
      });
      this.result.queue.push(queueObj);
    }

    //    [{ "g": "__71e3251ce05a49e3855de455d6dc0b07", "type": "meta", "af": { "Build": "1", "Version": "1.0", "OS Version": "10", "SDK Version": 30602, "Make": "Google", "Model": "Android SDK built for x86", "Carrier": "Android", "useIP": false, "OS": "Android", "wdt": 2.57, "hgt": 4.27, "dpi": 420, "cc": "us" }, "id": "TEST-Z88-R88-765Z", "tk": "TEST-bb2-bb1", "l_ts": 0, "f_ts": 0, "ddnd": false, "rtl": [], "imp": 0, "tlc": [] }, { "evtName": "App Launched", "evtData": { "Build": "1", "Version": "1.0", "OS Version": "10", "SDK Version": 30602, "Make": "Google", "Model": "Android SDK built for x86", "Carrier": "Android", "useIP": false, "OS": "Android", "wdt": 2.57, "hgt": 4.27, "dpi": 420, "cc": "us" }, "s": 1579444896, "pg": 1, "type": "event", "ep": 1579444898, "f": true, "lsl": 0, "pai": "com.example.androidct", "dsync": true }, { "data": { "action": "register", "id": "fgLsJvBMZN4:APA91bGf_wk2Q7eA-unGrOOv53a3HxVfCV1K8RS8pyNtgUWQ70sYVvQA6K3MX2rCvBpqksWKAPJryw0Q1I-Bn01BvpjkBgsN-r23gIXjypReAFW7d-Ew72SpkgWR2ImwvKfBi92lkn-v", "type": "fcm" }, "s": 1579444896, "pg": 1, "type": "data", "ep": 1579444898, "f": true, "lsl": 0, "dsync": false }]


  }
}
