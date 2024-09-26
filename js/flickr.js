const [btnMine, btnPopular] = document.querySelectorAll("nav button");
let dataType = "";

//스크립트 처음 로드시에는 내갤러리 출력
///fetch함수 호출시 인수값을 객체 형태로 전달
///이유 search,user타입 갤러리는 타입 외에도 유저명, 검색어 등의 추가 정보값을 제공해야 되기 때문
fetchFlickr({ type: "mine" });

//각 버튼 클릭시 갤러리 타입 변경
btnMine.addEventListener("click", () => fetchFlickr({ type: "mine" }));
btnPopular.addEventListener("click", () => fetchFlickr({ type: "interest" }));

//특정 요소에 특정 함수 연결
document.body.addEventListener("click", (e) => {
  if (e.target.className === "thumb") createModal(e);
  if (e.target.className === "btnClose") removeModal();
  //목록에서 사용자 프로필 아이디 클릭시 클릭한 Span요소의 사용자 아이디 텍스트값을 fetchFlickr의 인수로 전달해 호출
  if (e.target.className === "userID")
    fetchFlickr({ type: "user", userID: e.target.innerText }); //user타입 갤러리에는 useID라는 추가 프로퍼티로 유저아이디값을 전달
});

//flickr fetching함수
function fetchFlickr(opt) { //type이 opt라는 파라미터 객체안쪽에 들어가 있기 때문에 opt.type
  //인수로 전달된 type정보와 현재 출력되고 있는 dataType이 동일하면
  //다시 data fetching할 필요가 없으므로  return으로 강제 함수 종료
  //만약 타입이 다르면 해당 if문 무시
  if (opt.type === dataType) return;
  //인수로 전달된 타입명으로 현재 dataType을 변경
  dataType = opt.type;

  const api_key = "d0053a4bfac353553d2d0337fd052214";
  const baseURL = `https://www.flickr.com/services/rest/?api_key=${api_key}&method=`;
  const myID = "201491599@N03";
  const method_mine = "flickr.people.getPhotos";
  const method_interest = "flickr.interestingness.getList";
  let url_mine = `${baseURL}${method_mine}&user_id=${myID}&nojsoncallback=1&format=json`;
  //type으로 특정사용자의 ID값을 전달 받은뒤 user_id쿼리에 연결하면 해당 사용자의 갤러리를 호출하는 요청 URL생성
  let url_user = `${baseURL}${method_mine}&user_id=${opt.userID}&nojsoncallback=1&format=json`;
  let url_interest = `${baseURL}${method_interest}&nojsoncallback=1&format=json`;
  let result_url = "";
  if (opt.type === "mine") result_url = url_mine;
  else if (opt.type === "interest") result_url = url_interest;
  //type이 mine, interest가 아니면 특정 사용자 ID일테니 url_user요청 아이디를 result_url에 담아서 fetch함수에 전달
  else if (opt.type === "user") result_url = url_user;


  fetch(result_url)
    .then((data) => data.json())
    .then((json) => {
      const picArr = json.photos.photo;
      createList(picArr);
    });
}

//목록 생성 함수
function createList(dataArr) {
  const list = document.querySelector(".list");
  let tags = "";

  dataArr.forEach((pic) => {
    tags += `
    <li >
          <figure class='pic'>
            <img class='thumb' src="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_z.jpg" alt="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_b.jpg" />
          </figure>
          <h2>${pic.title}</h2>

          <div class='profile'>
            <img src='http://farm${pic.farm}.staticflickr.com/${pic.server}/buddyicons/${pic.owner}.jpg' alt=${pic.owner} /> <span class='userID'>${pic.owner}</span>
          </div>
        </li>
    `;
  });

  list.innerHTML = tags;

  setDefImg();
}

//이미지 엑박시 대체이미지 연결 함수
function setDefImg() {
  const profilePic = document.querySelectorAll(".profile img");
  console.log(profilePic);

  profilePic.forEach(
    (imgEl) =>
    (imgEl.onerror = () =>
      imgEl.setAttribute(
        "src",
        "https://www.flickr.com/images/buddyicon.gif"
      ))
  );
}

//모달생성 함수
function createModal(e) {
  const imgSrc = e.target.getAttribute("alt");
  const modal = document.createElement("aside");
  modal.classList.add("modal");
  modal.innerHTML = `
    < div class='con' >
      <img src=${imgSrc} />
      </ >
    <button class='btnClose'>CLOSE</button>
  `;
  document.body.append(modal);
}

//모달 제거함수
function removeModal() {
  document.querySelector(".modal").remove();
}