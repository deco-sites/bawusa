const handleLoadScript = (src: string, onLoadCallback: () => void) => {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;

  script.onload = () => {
    onLoadCallback();
  };

  document.head.appendChild(script);
};

const handleLoadCss = (styles: string) => {
  const style = document.createElement("style");
  style.innerHTML = styles;
  document.head.appendChild(style);
};

const handleSetScope = () => {
  // deno-lint-ignore ban-ts-comment
  // @ts-expect-error
  window.vtexid.setScope("fa742889-b12a-46f4-b009-6541f0b34c6d");
  // deno-lint-ignore ban-ts-comment
  // @ts-expect-error
  window.vtexid.setScopeName("bawclothing");
};

export const loadVtexIdScripts = (callback: () => void) => {
  handleLoadCss(
    `
      /*LOGIN ESTILIZADO:*/
            .vtexIdUI * {
              font-family: "Nunito Sans" !important; }
            
            .vtexIdUI-show-app {
              -webkit-box-shadow: none !important;
              box-shadow: none !important;
              -webkit-border-radius: 0px !important;
              border-radius: 0px !important;
              -webkit-border-radius: none !important;
              border-radius: none !important; }
  
              html #vtexIdContainer {
                position: fixed !important;
                z-index: 999999 !important;
              }
  
            #vtexIdUI-global-loader {
              z-index: 9999 !important;
              background: white url(https://aviator.vteximg.com.br/arquivos/loading-aviator.gif) no-repeat center center !important;
              opacity: 0.77 !important;
            }
            
            .vtexIdUI-providers-list .btn {
              font-family: 'Nunito Sans';
              letter-spacing: .7px !important; }
            
            .vtexIdUI .alert {
              background-color: transparent !important;
              border: 0 !important;
              color: #dc0505 !important;
              font-family: Nunito, sans-serif;
              text-align: center; }
            
            .vtexIdUI .modal-header .close {
              color: #cecdcd !important;
              font-family: 'Nunito sans', sans-serif !important;
              font-weight: 400 !important;
              outline: none !important; }
  
              .vtexIdUI .btn {
                border-radius: 0 !important;
              }
            
            .vtexIdUI {
              width: 90% !important;
              max-width: 600px;
              -webkit-box-shadow: none !important;
              box-shadow: none !important;
              -webkit-border-radius: 0px !important;
              border-radius: 0px !important;
              top: 0 !important;
              left: 0 !important;
              right: 0;
              bottom: 0;
              margin: auto !important; }
              .vtexIdUI .btn-success {
                background: #0030a0 !important;
                -webkit-border-radius: 0px !important;
                border-radius: 0px !important;
                padding: 10px 45px;
                margin-right: 40px !important;
                font-size: 11px;
                letter-spacing: 1px; }
              .vtexIdUI .vtexIdUI-auth-code .btn {
                font-size: 11px !important; }
              .vtexIdUI input {
                height: 34px !important;
                font-size: 12px !important;
                letter-spacing: .5px;
                margin-bottom: 5px !important;
                color: #505050 !important;
                font-weight: 500 !important;
                padding-left: 12px !important;
                border: 1px solid #505050 !important;
                -webkit-border-radius: 0 !important;
                border-radius: 0 !important;
                -webkit-box-shadow: none !important;
                box-shadow: none !important;
                font-family: Nunito, sans-serif; }
            
            #vtexIdContainer .vtexIdUI .modal-body {
              padding: 5px 55px 30px; }
              @media (max-width: 1024px) {
                #vtexIdContainer .vtexIdUI .modal-body {
                  padding: 5px 15px 30px; } }
            
            .vtexIdUI .modal-header,
            .vtexIdUI .modal-footer {
              background: white !important;
              border: 0 !important; }
            
            .vtexIdUI .modal-header .close {
              background: transparent !important;
              color: grey !important;
              -webkit-transform: scale(2) !important;
              -ms-transform: scale(2) !important;
              transform: scale(2) !important;
              position: absolute !important;
              top: 10px !important;
              right: 10px !important; }
            
            .vtexIdUI h4 {
              font-family: 'Nunito Sans';
              text-align: center !important;
              margin-top: 18px !important;
              margin-bottom: 6px !important;
              padding: 0; }
            
            .vtexIdUI .vtexid-icon-lock.bottom-icon {
              display: none !important; }
            
            h4.vtexIdUI-heading span {
              font-size: 0 !important; }
            
            h4.vtexIdUI-heading span::before {
              content: 'Faça seu login:' !important;
              font-size: 20px !important;
              font-weight: bold;
              color: #000 !important;
              letter-spacing: 1px !important;
              font-family: 'Nunito Sans'; }
            
            .vtexIdUI .btn-large {
              padding: 9px 19px;
              height: 38px !important;
              text-transform: none;
              color: white !important;
              font-weight: normal !important;
              font-size: 14px !important;
              border: 0 !important; }
              .vtexIdUI .btn-large i::before {
                display: none; }
            
            .vtexIdUI .vtexIdUI-send-email::before {
              content: 'Entrar apenas com e-mail' !important;
              font-size: 14px !important;
              position: absolute;
              left: 50%;
              -webkit-transform: translateX(-50%);
              -ms-transform: translateX(-50%);
              transform: translateX(-50%); }
            
            @media all and (max-width: 768px) {
              .vtexIdUI .vtexIdUI-send-email::before {
                font-size: 11px !important; } }
            
            .vtexIdUI .btn-large > span:nth-child(2) {
              font-size: 0px !important; }
            
            .vtexIdUI .btn-large > span {
              font-size: 14px !important; }
            
            .vtexIdUI .vtexIdUI-send-email::before {
              font-size: 14px !important; }
            
            .vtexIdUI .btn {
              -webkit-box-shadow: none !important;
              box-shadow: none !important;
              text-shadow: none !important; }
            
            .vtexIdUI .vtexIdUI-providers-list {
              display: -webkit-box;
              display: -webkit-flex;
              display: -moz-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-orient: vertical;
              -webkit-box-direction: normal;
              -webkit-flex-direction: column;
              -moz-box-orient: vertical;
              -moz-box-direction: normal;
              -ms-flex-direction: column;
              flex-direction: column; }
              @media (max-width: 1024px) {
                .vtexIdUI .vtexIdUI-providers-list .btn {
                  padding-left: 15px; } }
            
            .vtexIdUI .vtexIdUI-providers-list li:nth-child(1) {
              -webkit-box-ordinal-group: 2;
              -webkit-order: 1;
              -moz-box-ordinal-group: 2;
              -ms-flex-order: 1;
              order: 1; }
            
            .vtexIdUI .vtexIdUI-providers-list li:nth-child(2) {
              -webkit-box-ordinal-group: 4;
              -webkit-order: 3;
              -moz-box-ordinal-group: 4;
              -ms-flex-order: 3;
              order: 3; }
            
            .vtexIdUI .vtexIdUI-providers-list li:nth-child(3) {
              -webkit-box-ordinal-group: 3;
              -webkit-order: 2;
              -moz-box-ordinal-group: 3;
              -ms-flex-order: 2;
              order: 2; }
            
            .vtexIdUI .vtexIdUI-providers-list li:nth-child(4) {
              -webkit-box-ordinal-group: 5;
              -webkit-order: 4;
              -moz-box-ordinal-group: 5;
              -ms-flex-order: 4;
              order: 4; }
            
            #vtexIdUI-google-plus {
              background: #E8453C !important; }
            
            button#loginWithUserAndPasswordBtn {
              background: black !important; }
            
            button#loginWithAccessKeyBtn {
              background: #6B6B6B !important; }
            
            #vtexIdUI-facebook {
              background: #4B639A !important; }
            
            text-t .vtexIdUI .vtexIdUI-providers-list .btn i {
              display: none !important; }
            
            button#loginWithAccessKeyBtn::after {
              content: '';
              display: block;
              background: url("https://aviator.vteximg.com.br/arquivos/mail.png") no-repeat;
              display: block;
              height: 20px;
              width: 35px;
              position: absolute;
              top: 25%;
              right: 0%; }
            
            .vtexIdUI #vtexIdUI-google-plus::after {
              content: '';
              display: block;
              background: url("https://aviator.vteximg.com.br/arquivos/gplus.png") no-repeat;
              display: block;
              height: 30px;
              width: 39px;
              position: absolute;
              top: 14%;
              right: 0%; }
            
            .vtexIdUI #vtexIdUI-facebook::after {
              content: '';
              display: block;
              background: url("https://aviator.vteximg.com.br/arquivos/facebookicon.png") no-repeat;
              display: block;
              height: 30px;
              width: 30px;
              position: absolute;
              top: 15%;
              right: 0%;
              -webkit-transform: scaleY(0.89);
              -ms-transform: scaleY(0.89);
              transform: scaleY(0.89); }
            
            button#loginWithUserAndPasswordBtn::after {
              content: '';
              display: block;
              background: url("https://aviator.vteximg.com.br/arquivos/lock.png") no-repeat;
              height: 30px;
              width: 39px;
              position: absolute;
              top: 21%;
              right: -2%; }
            
            .vtexIdUI-heading {
              font-size: 0 !important; }
              @media all and (min-width: 1024px) {
                .vtexIdUI-heading {
                  padding-bottom: 4px !important; } }
            
            .vtexIdUI-confirm-email .vtexIdUI-heading::before {
              font-size: 20px !important;
              font-family: 'Nunito Sans';
              font-weight: bold !important;
              color: black !important;
              letter-spacing: 1px !important;
              content: 'Por favor, informe seu E-mail' !important; }
            
            .vtexIdUI .modal-footer {
              border: 0 !important;
              padding: 0px 15px 30px !important; }
            
            .vtexIdUI-back-link.pull-left.dead-link span {
              color: #505050;
              font-family: 'Nunito sans', sans-serif !important;
              font-weight: 700 !important;
              font-size: 11px !important;
              display: inline-block !important;
              margin-top: 0 !important;
              margin-left: 3px !important;
              letter-spacing: .5px !important; }
            
            .vtexIdUI-back-link .vtexid-icon-arrow-left {
              color: grey;
              background: url(https://aviator.vteximg.com.br/arquivos/arrow-left.png) no-repeat;
              -webkit-background-size: cover;
              background-size: cover;
              height: 26px;
              width: 26px;
              display: inline-block !important; }
            
            .vtexIdUI-back-link .vtexid-icon-arrow-left:before {
              content: '' !important; }
            
            .vtexIdUI-confirm-email .modal-footer .pull-right {
              background: #0030a0 !important;
              -webkit-border-radius: 50px !important;
              border-radius: 50px !important;
              padding: 8px 45px !important;
              margin-right: 40px !important;
              font-size: 14px !important;
              letter-spacing: 1px !important;
              font-weight: 700; }
            
            .vtexIdUI-confirm-email .modal-footer button {
              background: #0030a0 !important;
              -webkit-border-radius: 0px !important;
              border-radius: 0px !important;
              padding: 10px 30px !important;
              margin-right: 40px !important;
              font-size: 11px !important;
              letter-spacing: 1px !important; }
            
            .vtexIdUI-classic-login h4 .vtexIdUI-heading {
              font-size: 20px !important;
              font-weight: bold;
              font-family: 'Nunito sans', serif !important;
              color: black !important;
              letter-spacing: 1px !important; }
            
            .vtexIdUI-classic-login h4 .vtexIdUI-heading::after {
              content: ':' !important;
              display: inline-block !important; }
            
            #vtexIdUI-form-classic-login > div.modal-body > div.control-group.vtexIdUI-classic-login-control.email-model > label > span,
            #vtexIdUI-form-classic-login > div.modal-body > div:nth-child(2) > label > span {
              display: none !important; }
            
            .vtexIdUI-classic-login .control-label span {
              display: none !important; }
            
            .vtexIdUI .vtexIdUI-back-link.pull-left.dead-link {
              margin: 5px 40px !important;
              display: -webkit-box !important;
              display: -webkit-flex !important;
              display: -moz-box !important;
              display: -ms-flexbox !important;
              display: flex !important;
              -webkit-box-align: center;
              -webkit-align-items: center;
              -moz-box-align: center;
              -ms-flex-align: center;
              align-items: center; }
            
            .vtexIdUI .vtexIdUI-back-link.pull-left.dead-link:hover {
              text-decoration: none;
              color: black; }
            
            #appendedInputButton {
              outline: 0 !important;
              height: 38px !important;
              min-height: auto !important; }
            
            #vtexIdUI-global-loader {
              opacity: 0.77 !important; }
            
            #classicLoginBtn {
              background: #0030a0 !important;
              -webkit-border-radius: 50px !important;
              border-radius: 50px !important;
              padding: 8px 45px !important;
              margin-right: 40px !important;
              font-size: 14px !important;
              letter-spacing: 1px !important;
              font-weight: 700; }
            
            #vtexIdUI-form-classic-login .dead-link.pull-right {
              /* esqueci minha senha */
              display: block;
              margin-bottom: 14px !important;
              float: none !important;
              color: #505050 !important;
              font-family: 'Nunito sans', sans-serif;
              font-weight: 500;
              font-size: 12px !important;
              text-align: right; }
            
            @media all and (max-width: 480px) {
              .vtexIdUI .vtexIdUI-back-link.pull-left.dead-link {
                margin: 0 !important;
                margin-top: 4px !important; }
              #classicLoginBtn,
              #sendAccessKeyBtn {
                margin-right: 0px !important; } }
            
            .vtexIdUI-auth-code .modal-body {
              margin-top: -30px !important; }
            
            .vtexIdUI-auth-code .modal-body::before {
              content: 'Informar chave de acesso';
              font-weight: bold;
              font-size: 20px !important;
              font-family: "Nunito sans" !important;
              color: #000 !important;
              letter-spacing: 1px !important;
              margin-bottom: 20px;
              display: block;
              text-align: center !important; }
            
            .vtexid-instruction {
              margin: 0 !important; }
            
            .vtexIdUI-auth-code .info-code {
              font-weight: bold !important;
              font-family: 'Nunito sans' !important;
              font-size: 16px !important; }
            
            .vtexIdUI-auth-code .info-code span {
              font-weight: normal !important;
              line-height: 24px !important; }
            
            .vtexIdUI-auth-code .vtexIdUI-code-field {
              max-width: 305px !important; }
            
            .vtexIdUI-auth-code input {
              height: 38px !important;
              -webkit-border-radius: 0px !important;
              border-radius: 0px !important;
              border-color: black !important;
              margin: 20px 0 !important; }
            
            #confirmLoginAccessKeyBtn {
              background: #0030a0 !important;
              -webkit-border-radius: 50px !important;
              border-radius: 50px !important;
              padding: 8px 45px !important;
              margin-right: 40px !important;
              font-size: 14px !important;
              letter-spacing: 1px !important;
              font-weight: 700; }
            
            #vtexIdUI-change-pswd .modal-header .vtexIdUI-header {
              display: none; }
            
            #vtexIdUI-change-pswd .modal-header h4:before {
              content: 'Cadastrar nova senha:';
              font-size: 20px !important;
              font-family: "Nunito sans" !important;
              font-weight: bold !important;
              color: #000 !important;
              letter-spacing: 1px !important; }
            
            #vtexIdUI-change-pswd .modal-header .vtexid-icon-user {
              display: none !important; }
            
            #vtexIdUI-change-pswd .modal-body {
              position: relative !important; }
            
            #vtexIdUI-change-pswd .modal-body .vtexid-icon-lock {
              display: none !important; }
            
            #vtexIdUI-change-pswd .modal-body .info-why {
              position: absolute !important;
              right: 60px !important;
              font-weight: bold !important;
              font-size: 15px !important; }
            
            #tryChangePswdBtn {
              background: #0030a0 !important;
              -webkit-border-radius: 50px !important;
              border-radius: 50px !important;
              padding: 8px 45px !important;
              margin-right: 40px !important;
              font-size: 0 !important;
              letter-spacing: 1px !important;
              font-weight: 700; }
            
            #tryChangePswdBtn::before {
              font-size: 14px !important;
              content: 'Cadastrar';
              display: block; }
            
            .vtexid-password-requirements {
              color: black !important;
              font-weight: bold !important;
              line-height: 18px !important;
              font-size: 13px !important;
              letter-spacing: 0.5px !important; }
            
            .vtexid-password-requirements-list {
              margin: 0 !important;
              font-family: Nunito, helvetica, sans-serif;
              font-size: 12px;
              font-weight: 600; }
            
            #vtexIdUI-change-pswd .modal-body .control-group label {
              font-size: 12px;
              color: #000000;
              font-family: Nunito, helvetica, sans-serif;
              font-weight: 700; }
            
            #vtexIdUI-change-pswd .vtexIdUI-user {
              display: -webkit-box !important;
              display: -webkit-flex !important;
              display: -moz-box !important;
              display: -ms-flexbox !important;
              display: flex !important;
              -webkit-box-pack: center;
              -webkit-justify-content: center;
              -moz-box-pack: center;
              -ms-flex-pack: center;
              justify-content: center;
              margin-top: 18px !important; }
            
            button#loginWithAccessKeyBtn {
              /* padding-left: 60px !important; */ }
            
            #vtexIdUI-change-pswd form {
              padding-top: 18px !important; }
            
            .vtexIdUI-auth-code .modal-footer {
              margin-top: 20px !important; }
            
            #vtexIdUI-form-classic-login > div.modal-body > div:nth-child(2) > a {
              margin-top: 0px !important; }
            
            @media all and (max-width: 480px) {
              #vtexIdUI-change-pswd .modal-body .info-why {
                position: relative !important;
                margin-top: 0 !important;
                right: unset !important;
                font-size: 14px !important; }
              #vtexIdUI-change-pswd form {
                padding-top: 9px !important; }
              #vtexIdUI-change-pswd .modal-body .control-group label {
                margin-bottom: 0 !important;
                margin-top: 4px !important; }
              #tryChangePswdBtn,
              #sendAccessKeyBtn,
              #classicLoginBtn,
              #confirmLoginAccessKeyBtn {
                margin-right: 0 !important; } }
            
            @media all and (min-width: 1279px) and (max-width: 1281px) {
              #vtexIdUI-change-pswd .modal-body .info-why {
                font-size: 13px !important; } }
            
            #bannerEbit {
              margin-bottom: 20px; }
      `,
  );
  handleLoadScript(
    "https://io.vtex.com.br/front-libs/jquery/1.8.3/jquery-1.8.3.min.js?v=1.5.87.2539",
    () => {
      handleLoadScript(
        "https://io.vtex.com.br/vtex-id-ui/3.27.1/vtexid-jquery.min.js?v=1.5.87.2539",
        () => {
          handleSetScope();
          callback();
        },
      );
    },
  );
};
