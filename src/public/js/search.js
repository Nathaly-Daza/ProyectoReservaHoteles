/*function searchHotels() {
    const destino = document.getElementById('destino').value;
    const invitados = document.getElementById('invitados').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
  
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
  
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === this.DONE) {
        console.log(JSON.parse(this.responseText));
        // Aquí puedes manejar la respuesta, por ejemplo, mostrando los resultados en la página
        displayResults(JSON.parse(this.responseText));
      }
    });
  
    xhr.open('GET', `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(destino)}`);
    xhr.setRequestHeader('x-rapidapi-key', 'ezzxiIiPlccgOf1B5RpxNTnDWxYurcz5U');
    xhr.setRequestHeader('x-rapidapi-host', 'booking-com15.p.rapidapi.com');
  
    xhr.send();
  }
  
  function displayResults(results) {
    // Aquí puedes crear elementos HTML para mostrar los resultados
    // Por ejemplo:
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'searchResults';
    
    results.forEach(result => {
      const resultElement = document.createElement('div');
      resultElement.textContent = result.name; // Asume que cada resultado tiene una propiedad 'name'
      resultsContainer.appendChild(resultElement);
    });
  
    // Reemplaza o añade los resultados a la página
    const existingResults = document.getElementById('searchResults');
    if (existingResults) {
      existingResults.replaceWith(resultsContainer);
    } else {
      document.querySelector('.container').appendChild(resultsContainer);
    }
  }*/