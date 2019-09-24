var headlines = document.querySelectorAll('.headline');

Array.from(headlines).map(headline => headline.insertAdjacentHTML('afterend', '<a class="stopclickbait" href="#">Disable clickbait!</a>'));

Array.from(document.querySelectorAll('.stopclickbait')).map(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    if (this.classList.contains('active')) {
      this.classList.remove('active');
      button.nextElementSibling.classList.add('hidden');
      button.textContent = 'Disable clickbait!';
    } else {
      button.textContent = 'Enable clickbait :(';
      if (button.nextElementSibling && button.nextElementSibling.classList.contains('popup')) {
        button.classList.add('active');
        button.nextElementSibling.classList.remove('hidden');
      } else {
        var link = button.previousElementSibling.querySelector('a').getAttribute('href');
        var popup = document.createElement('div');
        var close = document.createElement('div');
        this.classList.add('active');
        popup.classList.add('popup');
        close.classList.add('button-close');
        close.innerHTML = '&times;';

        document.body.addEventListener('click', function(event) {
          event.stopPropagation();
          if (event.srcElement.className === 'button-close') {
            document.querySelector('.popup:not(.hidden)') ? document.querySelector('.popup:not(.hidden)').classList.add('hidden') : '';
            document.querySelector('.stopclickbait.active') ? document.querySelector('.stopclickbait.active').textContent = 'Disable clickbait!' : '';
            document.querySelector('.stopclickbait.active') ? document.querySelector('.stopclickbait.active').classList.remove('active') : '';
          }
        });

        fetch(link).then(response => {
          response.text().then(text => {
            var parser = new DOMParser();
            var article = parser.parseFromString(text, 'text/html');
            var bolds = article.querySelectorAll('#article-content .row b');

            Array.from(bolds).map(bold => {
              var filteredWords = ['MÁS SOBRE ESTE TEMA:', 'Infobae', ' Infobae', 'Seguí leyendo'];
              var regex = new RegExp(filteredWords.join( "|" ), "i");

              if (!regex.test(bold.textContent)) {
                var text = document.createElement('p');
                text.innerHTML = bold.textContent;
                popup.appendChild(text);
              }
            });
            popup.appendChild(close);
            button.insertAdjacentHTML('afterend', popup.outerHTML);
          });
        });
      }
    }
  });
});
