const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document)

//Đối tượng `validator`:
var validator = (options) => { //options là opject đc truyền vào bên main branch

    var selectorRules = {};

    //function thực hiện validate
    var validate = (inputElement, rule) => {
        var errorMessage = rule.test(inputElement.value)
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector) 
        
        if (errorMessage) {
            errorElement.innerText = errorMessage //=> khi có lỗi thì truyền giá trị của errorMessage vào
            errorElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = '' //=> khi không có lỗi thì xoá
            errorElement.parentElement.classList.remove('invalid')
        }
    }

    //Lấy element của form cần validate
    var formElement = $(options.form); //=> lấy form element đc truyền id vào obj
    if (formElement) {
        options.rules.forEach((rule) => {

            //lưu lại rule:
            // selectorRules[rule.selector] = rule.test
                if(Array.isArray(selectorRules[rule.selector])) {
                    selectorRules[rule.selector].push([rule.test])
                } else {
                    selectorRules[rule.selector] = [rule.test]
                }

                var inputElement = formElement.querySelector(rule.selector);

                if (inputElement) {

                    //xử lý trường hợp blur ra ngoài:
                    inputElement.onblur = () => {
                        //value: inputElement.value;
                        //test func: rule.test 
                        validate(inputElement, rule);
                    };

                    //xử lý khi người dùng nhập:
                    inputElement.oninput = () => {
                        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                        errorElement.innerText = ''; //=> khi không có lỗi thì xoá
                        errorElement.parentElement.classList.remove('invalid');
                    };
                }
            })
    }
}


//Định nghĩa rules:
//Nguyên tắc:
//1. khi có lỗi trả ra mess lỗi,
//2. khi ko có thì không trả về gì cả

//Phải điền 
validator.isRequired = (selector, message) => { //lấy đối số bên main branch 
    return { //return cái gì nhận lại cái đó
        selector,
        test: (value) => value.trim() ? undefined :  message ||'Vui lòng nhập trường này',
    };
}

//Phải là email
validator.isEmail = (selector, message) => {
    return ({
        selector,
        test: (value) => {
            var rejex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
            return rejex.test(value) ? undefined :  message ||'Vui lòng nhập Email';
        },
    });
}

//Phải là password:
validator.isPassword = (selector,min, message) => {
    return ({
        selector,
        test: (value) => value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`,
    });
}


validator.isConfirm = (selector, getConfirmValue, message) => {
    return ({
        selector,
        test: (value) => {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chình xác';
        }
    });
}

