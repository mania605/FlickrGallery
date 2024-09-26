//{type:'Search',tags:'sky'}
//{"{type:"Search}

let optString = "";
const [btnMine, btnPopular] = document.querySelectorAll("nav button");
const [_, inputSearch, btnSearch] = document.querySelector(".searchBox").children;//searchBox안쪽에 있는 두번째 요소인 input, 세번째 요소인 btnSearch를 비구조할당으로 변수할당

fetchFlickr({ type: "mine" });//스크립트 처음 로드시에는 내갤러리 출력  ///fetch함수 호출시 인수값을 객체 형태로 전달 ///이유 search,user타입 갤러리는 타입 외에도 유저명, 검색어 등의 추가 정보값을 제공해야 되기 때문///이유 search,user타입 갤러리는 타입 외에도 유저명, 검색어 등의 추가 정보값을 제공해야 되기 때문

btnMine.addEventListener("click", () => fetchFlickr({ type: "mine" }));//각 버튼 클릭시 갤러리 타입 변경
btnPopular.addEventListener("click", () => fetchFlickr({ type: "interest" }));
btnSearch.addEventListener("click", () => {
  if (!inputSearch.value) return;    //검색어를 입력하지 않고 검색버튼 클릭시 함수 강제중지
  fetchFlickr({ type: "search", tags: inputSearch.value });   //인풋요소의 value값 (검색어)을 tags에 담아 fetchFlickr함수 호출
  inputSearch.value = "";  //호출시 input요소의 검색어는 지워줌
});

document.body.addEventListener("click", (e) => { //특정 요소에 특정 함수 연결
  if (e.target.className === "thumb") createModal(e);
  if (e.target.className === "btnClose") removeModal();  //목록에서 사용자 프로필 아이디 클릭시 클릭한 Span요소의 사용자 아이디 텍스트값을 fetchFlickr의 인수로 전달해 호출
  if (e.target.className === "userID") fetchFlickr({ type: "user", userID: e.target.innerText });  //user타입 갤러리에는 useID라는 추가 프로퍼티로 유저아이디값을 전달
});

//flickr fetching함수
function fetchFlickr(opt) { //type이 opt라는 파라미터 객체안쪽에 들어가 있기 때문에 opt.type
  //참조링크 비교가 아닌 값 자체를 비교하기 위해서 opt객체를 강제로 문자화해서 stringifyOpt변수에 저장
  let stringifyOpt = JSON.stringify(opt);
  //문자화된 옵션객체 자체를 비교처리
  if (stringifyOpt === optString) return;
  //문자화된 옵션 객체를 전역변수는 optString에 저장해서 다음번 비교에 사용
  optString = stringifyOpt;

  const api_key = "d0053a4bfac353553d2d0337fd052214";
  const baseURL = `https://www.flickr.com/services/rest/?api_key=${api_key}&method=`;
  const myID = "201491599@N03";
  const method_mine = "flickr.people.getPhotos";
  const method_interest = "flickr.interestingness.getList";
  const method_search = "flickr.photos.search";
  let url_mine = `${baseURL}${method_mine}&user_id=${myID}&nojsoncallback=1&format=json`;  //type으로 특정사용자의 ID값을 전달 받은뒤 user_id쿼리에 연결하면 해당 사용자의 갤러리를 호출하는 요청 URL생성
  let url_user = `${baseURL}${method_mine}&user_id=${opt.userID}&nojsoncallback=1&format=json`;
  let url_interest = `${baseURL}${method_interest}&nojsoncallback=1&format=json`;
  let url_search = `${baseURL}${method_search}&tags=${opt.tags}&nojsoncallback=1&format=json`;  //opt로 전달된 tag프로퍼티의 값을 tag라는 쿼리값연동
  let result_url = "";
  if (opt.type === "mine") result_url = url_mine;
  if (opt.type === "interest") result_url = url_interest;  //type이 mine, interest가 아니면 특정 사용자 ID일테니 url_user요청 아이디를 result_url에 담아서 fetch함수에 전달
  if (opt.type === "user") result_url = url_user;  //전달된 opt.type값이 search이면 url_search 요청을 fetch함수에 전달
  if (opt.type === "search") result_url = url_search;

  fetch(result_url)
    .then((data) => data.json())
    .then((json) => {
      const picArr = json.photos.photo;
      createList(picArr);
    });
}

function createList(dataArr) {  //목록 생성 함수
  const list = document.querySelector(".list");
  let tags = "";

  dataArr.forEach(pic => {
    tags += `
        <li>
          <figure class='pic'>
            <img class='thumb' src="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_z.jpg" alt="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_b.jpg" />
          </div>
        </li>
      `;
  });
  list.innerHTML = tags;

  setDefImg();
}

function setDefImg() {   //이미지 엑박시 대체이미지 연결 함수
  const profilePic = document.querySelectorAll(".profile img");
  console.log(profilePic);

  profilePic.forEach(
    (imgEl) =>
    (imgEl.onerror = () =>
      imgEl.setAttribute(
        "src",
        "https://www.flickr.com/images/buddyicon.gif")));
}

function createModal(e) { //모달생성 함수
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

function removeModal() { //모달 제거함수
  document.querySelector(".modal").remove();
}