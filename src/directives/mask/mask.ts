import { Directive, Attribute } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    selector: '[mask]',
    host: {
        '(keyup)': 'onInputChange($event)'
    },
    providers: [NgModel]
})
export class Mask {

    pattern: string;

    constructor(
        public model: NgModel,
        @Attribute('mask') pattern: string
    ) {
        this.pattern = pattern;
    }

    onInputChange(event) {
        let value = event.target.value,
            pattern = this.pattern;
            
        // Remover o caracter que foi inserido caso não seja um número
        value = value.replace(/[a-zA-Z!@#\$%\^\&*\)\(+=_]+$/g, '');

        if (event.keyIdentifier === 'U+0008' || event.keyCode === 8 || event.key === 'Backspace') {
            if (value.length) { //prevent fatal exception when backspacing empty value in progressive web app
                //remove all trailing formatting then delete character
                while (pattern[value.length] && pattern[value.length] !== '*') {
                    value = value.substring(0, value.length - 1);
                }
                //remove all leading formatting to restore placeholder
                if (pattern.substring(0, value.length).indexOf('*') < 0) {
                    value = value.substring(0, value.length - 1);
                }
            }
        } else {
            let maskIndex = value.length,
                formatted = '';
            if (value.length === 1 && value !== pattern[0]) {
                //apply leading formatting
                maskIndex = 0;
                while (maskIndex < pattern.length && pattern[maskIndex] !== '*') {
                    formatted += pattern[maskIndex];
                    maskIndex++;
                }
            }
            formatted += value;
            if (maskIndex < pattern.length) {
                //apply trailing formatting
                while (pattern[maskIndex] !== '*') {
                    formatted += pattern[maskIndex];
                    maskIndex++;
                }
            }
            value = formatted;
        }
        this.model.update.emit(value);
    }

}