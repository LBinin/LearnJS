## 三次握手

### **标识**

过程中有如下 6 种 TCP 标志位：

- **SYN**（ synchronous 建立联机 ）
- **ACK**（ acknowledgement 确认 ）
- **PSH**（ push 传送 ）
- **FIN**（ finish 结束 ）
- **RST**（ reset 重置 ）
- **URG**（ urgent 紧急 ）

两个随机数：

- **Sequence number**（ 顺序号码 ）
- **Acknowledge number**（ 确认号码 ）

### **握手过程**

- **第一次握手**：

    主机 A 发送位码为 `SYN = 1`，随机产生 `seq number = 1234567` 的数据包到服务器，主机 B 由 `SYN = 1` 得知 A 要求**建立联机**；

- **第二次握手**：

    主机 B 收到联机请求后要**确认联机信息**，向 A 发送 `ack number = 主机 A 的 seq + 1`、`SYN = 1`、`ACK = 1`，随机产生 `seq = 7654321` 的包。

- **第三次握手**：

    主机 A 收到后检查 `ack number` 是否正确，即第一次发送的 `seq number+1`，以及位码 `ACK` 是否为 `1`，若正确，主机 A 会再发送 `ack number = 主机 B 的 seq + 1`、`ACK = 1`，主机 B 收到后确认 `seq` 值与 `ACK = 1` 则连接建立成功。

完成三次握手后，主机 A 与主机 B 可以开始传送数据。

### **状态变更**

> 在 TCP/IP 协议中，TCP 协议提供可靠的连接服务，采用三次握手建立一个连接。 

1. 第一次握手：建立连接时，客户端发送 `SYN` 包 `SYN = j` 到服务器，并进入 `SYN_SEND` 状态，等待服务器确认； 
2. 第二次握手：服务器收到 `SYN` 包，必须确认客户的 `SYN`，然后发送 `ACK` 包 `ACK = j + 1`，同时自己也发送一个 `SYN` 包 `SYN = k`，即 `SYN + ACK` 包，此时服务器进入 `SYN_RECV` 状态；
3. 第三次握手：客户端收到服务器的 `SYN＋ACK` 包，向服务器发送确认包 `ACK = k + 1`，此包发送完毕，客户端和服务器进入 `ESTABLISHED` 状态，完成三次握手。

总结：

- 第一次和第二次都要发送 `SYN` 标志位表示请求**建立联机**，随 `seq number` 一起发送。
- 第二次和第三次都要发送 `ACK` 标志位表示**确认**，随 `ack number` 一起发送。
- 每次 `ack number` 的值都是上一次接受到 `seq number` 值加 1。即：第二次发送的 `ack number` 是第一次发送的 `seq number + 1`；第三次发送的 `ack number` 是第二次发送的 `seq number + 1`。