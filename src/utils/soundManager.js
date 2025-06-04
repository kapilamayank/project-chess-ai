const sounds = {
    move: new Audio('/sounds/move-self.mp3'),
    check: new Audio('/sounds/move-check.mp3'),
    capture: new Audio('/sounds/capture.mp3'),
    promotion: new Audio('/sounds/promote.mp3'),
    castle: new Audio('/sounds/castle.mp3'),
    gameover: new Audio('/sounds/game-end.mp3'),
};
  
export const playSound = (type) => {
    const sound = sounds[type];
    if (sound) {
        sound.currentTime = 0;
        sound.play();
    }
};
