import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { UserPage } from '../pages/user/user';
import { LoginPage } from '../pages/user/login';
import { FirePage } from '../pages/fire/fire';
import { FiresPage } from '../pages/fire/fires';
import { BrigadePage } from '../pages/brigade/brigade';
import { BrigadesPage } from '../pages/brigade/brigades';

import {BaseService} from '../providers/base-service';
import {GeneralService} from '../providers/general-service';
import {UserService} from '../providers/user-service';

import { TranslateModule } from 'ng2-translate/ng2-translate';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';

let pages = [
  MyApp,
  Page1,
  Page2,
  UserPage,LoginPage,
  FirePage, FiresPage,
  BrigadePage, BrigadesPage
];
@NgModule({
  declarations: pages,
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    UserPage, LoginPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},GeneralService,UserService,BaseService]
})
export class AppModule {}