const SocketIO = require("socket.io");
module.exports = (server, app) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);
  io.on("connection", (socket) => {
    socket.emit("bid", {
      nick: "kim",
      bid: 100,
      message: "회원리스트는 언제 알게되냐",
    });
    socket.on("reply", (data) => console.log(data));
    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    const roomId = referer
      .split("/")
      [referer.split("/").length - 1].replace(/\?.+/, "");
    socket.join(roomId);
    socket.on("disconnect", () => {
      socket.leave(roomId);
    });
  });
};
