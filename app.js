class Game {
  constructor(title, genre, year, id) {
    this.title = title;
    this.genre = genre;
    this.year = year;
    this.id = id;
  }
}

class UI {
  static displayGames() {
    const games = Store.getGames();
    games.forEach((book) => { UI.addGameToList(book) });
  }
  static addGameToList(game) {
    const list = document.querySelector('#game-list');
    const row = document.createElement('tr');
    row.innerHTML = `
          <td>${game.title}</td>
          <td>${game.genre}</td>
          <td>${game.year}</td>
          <td>${game.id}</td>
          <td><a class="btn btn-danger delete">X</a></td>
      `;
    list.append(row);

  }
  static removeGame(el) {
    if (el.classList.contains('delete')) {
      const row = el.parentElement.parentElement;
      row.remove();
      UI.showAlert('Game Deleted', 'info', table)
    }
  }
  static showAlert(message, className, place) {
    const container = document.querySelector('.container');
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.append(document.createTextNode(`${message}`));
    container.insertBefore(div, place);
    setInterval(() => {
      div.remove();
    }, 2000);
  }

}
//Local Storage class
class Store {
  static getGames() {
    let games;
    if (localStorage.getItem('games') == null) {
      games = [];
    }
    else {
      games = JSON.parse(localStorage.getItem('games'));
    }
    return games;
  }
  static addGames(game) {
    const games = Store.getGames();
    games.push(game);
    localStorage.setItem('games', JSON.stringify(games));
  }
  static deleteGames(id) {
    const games = Store.getGames();
    games.forEach((game, index) => {
      if (game.id === id) {
        games.splice(index, 1);
      }
    });
    localStorage.setItem('games', JSON.stringify(games));
  }
}


let form = document.querySelector('#game-form');
let list = document.querySelector('#game-list');
let table = document.querySelector('#game-table')
//add event for display books when Document loaded
document.DOMContentLoaded = UI.displayGames();

//add event for add book to the list

form.onsubmit = (e) => {
  e.preventDefault();
  //get values from the form
  let title = document.querySelector('#title').value;
  let genre = document.querySelector('#genre').value;
  let year = document.querySelector('#year').value;
  let gId = document.querySelector('#game-id').value;
  //form validation
  if (title == '' || genre == '' || year == '') {
    UI.showAlert('Please fill in all the field', 'danger', form);
  }
  else {
    const game = new Game(title, genre, year, gId);
    //add games from from form input;
    UI.addGameToList(game);
    Store.addGames(game);
    UI.showAlert('Game Added', 'success', form);
  }

  form.reset();
}

//add event for removing a book;

list.onclick = (e) => {
  UI.removeGame(e.target);
  Store.deleteGames(e.target.parentElement.previousElementSibling.textContent);
}