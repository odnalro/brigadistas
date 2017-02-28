import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';

@Injectable()
export class BrigadeService extends BaseService {
  public static dados: any= {};

  constructor(public http: Http) {
    super(http);
    console.log('Hello BrigadeService Provider');
  }

  getBrigades(){
    return this.doGet('/brigade/');
  }

  getBrigade(id){
    return this.doGet(`/brigade/${id}`);
  }

  addBrigade(brigade){
    if(brigade._id){
      return this.updateBrigade(brigade);
    }
    return this.doPost('/brigade/',brigade);
  }

  updateBrigade(brigade){
    return this.doPut('/brigade/',brigade);
  }

  addRelationBrigade(brigadeId,relation,userId=null){
    return this.doPost(`/brigade/relation/${brigadeId}/${relation}`,{userId});
  }

  removeRelationBrigade(brigadeId,relation,userId=null){
    return this.doDelete(`/brigade/relation/${brigadeId}/${relation}/${userId}`);
  }

}
