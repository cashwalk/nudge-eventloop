import * as http from "http";

/*
 * 이벤트 루프를 이용해서 http 요청을 처리하는 프로그램
 */

//
// 메시지 큐
//

interface Message {
  req: http.IncomingMessage;
  res: http.ServerResponse;
}

const queue: Message[] = [];

//
// http 요청이 올 때마다 메시지 큐에 메시지를 추가한다
//

http
  .createServer((req, res) => {
    queue.push({ req, res });

    console.log(`Request received (queue size: ${queue.length})`);
  })
  .listen(8080, () => {
    console.log("Listening at http://localhost:8080");
  });

/*
 * 이벤트 루프 구현
 */

function tick() {
  console.log(`tick`);

  if (queue.length > 0) {
    for (const message of queue) {
      const { req, res } = message;
      res.end(`url is ${req.url}`);
    }

    console.log(`Processed ${queue.length} request(s)`);

    queue.length = 0;
  }
}

function main() {
  //
  // 1초마다 tick을 실행시키는 무한 루프
  //

  const update = () => {
    tick();

    setTimeout(() => {
      update();
    }, 1000);
  };

  update();

  //
  // 실제 C++ 에서는 다음과 같이 동기적인 무한 루프로 구현한다
  // https://github.com/libuv/libuv/blob/9e59aa1bc8c4d215ea3e05eafec7181747206f67/src/unix/core.c#L390
  //
  // while (true) {
  //   tick();
  // }
  ///
}

main();
