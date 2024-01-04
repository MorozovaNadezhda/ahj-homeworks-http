/* eslint-disable no-console */
export default function defaultData(value) {
  const params = new URLSearchParams();
  params.append('name', 'Поменять краску в принтере, ком.404');
  params.append('description', 'Принтер HP LJ1210, картриджи на складе');
  const xhr = new XMLHttpRequest();

  if (value === true) {
    xhr.open('POST', 'https://ahj-homeworks-http.herokuapp.com/');
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
      } else {
        console.log('status is not 200');
      }
    });

    xhr.send(params);
  }

  xhr.abort(params);
}