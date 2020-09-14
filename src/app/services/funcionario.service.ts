import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Funcionario } from '../models/funcionario';
import { variable } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  url = 'https://localhost:5001/funcionario/';

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }, )
  }
  

  getFuncionarios(): Observable<Funcionario[]> {
    return this.httpClient.get<Funcionario[]>(this.url + 'ObterTodos')
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  getFuncionarioById(id: number): Observable<Funcionario> {
    return this.httpClient.get<Funcionario>(this.url + 'ObterFuncionario/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  saveFuncionario(funcionario: Funcionario): Observable<Funcionario> {
    return this.httpClient.post<Funcionario>(this.url + 'AtualizarFuncionario/', JSON.stringify(funcionario), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };
}
