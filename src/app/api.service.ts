import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getProfile(objectId: String, accountId: String, passcode: String) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-CleverTap-Account-Id': 'my-auth-token',
        'X-CleverTap-Passcode': 'my-auth-token',
      })
    };
    return this.http.get<any>('https://api.clevertap.com/1/profile.json?objectId=' + objectId).subscribe(data => {
      let userProfile = JSON.parse(data);
    })
  }
}

/**
 * {
  "status": "success",
  "record": {
    "email": "jack@gmail.com",
    "profileData": {
      "Last Score": 308,
      "High Score": 308,
      "Replayed": true
    },
    "events": {
      "App Launched": {
        "count": 10,
        "first_seen": 1457271567,
        "last_seen": 1458041215
      },
      "Charged": {
        "count": 6,
        "first_seen": 1457962417,
        "last_seen": 1458041276
      }
    },
    "platformInfo": [
      {
        "platform": "iOS",
        "os_version": "10.2",
        "app_version": "6.1.3",
        "make": "Apple",
        "model": "iPhone7,2",
        "push_token": "95f98af6ad9a5e714a56c5bf527a78cb1e3eda18d2f23bc8591437d0d8ae71a3",
        "objectId": "-1a063854f83a4c6484285039ecff87cb"
      },
      {
        "platform": "Web",
        "objectId": "a8ffcbc9-a747-4ee3-a791-c5e58ad03097"
      }
    ]
  }
}
 */
