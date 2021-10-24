import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Env } from '../_globals/env';
import axios from "axios";

@Injectable({
    providedIn: 'root'
})
export class FFTTService {

    httpOptions = {
        headers: new HttpHeaders(),
        crossDomain: true,
        async: true,
    }

    constructor(private http: HttpClient) { }

    getPlayerInfosByLicence(licenceNumber: any) {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": Env.FFTT_API_URL + licenceNumber,
            "method": "GET",
            "headers": {}
        };

        let that = this;
        return $.ajax(settings);
    }

    xml2json(xml: any) {
        try {
            var obj: any = {};
            if (xml.children.length > 0) {
                for (var i = 0; i < xml.children.length; i++) {
                    var item = xml.children.item(i);
                    var nodeName = item.nodeName;
                    if (typeof (obj[nodeName]) == "undefined") {
                        obj[nodeName] = this.xml2json(item);
                    } else {
                        if (typeof (obj[nodeName].push) == "undefined") {
                            var old = obj[nodeName];

                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(this.xml2json(item));
                    }
                }
            } else {
                obj = xml.textContent;
            }
            return obj;
        } catch (e: any) {
            console.log(e.message);
        }
    }

    // Error handling 
    handleError(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

}

