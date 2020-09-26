import { Component, OnInit } from '@angular/core';
import {Hero} from '../hero';
// // import {HEROES} from '../mock-heroes';
import {HeroService} from'../hero.service'
import {HttpClient,HttpHeaders} from'@angular/common/http'


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {


  // selectedHero: Hero;//クリックされたヒーロー
  myHeroes:Hero[];//ヒーロー一覧  


  constructor(private http:HttpClient, private heroService:HeroService) {}

  getHeroesFromService():void{
    //同期尾的な処理
    //だが、サーバーから取得する際には非同期でなければならない
    // this.heroes = this.heroService.getHeroes();

    //非同期処理
    //getHero実行して値取得
    this.heroService.getHeroes().subscribe(tmpH=>this.myHeroes=tmpH);//アロー演算子

  }

  ngOnInit(): void {
    this.getHeroesFromService()
  }

  add(name:string):void{
    name = name.trim();
    if(!name){
      return;
    }
    this.heroService.addHero({name}as Hero)
    .subscribe(hero => {
      this.myHeroes.push(hero);
    });
  }

  delete(hero: Hero):void{
    this.myHeroes = this.myHeroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

  

}
