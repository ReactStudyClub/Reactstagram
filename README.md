# 인스타그램 클론코딩 프로젝트

# 실행 : 깃 클론후 npm install 후 npm start 


* 빌드 1. npm run build 
*      2. firebase deploy 후 5분정도 기다리면 적용




회원가입 성공시 유니크 아이디를 받아서 데이터 베이스에 유저 데이터 생성

파이어베이스 팁 

1.   firebase_db.ref(`posts`).orderByChild('date').equalTo(5).once('value').then((snapshot) => {
         setPosts(snapshot.val());
      })
          //date 값이 넘버 5 인 객체 찾기

2. 

3. 테스트
