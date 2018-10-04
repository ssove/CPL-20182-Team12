<<순서>>
1.npm init
2.npm install --save fd connect mongodb mongoose socket.io
3.node server



<<이거 안씀>>
1. mongodb를 다운받는다
2. 원하는 디렉토리를 만든다 (md data)
3. 이 데이터로 db가 열리도록 만들다. 패스 새로지정 mongobd ★bin 폴더서 실행★
(mongod --dbpath D:\capstone\web_app1\data)

C:\Program Files\MongoDB\Server\4.0\bin



<<events.js:167
      throw er; // Unhandled 'error' event
의 문제는 아래와 같이 죽인다.>>

윈도우(Window)에서 사용 포트 확인 및 프로세스 KILL
1. 특정포트가 열려있는지 확인
- netstat -na | findstr "포트"

2. 열려 있는 포트의 PID 확인
- netstat -nao | findstr "포트"

3. PID 찾기
- tasklist | findstr "PID번호"

4. 프로세스 죽이기
- taskkill /f /pid "PID번호"

<<CSS는 나중에>>

<<다른 호스트...ㅜㅜ>>