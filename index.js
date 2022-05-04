const API_URL_RANDOM = 'https://api.thedogapi.com/v1/images/search?limit=5';
const API_URL_FAVOURITE = 'https://api.thedogapi.com/v1/favourites';
const API_URL_UPLOAD = 'https://api.thedogapi.com/v1/images/upload';
const API_URL_FAVOURITE_DELETE = (id) => `https://api.thedogapi.com/v1/favourites/${id}`;
const key = '1305430a-71f1-466c-a452-a2676d7bbc7a';

async function getRandomDogs() {
    const wrapper = document.querySelector('.random__card-wrapper');
    const fragment = new DocumentFragment();

    const response = await fetch(API_URL_RANDOM);
    const data = await response.json();

    console.log ('random: ', data);

    wrapper.innerHTML = '';

    data.forEach(dog => {
        const div = document.createElement('div');
        div.classList.add('card-item');

        const img = document.createElement('img');
        img.src = dog.url;

        const button = document.createElement('button');
        const buttonText = document.createTextNode('+ Add Favourite');
        button.appendChild(buttonText);
        button.type = 'button';
        
        button.id = dog.id;
        // debugger;
        button.onclick = () => addFavourite(button.id);

        div.appendChild(img);
        div.appendChild(button);
        fragment.appendChild(div);
    });

    wrapper.appendChild(fragment)
}

async function addFavourite(id) {
    const response = await fetch(API_URL_FAVOURITE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': '1305430a-71f1-466c-a452-a2676d7bbc7a',
        },
        body: JSON.stringify({
            'image_id': id,
        }),
    });

    const data = await response.json(); 
    
    if (response.status > 299) {
        console.log(data.message);
    } else {
        console.log(response, data);
        getFavouritesDogs();
    }
}

async function getFavouritesDogs() {
    const wrapper = document.querySelector('.favourites__card-wrapper');
    const fragment = new DocumentFragment();

    const response = await fetch(API_URL_FAVOURITE, {
        headers: {
            'x-api-key': key,
        }
    });
    const data = await response.json();

    console.log ('favourites: ', data);

    wrapper.innerHTML = '';

    data.forEach(dog => {
        const div = document.createElement('div');
        div.classList.add('card-item');

        const img = document.createElement('img');
        img.src = dog.image.url;

        const button = document.createElement('button');
        const buttonText = document.createTextNode('Remove');
        button.appendChild(buttonText);
        button.type = 'button';

        button.id = dog.id;
        button.onclick = () => deleteFavourite(dog.id);

        div.appendChild(img);
        div.appendChild(button);
        fragment.appendChild(div);
    });

    wrapper.appendChild(fragment)
}

async function deleteFavourite(id) {
    const response = await fetch(API_URL_FAVOURITE_DELETE(id), {
        method: 'DELETE',
        headers: {
            'x-api-key': '1305430a-71f1-466c-a452-a2676d7bbc7a',
        },
        body: JSON.stringify({
            'image_id': id,
        })
    });
    const data = await response.json();

    if(response.status > 299) {
        console.error(response, data);
    } else {
        console.log(response, data);
        getFavouritesDogs();
    }
}

async function uploadDog() {
    const form = document.getElementById('upload-picture');
    const formData = new FormData(form);

    const response = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'x-api-key': key,
        },
        body: formData,
    });
    const data = await response.json();
    
    if(response.status > 299) {
        console.error(response, data);
    } else {
        console.log(response, data);
        addFavourite(data.id);
    }
    
}

const inputFile = document.querySelector('#upload-picture input');
inputFile.addEventListener('change', () => {
    const fileList = inputFile.files;
    const img = document.querySelector('.preview img');
    const uploadPanel = document.querySelector('.upload__panel');

    if(fileList.length) {
        img.src = URL.createObjectURL(fileList[0]);
        uploadPanel.style.display = 'block';
    } else {
        uploadPanel.style.display = 'none';
    }
})

getRandomDogs();
getFavouritesDogs();
