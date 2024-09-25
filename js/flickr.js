const list = document.querySelector(".list");
const api_key = "d0053a4bfac353553d2d0337fd052214";
const baseURL = `https://www.flickr.com/services/rest/?api_key=${api_key}&method=`;
const myID = "201491599@N03";
const method_mine = "flickr.people.getPhotos";
let url = `${baseURL}${method_mine}&user_id=${myID}&nojsoncallback=1&format=json`;


fetch(url)
  .then((data) => data.json())
  .then((json) => {
    const picArr = json.photos.photo;
    let tags = "";

    picArr.forEach((pic) => {
      tags += `
        <li>
          <figure class='pic'>
            <img class='thumb' src="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_z.jpg" alt="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_b.jpg" />
          </figure>
          <h2>${pic.title}</h2>

          <div class='profile'>
            <img src='http://farm${pic.farm}.staticflickr.com/${pic.server}/buddyicons/${pic.owner}.jpg' alt=${pic.owner} /> <span>${pic.owner}</span>
          </div>
        </li>
      `;
    });

    list.innerHTML = tags;
  });

//body요소에 클릭했을때 클릭한요소의 클래스명을 구분자로 설정
//특정 요소에 특정 함수 연결
document.body.addEventListener("click", (e) => {
  if (e.target.className === "thumb") createModal(e);
  if (e.target.className === "btnClose") removeModal();
});

//모달생성 함수
function createModal(e) {
  const imgSrc = e.target.getAttribute("alt");

  const modal = document.createElement("aside");
  modal.classList.add("modal");
  modal.innerHTML = `
      <div class='con'>
        <img src=${imgSrc} />
      </div>
      <button class='btnClose'>CLOSE</button>
    `;

  document.body.append(modal);
}

//모달 제거함수
function removeModal() {
  document.querySelector(".modal").remove();
}