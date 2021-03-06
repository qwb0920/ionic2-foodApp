import {Page, Loading} from 'ionic-angular';
import {NavController, Toast} from 'ionic-angular';
import {Component} from '@angular/core';
import {HomePage} from '../home/home';
import {FORM_DIRECTIVES, FormBuilder,  ControlGroup, Validators, AbstractControl} from '@angular/common';
import {CustomValidators} from '../validators/customvalidators';
import {FacebookLogin} from '../../util/facebook-login';
import {Fire} from '../../util/fire';
import {MenuController} from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/login/login.html',
    directives: [FORM_DIRECTIVES]
})
export class LoginPage {

    authForm: ControlGroup;
    username: AbstractControl;
    password: AbstractControl;
    email: AbstractControl;

    home: string = "home";
    constructor(public nav: NavController, private navController: NavController, private fb: FormBuilder, private fire: Fire, public menuCtrl: MenuController) {
        this.menuCtrl.enable(false);
        this.authForm = fb.group({
            'username': ['', Validators.compose([Validators.required, Validators.minLength(3), CustomValidators.checkFirstCharacterValidator])],
            'email': ['', Validators.compose([Validators.required, CustomValidators.checkFirstCharacterValidator])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(8), CustomValidators.checkFirstCharacterValidator])]
        });

        this.username = this.authForm.controls['username'];
        this.password = this.authForm.controls['password'];
        this.email = this.authForm.controls['email'];
    }

    onSubmit(value: string): void {
        if(this.authForm.valid) {
            console.log('Valores enviados: ', value);
        }
        this.menuCtrl.enable(true);
    }

    onLogin() {
        FacebookLogin.login(response => {
            this.fire.login(response.accessToken, () => {
                this.nav.setRoot(HomePage);
            }, error => {
                alert('error');
            });
        }, error => {
            alert(error);
        });
    }

    loginEnter() {
        let loading = Loading.create({
            content: "Espere um momento...",
            duration: 2300,
            dismissOnPageChange: false
        });
        this.nav.present(loading).then(()=>{
            this.nav.setRoot(HomePage);
        });
    }
}
