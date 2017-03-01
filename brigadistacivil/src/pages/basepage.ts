import { App, Platform, NavController, MenuController, AlertController,
          LoadingController, ToastController } from 'ionic-angular';
import {FormGroup} from '@angular/forms';
import {UserService} from '../providers/user-service';
import {TranslateService} from 'ng2-translate';
import {ViewChild, ElementRef} from '@angular/core';
declare var google;

export default class BasePage {
  public userService: UserService;
  public translateService: TranslateService;
  public navCtrl: NavController;
  public menuCtrl: MenuController;
  public alertCtrl: AlertController;
  public loadingCtrl: LoadingController
  public toastCtrl: ToastController
  public app: App;
  public platform: Platform;
  public loading: any;
  public password;
  public username;
  public currentLocation: any;
  public readonly: boolean;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor() {
    if (!UserService.loginData && 'profile' in localStorage) {
      try {
        UserService.loginData = JSON.parse(localStorage['profile']);
      } catch (e) { }
    }
  }

  /**
   * ESTRUTURA
   */
  setMenu() {
    if (!this.menuCtrl) return;
    if (this.isUser()) {
      this.menuCtrl.enable(true, 'menuUser');
      this.menuCtrl.swipeEnable(true);
    }
    else this.menuCtrl.swipeEnable(false);
  }

