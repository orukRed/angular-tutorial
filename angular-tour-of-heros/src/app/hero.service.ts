import { Injectable } from '@angular/core';
import {Hero}from'./Hero';
import {HEROES} from './mock-heroes'
import {Observable,of}from'rxjs';
import {MessageService} from'./message.service';
import {HttpClient,HttpHeaders} from'@angular/common/http'
import {catchError,map,tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {



  constructor(private http: HttpClient,  private  messageService:MessageService) { }

    /**
   * 同期的な処理
   */
  // getHeroes():Hero[]{

  //   return HEROES;
  // }


  private heroesUrl = 'api/heroes'; //web apiのURL
  httpOptions = {
    headers:new HttpHeaders({'Content-Type': 'Application/json'})
  };
  /** サーバーからヒーローを取得する */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.logOut('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /** IDによりヒーローを取得する。idが見つからない場合は`undefined`を返す。 */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // {0|1} 要素の配列を返す
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.logOut(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /** IDによりヒーローを取得する。見つからなかった場合は404を返却する。 */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.logOut(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // 検索語がない場合、空のヒーロー配列を返す
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(() => this.logOut(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }
  /**
   * 失敗したHttp操作を処理します。
   * アプリを持続させます。
   * @param operation - 失敗した操作の名前
   * @param result - observableな結果として返す任意の値
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error); // かわりにconsoleに出力

      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      this.logOut(`${operation} failed: ${error.message}`);

      // 空の結果を返して、アプリを持続可能にする
      return of(result as T);
    };
  }
 
  /** PUT: サーバー上でヒーローを更新 */

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.logOut(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }



  private logOut(mes:string){
    this.messageService.add(`HeroService:${mes}`);
  }

  
  /** POST: サーバーに新しいヒーローを登録する */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.logOut(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  //引数で数字へ型変換してる？
  deleteHero(hero:Hero|number):Observable<Hero>{
    const id = typeof hero==='number'? hero:hero.id;//数字ならheroを、そうでないならhero.idをidに入れる
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url,this.httpOptions).pipe(
      tap(_=>this.logOut(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>(`delete Hero)`))
    );
  }



}
