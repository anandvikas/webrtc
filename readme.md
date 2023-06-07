# webRTC project
I am working on this project to learn webRTC

## disclaimer : This project is not stable at current stage.
- works 90% on desktop-desktop connections.
- works 50% on desktop-mobile connections (if offer is generated from mobile browser and accepted at desktop browser).
- works 0% on mobile-mobile connections.

## Instructions to use.
- You have two options [Manual signaling/ Auto signaling]
- Manual signaling --> Create offer sdp and send to remote peer (using any messaging app) --> Paste offer at remote peer and generate answer --> send answer lo local peer --> paste answer in answer section --> add answer.
- Auto signaling --> This also works the same way but you dont have to exchange offer and answer manually, It is done with help of a web-socket server. You just have to exchange a connection code with remote peer.

Thanks...