  showLoading(): void {
    if (!this.loadingCtrl || this.loading) return;
    this.loading = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 90000
    });
    this.loading.present();
    return this.loading;
  }

  dismissLoading(): void {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  /**
   * FORMS
   */

   /**
    * [setDataForm description]  Ex.: this.setDataForm(this.fireForm,this.fireFormFields,this.fire);
    * @param  {[type]} form ex.: this.fireForm
    * @param  {[type]} keys ex.: [name: [], title: []]
    * @param  {[type]} data ex.: this.fire
    * @return {[type]}      [description]
    */
  setDataForm(form,keys,data){
    let formData={};
    for(let key in keys){
      formData[key]=data[key];
    }
    (<FormGroup>form).setValue(formData, { onlySelf: true });
  }




  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode == 13) {
      this.formsubmit();
    }
  }

  isReadonly(){
    return this.readonly;
  }

  toDate(mydate) {
    return new Date(mydate.substring(6, 10), mydate.substring(3, 5), mydate.substring(0, 2), mydate.substring(11, 13), mydate.substring(14, 16));
  }

  formsubmit() { }

  /**
   * get current translationfor a key
   * @param  {string} key "brigade.requestEnter.confirm"
   * @return {string}     [description]
   */
  translate(key){
    let newKey = this.translateService.get(key);
    if(newKey && (<any>newKey).value) return (<any>newKey).value;
    return key;
  }

  /**
   * User
   */
  isUser() {
    if (UserService && UserService.loginData)
      return true;
    else return false;
  }

  openPageParam(page, param) {
    if (this.menuCtrl) this.menuCtrl.close();
    if (this.app) {
      if (param) this.app.getRootNav().push(page, param);
      else this.app.getRootNav().setRoot(page);
    }
    //let nav = this.app.getActiveNav();nav.push(page);
  }

  openPage(page) {
    return this.openPageParam(page, null);
  }
  goBack() {
    this.app.getRootNav().pop();
  }


  /**
   * VIEWS
   */

  showAlert(title, desc) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: desc,
      buttons: ['OK']
    });
    alert.present();
  }

  showConfirm(message, title, callback) {
    if (!title) title = this.translate("confirmOperation");
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: this.translate("cancel"),
          handler: () => {
          }
        },
        {
          text: this.translate("yesContinue"),
          handler: () => {
            callback();
          }
        }
      ]
    });
    confirm.present();
  }


  showConfirmOptions(title, message, names, callback) {
    let alertConfirm;

    alertConfirm = this.alertCtrl.create();

    if (!title) title = this.translate("chooseOption");
    alertConfirm.setTitle(title);
    alertConfirm.setMessage(message);

    for (let i = 0; i < names.length; i++) {
      alertConfirm.addInput({
        type: 'radio',
        label: names[i].label,
        value: names[i].value,
        checked: false
      });
    }

    alertConfirm.addButton(this.translate("cancel"));
    alertConfirm.addButton({
      text: 'Ok',
      handler: (data: any) => {
        if (data) {
          callback(data);
        } else {
          alert(this.translate("chooseOptionFail"))
          return false;
        }
      }
    });

    alertConfirm.present().then(() => {

    });
  }



  showError(error: any) {
    console.log(error)
    this.dismissLoading();
    if (error && error.status === 0) {
      error = this.translate("cancel")
    }

    if (this.alertCtrl) {
      let alert = this.alertCtrl.create({
        title: this.translate("connectionFail"),
        subTitle: error,
        buttons: ['OK']
      });
      alert.present();
    }
  }


  showToast(desc, fixed = false) {
    if (!this.toastCtrl) return;
    let options = {
      message: desc,
      position: "top",
      closeButtonText: "OK",
      showCloseButton: false,
      duration: 5000
    };

    if (fixed === true) {
      options.duration = 15000;
      options.showCloseButton = true;
    }
    let toast = this.toastCtrl.create(options);
    toast.present();
  }



  /**
   *USERS ACTIONS
   *
   */
  afterLogin() { }

  authSuccess(token, user) {
    console.log(user, token)
    localStorage['profile'] = JSON.stringify(user);
    localStorage['id_token'] = token;


    if (localStorage['deviceToken']) {
      let type = "android"; //windows
      if (this.platform && this.platform.is('ios')) {
        type = "ios";
      }
      //this.userService.storeDeviceToken(type, localStorage['deviceToken']);
    }
    this.afterLogin();
    this.showToast(user.name + this.translate("user.new.welcome"));
  }

  login(username: any = null, password: any = null, callback: any = null): void {
    this.showLoading();
    if (!username) username = this.username;
    if (!password) password = this.password;

    this.userService.login(username, password).then(user => {
      this.dismissLoading();
      if (user) {
        this.authSuccess(true, user);
        if (callback) callback();
      }
      else {
        this.errorlogin();
      }

    }).catch(err => {
      this.dismissLoading();
      this.errorlogin();
    });
  }

  errorlogin(): void {
    if (this.alertCtrl) {
      let alert = this.alertCtrl.create({
        title: this.translate("user.login.title"),
        subTitle: this.translate("user.login.subTitle"),
        buttons: ['OK']
      });
      alert.present();
    }
  }
  currentUser(){
    return UserService.loginData;
  }


  /**
   * [loadMap description]
   * @param  {[type]} position [description]
   * @return {[type]}          [description]
   */
  loadMap(position,options={}) {


    //-34.9290, 138.6010
    let latLng = new google.maps.LatLng(position.latitude, position.longitude);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    mapOptions=Object.assign(mapOptions,options)

    console.log("eii",this.mapElement)
    if(this.mapElement){
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }else{
      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }




    /*
    var drawingManager;
    
    var polyOptions = {
      strokeWeight: 0,
      fillOpacity: 0.45,
      editable: true
    };

     drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
        ]
      },
      polygonOptions: polyOptions,
      map: this.map
    });*/
    /**/
    /*
  google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) => {

      this.selectedShape=e.overlay

      if (e.type != google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          drawingManager.setDrawingMode(null);

          // Add an event listener that selects the newly-drawn shape when the user
          // mouses down on it.
          newShape = e.overlay;
          newShape.type = e.type;

          google.maps.event.addListener(newShape, 'click', ()=> {

            this.setSelection(newShape);


          });
        }
  })

  */
    /* map.addPolygon({
        'points': GORYOKAKU_POINTS,
        'strokeColor' : '#AA00FF',
        'strokeWidth': 5,
        'fillColor' : '#880000'
      }, function(polygon) {
        setTimeout(function() {
          polygon.remove();
        }, 3000);
      });*/


  }


  addMarker(position,info){
    if(!position) position=this.map.getCenter();
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position
    });
    if(!info) return;

    let content = info;
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content){
   let infoWindow = new google.maps.InfoWindow({
     content: content
   });
   google.maps.event.addListener(marker, 'click', () => {
     infoWindow.open(this.map, marker);
   });
 }

}
