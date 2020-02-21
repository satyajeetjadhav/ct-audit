import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metaToEnglish'
})
export class MetaToEnglishPipe implements PipeTransform {

  transform(item: any): any {
    switch (item.key) {
      case 'ActivityLifecycleCallback': {
        if (item.value) {
          return 'Activity Lifecycle Callbacks are registered.'
        } else {
          return 'Activity Lifecycle Callbacks are not registered. This is needed for proper functioning of the SDK.'
        }
      }
      case 'AccountRegion': {
        return 'Account region is ' + item.value;
      }
      case 'AccountId': {
        if (item.value.includes('TEST-')) {
          return 'Account Id is ' + item.value;
        } else {
          return 'Account Id is ' + item.value + '. This does not seem to be a test account. Test data sent to the production account can not be reset later.';
        }
      }
      case 'SdkVersion': {
        return 'SDK version is ' + item.value;
      }
      case 'CTPushNotificationReceiver': {
        if (item.value) {
          return 'CTPushNotificationReceiver is added. This is needed to track the push notification events and handle deeplinks.'
        } else {
          return 'CTPushNotificationReceiver is not added. This is needed to track the push notification events and handle deeplinks.'
        }
      }
      case 'InstallReferrerBroadcastReceiver': {
        if (item.value) {
          return 'InstallReferrerBroadcastReceiver is included. UTM parameters for app installs will be captured.'
        } else {
          return 'InstallReferrerBroadcastReceiver is not included. UTM parameters for app installs will not be captured.'
        }
      }
      case 'CTNotificationIntentService': {
        if (item.value) {
          return 'CTNotificationIntentService is included. This handles Action Button clicks and closes the notifications.'
        } else {
          return 'CTNotificationIntentService is not included. This service is need to handle Action Button clicks and closes the notifications.'
        }
      }
      case 'CTBackgroundJobService': {
        if (item.value) {
          return 'CTBackgroundJobService is included. This service is needed on Android 21 and above if Push Amplification is enabled from the dashboard.'
        } else {
          return 'CTBackgroundJobService is not included. This service is needed on Android 21 and above if Push Amplification is enabled from the dashboard.'
        }
      }
      case 'CTBackgroundIntentService': {
        if (item.value) {
          return 'CTBackgroundJobService is included. This service is needed below Android 21 if Push Amplification is enabled from the dashboard.'
        } else {
          return 'CTBackgroundJobService is not included. This service is needed below Android 21 if Push Amplification is enabled from the dashboard.'
        }
      }
      case 'InAppNotificationActivity': {
        if (item.value) {
          return 'InAppNotificationActivity is present.'
        } else {
          return 'InAppNotificationActivity is present. In Apps will not be displayed.'
        }
      }
      case 'FcmMessageListenerService': {
        if (item.value) {
          return 'CleverTap FcmMessageListenerService is present. Push notifications will be handled by CleverTap.'
        } else {
          return 'CleverTap FcmMessageListenerService is not present. Push notifications will not be handled by CleverTap. Please confirm if you plan on custom handling Push Notifications.'
        }
      }
      case 'FcmTokenListenerService': {
        if (item.value) {
          return 'CleverTap FcmTokenListenerService is present. Push tokens will be captured by CleverTap.'
        } else {
          return 'CleverTap FcmTokenListenerService is not present. Push tokens will not be captured automatically by CleverTap. Please confirm if you will be managing Push tokens in your custom listenere.'
        }
      }
    }
    return null;
  }

}
