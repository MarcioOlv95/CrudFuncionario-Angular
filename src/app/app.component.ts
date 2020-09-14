import { Component, OnInit } from '@angular/core';
import { FuncionarioService } from './services/funcionario.service';
import { NgForm } from '@angular/forms';
import { Funcionario } from './models/funcionario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'crud-funcionarios';

  Habilidades: Array<any> = []

  funcionario = {} as Funcionario;
  funcionarios: Funcionario[];
  stringDate: string;
  habilidadesMarcadas: string[] = []

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit() {
    this.getFuncionarios();
    this.initHabilidade();
  }

  initHabilidade(){
    this.Habilidades = [
      { name: 'CSharp', value: '0', checked: false },
      { name: 'Java', value: '1', checked: false },
      { name: 'Angular', value: '2', checked: false },
      { name: 'Sql', value: '3', checked: false },
      { name: 'Asp', value: '4', checked: false }
    ];
    this.habilidadesMarcadas = []
  }

  saveFuncionario(form: NgForm) {

    this.funcionario.habilidadeL = this.habilidadesMarcadas;
    this.funcionario.dataNascimento = new Date(this.stringDate);
    console.log("save", this.funcionario)

    this.funcionarioService.saveFuncionario(this.funcionario).subscribe(() => {
      this.cleanForm(form);
    });
  }

  getFuncionarios() {
    this.funcionarioService.getFuncionarios().subscribe((funcionarios: Funcionario[]) => {
      this.funcionarios = funcionarios;
      console.log('lista func', this.funcionarios);
    });
  }

  editFuncionario(funcionario: Funcionario) {

    this.funcionario = { ...funcionario };
    this.stringDate = new Date(this.funcionario.dataNascimento).toISOString().substring(0, 10);

    this.checkHabilidade();

    console.log("edit func", this.funcionario)
    console.log("edit hab", this.habilidadesMarcadas)
  }

  checkHabilidade(){
    this.Habilidades.forEach(x=> {
      var check = this.funcionario.habilidadeL.filter(function(hab){
        return hab == x.name
      })
      if (check.length > 0){
        x.checked = true;
        this.habilidadesMarcadas.push(x.value)
      }
    });
  }

  desativarFuncionario(funcionario: Funcionario){
    this.funcionario = funcionario;
    this.funcionario.ativo = !this.funcionario.ativo;

    this.checkHabilidade();
    this.funcionario.habilidadeL = this.habilidadesMarcadas;

    this.funcionarioService.saveFuncionario(this.funcionario).subscribe(() => {
      this.getFuncionarios();
      this.funcionario = {} as Funcionario;
      this.initHabilidade();
    });
  }

  onCheckboxChange(e) {

    if (e.target.checked) {
      this.habilidadesMarcadas.push(e.target.value.toString());
    } else {
      var item = this.habilidadesMarcadas.filter(function(hab){
        return hab == e.target.value;
      })
      this.habilidadesMarcadas.splice(this.habilidadesMarcadas.indexOf(item[0]), 1);
      
      console.log("marcadas", this.habilidadesMarcadas)
    }
  }

  cleanForm(form: NgForm) {
    this.getFuncionarios();
    form.resetForm();
    this.funcionario = {} as Funcionario;
    this.initHabilidade();
    
  }
}
