const api_key = "d0053a4bfac353553d2d0337fd052214";
const baseURL = `https://www.flickr.com/services/rest/?api_key=${api_key}&method=`;
const myID = "201491599@N03";
const method_mine = "flickr.people.getPhotos";
let url = `${baseURL}${method_mine}&user_id=${myID}&nojsoncallback=1&format=json`;
//기본요청URL에 쿼리값 제대로 넣어서 fetch처리했을때
//콘솔문에 not valid json 오류뜨는 경우
//원인 : json데이터가 callback함수안에 들어가 있는 경우
//해결방법 : format=json&nojsoncallback=1 (callback안쪽의 json데이터를 직접 가져옴)

fetch(url)
  .then((data) => data.json())
  .then((json) => {
    console.log(json);
  });