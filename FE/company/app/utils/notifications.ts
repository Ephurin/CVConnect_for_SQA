export function notifyUser() {
  try {
    const audio = new Audio("/ping.mp3");
    audio.volume = 0.8;
    audio.play().catch((err) => {
      console.error(err);
    });
  } catch (err) {
    console.error(err);
  }
}
