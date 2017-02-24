import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import BasePage from '../basepage';
import BrigadesPage from './brigades'
import { BrigadeService} from '../../providers/brigade-service';
import { Geolocation } from 'ionic-native';

declare var google;

@Component({
  selector: 'page-brigade',
  templateUrl: 'brigade.html'
})
export class BrigadePage  extends BasePage{
  public brigade: any;
  public readonly: boolean;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public brigadeService: BrigadeService) {
    super();

    if(this.navParams.get("brigade")){
      this.brigade=this.navParams.get("brigade");
      this.readonly=true;
    } else{
      this.brigade={};
      this.readonly=false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrigadePage');
      Geolocation.getCurrentPosition().then((position) => {
        this.loadMap(position.coords);
      });

  }

  save(){
    this.brigadeService.addBrigade(this.brigade).then(d=>{
      console.log("hehehehe",d);
      this.openPage(BrigadesPage);
    });
  }

  addMarker(){

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";

    //this.addInfoWindow(marker, content);

  }

  isReadonly(){
    return this.readonly;
  }

}
