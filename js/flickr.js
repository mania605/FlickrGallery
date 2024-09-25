const list = document.querySelector(".list");
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
    const picArr = json.photos.photo;
    let tags = "";

    picArr.forEach((pic) => {
      tags += `
        <li>
          <figure class='pic'>
          <img class='thumb' src="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_z.jpg" alt="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_z.jpg"/${pic.title} />
          </figure>
          <h2>${pic.title}</h2>

          <div class='profile'>
            <img src='http://farm${pic.farm}.staticflickr.com/${pic.server}/buddyicons/${pic.owner}.jpg' alt=${pic.owner} /> <span>${pic.owner}</span>
          </div>
        </li>
      `;
    });

    list.innerHTML = tags;

    //미션1 - 현재 img.thumb을 클릭시 레이어모달이 생성됨 처리

    //미션2 - 동적으로 생성된 레이어팝업의 닫기버튼 클릭시 레이어모달 제거

    //미션3 - img.thumb의 alt속성에 숨겨놓은 근해상도의 이미지에 url을 레이어 모달 안에 출력




    // 미션 1: 이미지 클릭 시 레이어 모달 생성
    const thumbs = document.querySelectorAll(".thumb");
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", (e) => {
        createModal(e.target.alt, e.target.title);
      });
    });
  });


// 미션 1: 레이어 모달 생성 함수
function createModal(imgSrc, imgTitle) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <img src="${imgSrc}" alt="${imgTitle}" />
      <p>${imgTitle}</p>
      <button class="close-btn">Close</button>
    </div>
  `;
  document.body.append(modal);

  // 미션 2: 닫기 버튼 클릭 시 모달 제거
  const closeBtn = modal.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });
}

// CSS: 모달 스타일 (적절한 위치에 추가)
const style = document.createElement("style");
style.innerHTML = `
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    text-align: center;
  }

  .modal-content img {
    max-width: 90vw;
    max-height: 80vh;
  }

  .close-btn {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #333;
    color: white;
    border: none;
    cursor: pointer;
  }
`;
document.head.append(style);