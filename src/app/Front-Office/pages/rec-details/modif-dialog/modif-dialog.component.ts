import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EtatService } from 'src/app/Front-Office/reclamation/etat.service';
import { RecServiceService } from 'src/app/Front-Office/reclamation/rec-service.service';
import { LieuService } from 'src/app/Front-Office/utilisateur/lieu.service';
import { UtilisateurService } from 'src/app/Front-Office/utilisateur/utilisateur.service';
import { CategorieService } from '../../new-rec/categorie.service';
import { DialogData } from '../../rec-update/rec-update.component';
import { DialogData1 } from '../rec-details.component';

@Component({
  selector: 'app-modif-dialog',
  templateUrl: './modif-dialog.component.html',
  styleUrls: ['./modif-dialog.component.css']
})
export class ModifDialogComponent implements OnInit {

  niveau: any=1;

  form = new FormGroup({

    categ : new FormControl('',Validators.required),
    sousCateg : new FormControl('',Validators.required),
    description : new FormControl('',Validators.max(15)),
    urgence : new FormControl('2',Validators.required)
  })

  rec;
  wrong=false;
  cat : any = [];
  souscat : any = [];
  defaultCateg;
  matr;
  g;
  v;
  a;
  defaultSCateg
  processing=true;
  s;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData1,
   private fb: FormBuilder,
   private recService:RecServiceService,
   private categorie:CategorieService, 
     private utilisateur: UtilisateurService,
     private lieu:LieuService, 
     private dialogRef: MatDialogRef<ModifDialogComponent>) { }

  ngOnInit(): void {
    this.recService.getRecDet(this.dialogData.recId).subscribe((data) => {
      this.rec=data;
      this.lieu.getLieuDet(this.rec.id_lieu).subscribe((data)=>{
        this.g=data.gouv;
        this.v=data.ville;
        this.a=data.agence;
        this.categorie.getSousCatDet(this.rec.Id_sousCateg).subscribe((data)=>{
          this.s=data;
          this.categorie.getCatDet(this.s.id2).subscribe((data)=>{
            this.defaultCateg=data._id;
            this.categorie.categorie().subscribe((data) => {
              this.cat = data;
              console.log(this.cat);
              this.matr=localStorage.getItem('matricule');

              console.log('rec0 : ',this.rec.urg);

              //this.niveau = 1;
      
    //   this.form = this.fb.group({  
    //     matricule: this.matr,
    //     gouvernorat: this.g,
    //     ville: this.v,
    //     agence: this.a,
    //     categ: this.categ,
    //     sousCateg: this.sousCateg,
    //     description: this.description,
    //     urgence:this.niveau
    // });  
    this.categ.setValue(this.defaultCateg);
    this.sousCateg.setValue(this.rec.Id_sousCateg);
    this.description.setValue(this.rec.desc);
    
    //this.urgence.setValue(this.rec.urg);
    console.log(this.sousCateg);
    this.categorie.souscategorie(this.categ.value).subscribe((data) => {
      this.souscat = data;
      console.log(this.souscat);
      this.processing=false;
      console.log('rec',this.rec.urg);
      console.log('control',this.urgence.value);

      // this.form = new FormGroup({

      //   categ : new FormControl('',Validators.required),
      //   sousCateg : new FormControl('',Validators.required),
      //   description : new FormControl('',Validators.max(15)),
      //   urgence : new FormControl('',Validators.required)
      // })

      this.form = this.fb.group({  
        matricule: this.matr,
        gouvernorat: this.g,
        ville: this.v,
        agence: this.a,
        categ: this.categ,
        sousCateg: this.sousCateg,
        description: this.description,
        urgence:this.rec.urg.toString()
    });  
     })  ;
        
             })
          })
        })
      })

      
    });
    
  }

 
  get description(){
    return this.form.get('description');
  }
  get urgence(){
    return this.form.get('urgence');
  }
  get categ(){
    return this.form.get('categ');
  }
  get sousCateg(){
    return this.form.get('sousCateg');
  }
  sCateg(idS){
    return this.categorie.getsCatName(idS)
  }
  onSelect3(cat){
    this.categorie.souscategorie(cat.target.value).subscribe((data) => {
      this.souscat = data;
      console.log(this.souscat);
      
     })  ;
  }
  DescRequirement(s){
    if(s.target.value=="Autre"){
      this.form.get('description').setValidators(Validators.required);
      console.log(this.form.get('description').validator);
    }
  }
  data
  saveModif(value){
    if(this.categ.valid && this.sousCateg.valid && this.description.valid)
    { this.data={id_reclamant:this.rec.id_reclamant,
      id_lieu:this.rec.id_lieu,
      id_etat:this.rec.id_etat,
      date:this.rec.date,
      id_sousCateg:value.sousCateg,
      urg:value.urgence,
      desc:value.description,
      id_affect:this.rec.id_affect}
      console.log('data',this.data.urg)
      //send it to api
      this.recService.updateRec(this.dialogData.recId, this.data).subscribe({
        complete: () => {
          this.dialogRef.close();
          console.log('Content updated successfully!');
        },
        error: (e) => {
          console.log(e);
        },
      });
      //re-initialize rec with new values 
      
    } 
    else {
      this.wrong=true;
    }

  }

}
