
class UI {
       constructor() {
           let formAssemble = document.querySelector('#form-assemble');
           let results = document.querySelector('.results');
           let loading = document.querySelector('.loading');
           let header = document.querySelector('.card');
           let card = document.querySelector('.card').parentElement;
           let textarea = document.querySelector('#text');
           //let historyBox = document.querySelector('#')
       }
   
       preLoader() {
           $(window).on('load', function () {
               $("#preloader").delay(1800).fadeOut();
           });
       }
       showLoading(){
           loading.style.display = 'block';
           results.style.display = 'none';
       }
       showResults(){
           loading.style.display = 'none';
           results.style.display = 'block';
       }
       showError(e){
           let alertError = document.createElement('div');
                   
           alertError.className = "alert alert-danger mt-3 alert-dismissible fade show";
           alertError.innerHTML=`
           <strong>${e.name} : </strong> 
               ${e.message}
           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
               <span aria-hidden="true">&times;</span>
           </button>`
           card.insertBefore(alertError, header);
           alertError.style.display="none";
           $('.alert').fadeIn();
           console.log(e.message);
       }
       navbar(){
           $('ul li').on('click', function() {
               $('li').removeClass('active');
               $(this).addClass('active');
           });
       }
       // showHistory(code){
       //    let li =  document.createElement('li');
       //    let a =  document.createElement('a');
       //    let div = document.createElement('div');
       //    div.textContent = code;
       //    div.className = "history";
       //    a.appendChild(div);
       //    li.appendChild(a);
       //    document.querySelector('#history').appendChild(li);
       // }
   }