const API_BASE_URL = 'https://api.thedogapi.com/v1';

const API_URL_RANDOM = (quantity) => `${API_BASE_URL}/images/search?limit=${quantity}`;
const API_URL_FAVOURITE = `${API_BASE_URL}/favourites`;
const API_URL_UPLOAD = `${API_BASE_URL}/images/upload`;
const API_URL_FAVOURITE_DELETE = (id) => `${API_BASE_URL}/favourites/${id}`;
const key = '1305430a-71f1-466c-a452-a2676d7bbc7a';

async function getRandomDogs() {
    const wrapper = document.querySelector('.random__card-wrapper');
    const fragment = new DocumentFragment();
    const viewportWidth = window.innerWidth;

    let imageQuantity = 4;

    console.log(viewportWidth);
    if (viewportWidth >= 1020){
        if (viewportWidth > 1159) {
            imageQuantity = 8;
        } else {
            imageQuantity = 6
        }
    }


    const response = await fetch(API_URL_RANDOM(imageQuantity));
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
    const uploadPanel = document.querySelector('.upload__panel');
    const uploadMessage = document.querySelector('.upload-message');

    const response = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'x-api-key': key,
        },
        body: formData,
    });
    const data = await response.json();
    
    uploadPanel.style.display = 'none';

    if(response.status > 299) {
        console.error(response, data);

        uploadMessage.style.display = 'block';
        uploadMessage.innerText = data.message;
    } else {
        console.log(response, data);
        addFavourite(data.id);
        uploadMessage.style.display = 'block';
        uploadMessage.innerText = 'Dog uploaded successfully';
    }
    
}

const inputFile = document.querySelector('#upload-picture input');
inputFile.addEventListener('change', () => {
    const fileList = inputFile.files;
    const img = document.querySelector('.preview img');
    const uploadPanel = document.querySelector('.upload__panel');
    const uploadMessage = document.querySelector('.upload-message');

    uploadPanel.style.display = 'block'
    uploadMessage.style.display = 'none';

    if(fileList.length) {
        img.src = URL.createObjectURL(fileList[0]);
        uploadPanel.style.display = 'block';
    } else {
        uploadPanel.style.display = 'none';
    }
})

getRandomDogs();
getFavouritesDogs();
