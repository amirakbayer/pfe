import { Component, OnInit, Input } from '@angular/core';
import { CategorieService } from '../../pages/new-rec/categorie.service';
import { LieuService } from '../../utilisateur/lieu.service';
import { UtilisateurService } from '../../utilisateur/utilisateur.service';
import { RecServiceService } from '../rec-service.service';
import { reclam } from '../reclam';

@Component({
  selector: 'full',
  templateUrl: './full.component.html',
  //template: '',
  styleUrls: ['./full.component.css'],
  inputs: ['id']
})
export class FullComponent implements OnInit {
  id
  rec;
  processing=true;
  categ;
  sCateg;
  gouv;
  ville;
  agence;
  matr;
  //rec! : reclam;
  //R0= new reclam("0","000","en attente","01/01/2000","00",1);
  constructor(
    private recService: RecServiceService,
    private lieu: LieuService,
    private categorie: CategorieService,
    private utilisateur:UtilisateurService,) { 
    

  }
  
  ngOnInit(): void {
    this.recService.getRecDet(this.id).subscribe((data) => {
      this.rec=data;
      this.utilisateur.getUserDet(this.rec.id_reclamant).subscribe((data)=>{
        this.matr=data.matr;
        this.lieu.getLieuDet(this.rec.id_lieu).subscribe((data)=>{
          this.gouv=data.gouv;
          this.ville=data.ville;
          this.agence=data.agence;
          console.log("lieu data",data)
          this.categorie.getSousCatDet(this.rec.Id_sousCateg).subscribe((data) =>{
            this.sCateg=data;
            this.categorie.getCatDet(this.sCateg.id2).subscribe((data) =>{
              this.categ=data;
              console.log("scateg",this.sCateg)
          console.log("categ",this.categ)
          this.processing=false
            })
          })
        })
      })
      
      
    });
    //if(this.service.IdExists(this.ident)){
     // this.rec=<reclam> this.service.getRecDet(this.ident);
    //} else {
      //this.rec=this.R0;
    //}
    
    //console.log(this.rec);
  }

  getRec(id) {
    
  }

  
 
  urgenceN(idU){
    if(idU==3){
      return "Trés urgente"
    }else if(idU==2){
      return "Assez urgente"
    }else{
      return "Peu urgente"
    }
  }
  userMatr(id){
    return this.utilisateur.getUserMatr(id)
  }

}
