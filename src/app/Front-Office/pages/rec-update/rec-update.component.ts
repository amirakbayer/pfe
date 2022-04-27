
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component,Inject, OnInit, ViewChild ,ViewEncapsulation} from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProgressComponent } from './progress/progress.component';
import { RecServiceService } from '../../reclamation/rec-service.service';
import { MatStepper } from '@angular/material/stepper';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FileDialogComponent } from './file-dialog/file-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { getNumberOfCurrencyDigits } from '@angular/common';
import { getMatIconNameNotFoundError } from '@angular/material/icon';

export interface DialogData {
  Type: number;
}


export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

export interface UpdatesData {
  Date: Date;
  Nom: string;
  Ancien_etat: string;
  Nouveau_etat:string;
  Fichier: string;
  Type_fichier: string;
  Fournisseur:string;
}




@Component({
  selector: 'app-rec-update',
  templateUrl: './rec-update.component.html',
   styleUrls: ['./rec-update.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecUpdateComponent implements OnInit, AfterViewInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  
  id;
  rec;
  assistants;
  private sub: any;
  rawData;
  Updates;
  @ViewChild('stepper1',{ static: false }) stepper1: MatStepper;
  @ViewChild('stepper2',{ static: false }) stepper2: MatStepper;


  displayedColumns: string[] = ['Date', 'Nom', 'Ancien_etat', 'Nouveau_etat','Fichier','Type_fichier','Fournisseur'];
  dataSource: MatTableDataSource<UpdatesData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private recService: RecServiceService,
    public dialog: MatDialog) { 
      
    //transform
    this.rawData=[   //////raw data should be received from api : getMisesAJours(id_rec) or something like that
      {date: new Date(),Id_util:localStorage.getItem('id'),Id_Etat_a:2,Id_Etat_n:3,Id_f:8},
      {date: new Date(),Id_util:localStorage.getItem('id'),Id_Etat_a:2,Id_Etat_n:3,Id_f:8},
      {date: new Date(),Id_util:localStorage.getItem('id'),Id_Etat_a:2,Id_Etat_n:3,Id_f:8},
      {date: new Date(),Id_util:localStorage.getItem('id'),Id_Etat_a:2,Id_Etat_n:3,Id_f:8},
      {date: new Date(),Id_util:localStorage.getItem('id'),Id_Etat_a:2,Id_Etat_n:3,Id_f:8},
    ];
    this.Updates=Array.from({length:this.rawData.length}, (_, k) => this.transformData(k));
    console.log('transformed data',this.Updates);
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.Updates);
    }
  
  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number
      
       //In a real app: dispatch action to load the details here.
      
   });
   this.firstFormGroup = this._formBuilder.group({
    firstCtrl: new FormControl('',Validators.required),
  });
  
  this.Updates=Array.from({length:this.rawData.length}, (_, k) => this.transformData(k));

this.rec=this.recService.getRecDet(this.id);
this.assistants=[{id:'1',name:'john Smith'},] ;///here we put the api to get assistants


  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  
  
  get firstCtrl(){
    return this.firstFormGroup.get('firstCtrl');
  }
  
  nextstate(){
    this.rec.id_etat+=1;
    //here you use api to update rec with new id_etat
    
  }
  AffectAndState(id_affect){
    this.rec.id_affect=id_affect;
    this.rec.id_etat+=1;
    //here you use api to update rec with new id_etat and new id_affect
    //
  }

  back(){
    this.rec.id_etat=2;
    console.log('new rec.id_etat ',this.rec.id_etat);
    //here you use api to update rec with new id_etat
    
    
    this.stepper1.selectedIndex = 1;
    
    
    console.log('new stepper1 selected index ',this.stepper1);
    this.stepper2.selectedIndex = 1;
    console.log('new stepper2 selected index ',this.stepper2.selectedIndex);
  }

  invalidate(){
    this.rec.id_etat=8;
    //here you use api to update rec with new id_etat
  }

  openDialog(index: number) {
    this.dialog.open(FileDialogComponent, {
      data: {
        Type: index,
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getName(id:number){
    return 'John Smith'
  }
  getEtat(id:number){
    return 'en attente'
  }
  getFileName(id:number){
    return 'download'
  }
  getTypeF(id:number){
    return 'Devis'
  }
  getFour(id:number){
    return 'société A'
  }

   transformData(k: number):UpdatesData{
     //it's better if I get the raw data here first so I can use this function to update 'Updates'
    return{
      Date: this.rawData[k].date ,
      Nom: this.getName(this.rawData[k].Id_util),
      Ancien_etat: this.getEtat(this.rawData[k].Id_Etat_a),
      Nouveau_etat: this.getEtat(this.rawData[k].Id_Etat_n),
      Fichier: this.getFileName(this.rawData[k].Id_f),
      Type_fichier: this.getTypeF(this.rawData[k].Id_f),
      Fournisseur:this.getFour(this.rawData[k].Id_f)
    }
  }

}






  
  
  




